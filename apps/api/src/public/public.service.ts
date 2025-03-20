import { Injectable } from '@nestjs/common';
import { PrismaService } from '@rumsan/prisma';
import { InvoiceStatusType } from '@rumsan/raman/types/enums';
import { ReceiptApprovalDto } from 'src/invoice/dto/invoice-misc.dto';

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
              owner: true,
              Department: {
                select: {
                  name: true,
                  owner: true,
                },
              },
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

  async invoiceApproval(
    approvalChallenge: string,
    payload: ReceiptApprovalDto,
  ) {
    console.log('payload', payload);
    const status =
      payload.status === 'APPROVED'
        ? InvoiceStatusType.APPROVED
        : InvoiceStatusType.REJECTED;
    const updatedInvoice = await this.prisma.invoice.update({
      where: { approvalChallenge },
      data: {
        status,
        approvalDetails: {
          date: new Date(),
          isApproved: payload.status === 'APPROVED',
          remarks: payload.remarks,
        },
      },
    });
    return updatedInvoice;
  }
}
