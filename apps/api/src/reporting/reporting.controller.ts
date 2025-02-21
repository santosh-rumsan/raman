import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReportingDTO } from './dto/create-report';
import { ReportingService } from './reporting.service';

@ApiTags('Reporting')
@Controller('reporting')
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @ApiOperation({
    summary: 'Generate a report with total expenses by category',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Filter by year (YYYY)',
  })
  @ApiQuery({
    name: 'month',
    required: false,
    description: 'Filter by month (1-12)',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: ReportingDTO,
  })
  @Get('category')
  async getCategoryReport(
    @Query('year') year?: number,
    @Query('month') month?: number,
  ): Promise<ReportingDTO[]> {
    return this.reportingService.generateCategoryReport(year, month);
  }
}
