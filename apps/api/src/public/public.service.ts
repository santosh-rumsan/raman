import { Injectable } from '@nestjs/common';
import { InvoiceStatusType } from '@prisma/client';
import { PrismaService } from '@rumsan/prisma';
import { UpdatePublicDto } from './dto/update-public.dto';

@Injectable()
export class PublicService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.category.findMany();
  }

  async getInvoicesByChallange(approvalChallenge: string) {
    try {
      const findInvoice = await this.prisma.invoice.findUnique({
        where: { approvalChallenge },
        include: {
          Category: {
            select: {
              name: true,
            },
          },
          Project: {
            select: {
              name: true,
            },
          },
          User: true,
        },
      });
      return findInvoice;
    } catch (err) {
      throw err.message;
    }
  }

  async rejectInvoice(approvalChallenge: string, payload: UpdatePublicDto) {
    const updatedInvoice = await this.prisma.invoice.update({
      where: { approvalChallenge },
      data: {
        reason: payload.reason,
        isApproved: false,
        status: InvoiceStatusType.REJECTED,
      },
    });
    return updatedInvoice;
  }

  async approveInvoice(approvalChallenge: string, payload: UpdatePublicDto) {
    const updatedInvoice = await this.prisma.invoice.update({
      where: { approvalChallenge },
      data: {
        ...payload,
        isApproved: true,
        status: InvoiceStatusType.APPROVED,
      },
    });
    return updatedInvoice;
  }
}
