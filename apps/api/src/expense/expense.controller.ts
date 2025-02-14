import 'multer';
import * as Papa from 'papaparse';

import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { xRC } from '@rumsan/extensions/decorators';
import { ACTIONS, APP, SUBJECTS } from '@rumsan/raman/constants/index';
import { tRC } from '@rumsan/sdk/types';
import { AbilitiesGuard, CheckAbilities, JwtGuard } from '@rumsan/user';
import { ApiFile } from '../decorator/ApiBody';
import { CreateExpenseDto } from './dto/create-expense.dto';
import {
  DeleteExpenseDto,
  GetExpenseDto,
  UpdateExpenseDto,
} from './dto/update-expense.dto';
import { ErrorManager } from './errorHandling';
import { ExpenseService } from './expense.service';
import { csvSchema } from './expense.validation';

@Controller('expenses')
@ApiTags('Expense')
@ApiBearerAuth(APP.JWT_BEARER)
@UseGuards(JwtGuard, AbilitiesGuard)
export class ExpenseController {
  private logger = new Logger(ExpenseController.name);
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @CheckAbilities({ actions: ACTIONS.CREATE, subject: SUBJECTS.EXPENSE })
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @UseInterceptors(FilesInterceptor('attachments'))
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() dto: CreateExpenseDto,
    @xRC() rc: tRC,
  ) {
    return this.expenseService.create(dto, files, rc);
  }

  @Post(':id/attachments')
  @CheckAbilities({ actions: ACTIONS.UPDATE, subject: SUBJECTS.EXPENSE })
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @UseInterceptors(FilesInterceptor('attachments'))
  async addAttachments(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @xRC() rc: tRC,
  ) {
    return this.expenseService.addAttachments(id, files, rc);
  }

  @Delete(':id/attachments/:hash')
  @CheckAbilities({ actions: ACTIONS.UPDATE, subject: SUBJECTS.EXPENSE })
  async deleteAttachment(
    @Param('id') id: string,
    @Param('hash') hash: string,
    @xRC() rc: tRC,
  ) {
    return this.expenseService.deleteAttachment(id, hash, rc);
  }

  @Get()
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.EXPENSE })
  //TODO:fix any
  getExpenses(@Query() query: GetExpenseDto): any {
    return this.expenseService.findAll(query);
  }

  @Patch(':id')
  @CheckAbilities({ actions: ACTIONS.UPDATE, subject: SUBJECTS.EXPENSE })
  updateStatus(
    @Param('id') id: string,
    @Body() updatePayload: UpdateExpenseDto,
    @xRC() rc: tRC,
  ) {
    return this.expenseService.update(id, updatePayload, rc);
  }

  @Delete(':id')
  @CheckAbilities({ actions: ACTIONS.DELETE, subject: SUBJECTS.EXPENSE })
  deleteExpense(
    @Param('id') id: string,
    @Body() deleteExpenseDto: DeleteExpenseDto,
    @xRC() rc: tRC,
  ) {
    return this.expenseService.delete(id, deleteExpenseDto, rc);
  }

  @Post('/csv-upload')
  @CheckAbilities({ actions: ACTIONS.CREATE, subject: SUBJECTS.EXPENSE })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  convert(@UploadedFile() file: Express.Multer.File) {
    const csvData = file.buffer.toString('utf-8');
    const { data: jsonData } = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });

    const parsedData = jsonData.map((item: any, idx) => {
      try {
        const result = csvSchema.parse(item);
        return result;
      } catch (error) {
        ErrorManager.getInstance().addError(`${idx + 1}`, error.message);
      }
    });
    return this.expenseService.csvCreate(parsedData);
  }

  @Get(':cuid')
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.EXPENSE })
  getOneExpense(@Param('cuid') cuid: string) {
    return this.expenseService.getSingleExpense(cuid);
  }
}
