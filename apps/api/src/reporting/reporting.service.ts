import { Injectable } from '@nestjs/common';
import { PrismaService } from '@rumsan/prisma';
import { ReportingDTO } from './dto/create-report';

@Injectable()
export class ReportingService {
  constructor(private readonly prisma: PrismaService) {}

  async generateCategoryReport(
    year?: number,
    month?: number,
  ): Promise<ReportingDTO[]> {
    const selectedYear = year ?? new Date().getFullYear();
    const selectedMonth = month ?? new Date().getMonth() + 1;

    const groupedExpenses = await this.prisma.expense.groupBy({
      by: ['categoryId'],
      where: {
        date: {
          gte: new Date(`${selectedYear}-${selectedMonth}-01`),
          lt: new Date(`${selectedYear}-${selectedMonth + 1}-01`),
        },
      },
      _sum: {
        amount: true,
      },
    });

    const reports: ReportingDTO[] = await Promise.all(
      groupedExpenses.map(async (group) => {
        const category = await this.prisma.category.findUnique({
          where: { cuid: group.categoryId },
        });

        return {
          categoryId: category?.cuid ?? '',
          categoryName: category?.name ?? '',
          totalExpenses: group._sum.amount ?? 0,
        };
      }),
    );

    return reports;
  }
}
