import { Injectable } from '@nestjs/common';
import { PrismaService } from '@rumsan/prisma';

@Injectable()
export class MiscService {
  constructor(private prisma: PrismaService) {}

  async getLookupData() {
    const departments = await this.prisma.department.findMany({
      select: {
        name: true,
        cuid: true,
        meta: true,
      },
    });

    const categories = await this.prisma.category.findMany({
      select: {
        name: true,
        group: true,
        cuid: true,
        meta: true,
      },
      orderBy: [{ group: 'asc' }, { name: 'asc' }],
    });

    const projects = await this.prisma.project.findMany({
      select: {
        name: true,
        cuid: true,
        meta: true,
      },
    });

    const accounts = await this.prisma.account.findMany({
      select: {
        name: true,
        cuid: true,
      },
    });

    const users = await this.prisma.userDetails.findMany({
      select: {
        name: true,
        cuid: true,
      },
    });

    return {
      departments,
      categories,
      accounts,
      projects,
      users,
    };
  }
}
