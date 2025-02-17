import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { createId } from '@paralleldrive/cuid2';
import { PaginatorTypes, PrismaService, paginator } from '@rumsan/prisma';
import { EVENTS } from '@rumsan/raman/constants/index';
import { FileAttachment } from '@rumsan/raman/types';
import { Expense } from '@rumsan/raman/types/expense.type';
import { tRC } from '@rumsan/sdk/types';
import { GDriveService } from '../utils/gdrive.utils';
import { createIpfsHash } from '../utils/ipfs.utils';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { GetExpenseDto, UpdateExpenseDto } from './dto/update-expense.dto';
import { ErrorManager } from './errorHandling';

const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 20 });

@Injectable()
export class ExpenseService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
    private gdrive: GDriveService,
  ) {}

  async create(
    expenseData: CreateExpenseDto,
    files: Express.Multer.File[],
    ctx: tRC,
  ): Promise<Expense> {
    const data: Expense = {
      cuid: createId(),
      ...expenseData,
      createdBy: ctx.currentUser?.cuid,
      updatedBy: ctx.currentUser?.cuid,
    };

    const newExpense = await this.prisma.$transaction(async (prisma) => {
      return prisma.expense.create({
        data: {
          ...data,
          attachments: files.length > 0 ? 'pending' : undefined,
        },
      });
    });

    if (files.length > 0) {
      this.eventEmitter.emit(EVENTS.EXPENSE.UPLOAD, data, files, {
        clientId: ctx.clientId,
        currentUser: ctx.currentUser,
      });
    }

    this.eventEmitter.emit(EVENTS.EXPENSE.CREATED, newExpense);
    return newExpense as Expense;
  }

  async update(cuid: string, payload: UpdateExpenseDto, ctx: tRC) {
    await this.findFirstOrThrow(cuid);

    const data = {
      ...payload,
      updatedBy: ctx.currentUserId,
    };
    this.eventEmitter.emit(EVENTS.EXPENSE.UPDATED, data);

    return this.prisma.expense.update({
      where: { cuid },
      data,
    });
  }

  async addAttachments(cuid: string, files: Express.Multer.File[], ctx: tRC) {
    const expense = await this.prisma.expense.findUnique({
      where: { cuid },
    });
    if (!expense) throw new Error('Expense not found');

    const attachments: FileAttachment[] =
      typeof expense.attachments === 'string' || expense.attachments == null
        ? []
        : (expense.attachments as [FileAttachment]);

    for (const file of files) {
      const attachment: FileAttachment = {
        hash: await createIpfsHash(file.buffer),
        url: 'pending',
        filename: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
      };
      attachments.push(attachment);

      this.eventEmitter.emit(
        EVENTS.EXPENSE.UPLOAD,
        {
          cuid: expense.cuid,
          file,
        },
        { clientId: ctx.clientId },
      );
    }

    return await this.prisma.expense.update({
      where: { cuid },
      data: {
        attachments,
        updatedBy: ctx.currentUser ? ctx.currentUser.cuid : null,
      },
    });
  }

  async deleteAttachment(cuid: string, attachmentHash: string, ctx: tRC) {
    const expense = await this.prisma.expense.findUnique({
      where: { cuid },
    });
    if (!expense) throw new Error('Expense not found');

    const attachments = expense.attachments as FileAttachment[];
    const attachment = attachments.find(
      (attachment) => attachment.hash === attachmentHash,
    );
    if (!attachment) throw new Error('Attachment not found');

    if (attachment.cloudStorageId) {
      await this.gdrive.delete(attachment.cloudStorageId);
    }

    const updatedAttachments = attachments.filter(
      (attachment) => attachment.hash !== attachmentHash,
    );

    return await this.prisma.expense.update({
      where: { cuid },
      data: {
        attachments: updatedAttachments,
        updatedBy: ctx.currentUser ? ctx.currentUser.cuid : null,
      },
    });
  }

  async findAll(query: GetExpenseDto) {
    const where: Record<any, any> = {
      deletedAt: null,
    };
    if (query.title) {
      where.title = query.title;
    }
    return paginate(
      this.prisma.expense,
      {
        where,
        include: {
          Project: { select: { name: true } },
          Category: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
      {
        page: query.page,
        perPage: query.limit,
      },
    );
  }

  async delete(cuid: string, ctx: tRC) {
    await this.findFirstOrThrow(cuid);
    const data = {
      cuid,
      updatedBy: ctx.currentUserId,
      deletedAt: new Date(),
    };
    this.eventEmitter.emit(EVENTS.EXPENSE.ARCHIVED, data);
    return (await this.prisma.expense.update({
      where: { cuid },
      data,
    })) as Expense;
  }

  async csvCreate(file: any[]) {
    await this.checkDuplicateValues(file);
    const errors = ErrorManager.getInstance().listError();
    ErrorManager.getInstance().removeError();

    if (errors.length) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    } else {
      try {
        const result = await this.prisma.expense.createMany({
          data: file,
        });
        return result;
      } catch (error) {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  // Helper function start from here

  async checkDuplicateValues(objects: any[]) {
    const valuesSets: Set<string>[] = [];

    // Create sets for each object's values
    for (const obj of objects) {
      if (obj) {
        const valuesSet = new Set(
          Object.values(obj).map((value) => JSON.stringify(value)),
        );
        valuesSets.push(valuesSet);
      }
    }
    // Compare each set with all other sets
    for (let i = 0; i < valuesSets.length; i++) {
      for (let j = i + 1; j < valuesSets.length; j++) {
        if (await this.compareSets(valuesSets[i], valuesSets[j])) {
          ErrorManager.getInstance().addError(
            `${i + 1} and ${j + 1}`,
            `Duplicate values found `,
          );
        }
      }
    }
  }

  async compareSets(set1: Set<string>, set2: Set<string>) {
    if (set1.size !== set2.size) {
      return false;
    }
    for (const value of set1) {
      if (!set2.has(value)) {
        return false;
      }
    }
    return true;
  }

  async getSingleExpense(cuid: string) {
    return await this.prisma.expense.findUnique({
      where: { cuid },

      include: {
        Project: { select: { name: true } },
        Category: { select: { name: true } },
        Department: { select: { name: true } },
        Account: { select: { name: true } },
      },
    });
  }
  // async sendFiletoAwsPublic(payload: any): Promise<any> {
  //   const { filename, data, mimeType } = payload;
  //   const bucket = this.config.get('AWS_BUCKET');
  //   const folder = this.config.get('AWS_FOLDER');
  //   const readableStream = Readable.from(data);
  //   const upload = new Upload({
  //     client: this.s3,
  //     params: {
  //       Body: readableStream,
  //       Bucket: bucket,
  //       Key: `${folder}/${filename}`,
  //       Tagging: folder,
  //       ACL: 'public-read',
  //       ContentType: mimeType,
  //     },
  //   });

  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const data = await upload.done();
  //       resolve(data);
  //     } catch (error) {
  //       reject(error);
  //     }
  //   });
  // }

  private async findFirstOrThrow(cuid: string, getDeleted = false) {
    const where = { cuid };
    if (!getDeleted) {
      where['deletedAt'] = null;
    }
    return this.prisma.expense
      .findFirstOrThrow({
        where,
      })
      .catch((error) => {
        throw new Error('Category does not exists');
      });
  }
}
