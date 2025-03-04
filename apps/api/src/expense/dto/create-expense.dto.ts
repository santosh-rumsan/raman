import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { Currency, InvoiceType } from '@rumsan/raman/types/enums';
import { CreateExpense } from '@rumsan/raman/types/expense.type';

export class CreateExpenseDto implements CreateExpense {
  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Title of the Expense',
    example: 'Food',
    type: String,
  })
  description: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Currency of the Expense',
    example: Currency.NPR,
  })
  currency: Currency;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Amount of the Expense',
    example: 10000,
    type: Number,
  })
  amount: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Project Id',
    example: '2131ddw3a',
    type: String,
  })
  projectId?: string;

  @IsNotEmpty()
  @IsEnum(InvoiceType, {
    message: `invoiceType must be one of ${Object.values(InvoiceType).join(', ')}`,
  })
  @ApiProperty({
    example: 'ESTIMATE',
  })
  invoiceType: InvoiceType;

  @ValidateIf((obj) => obj.invoiceType === InvoiceType.VAT)
  @IsNumber()
  @Min(0.001, {
    message: 'VAT amount must be greater than 0 if invoiceType is VAT',
  })
  @ApiProperty({
    example: 23,
  })
  vatAmount?: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Category Id',
    example: 'xsjbcdbc829',
    type: String,
  })
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Account Id of the User',
    example: '2131ddw3a',
    type: String,
  })
  accountId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Department Id of the User',
    example: '2131ddw3a',
    type: String,
  })
  departmentId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'source',
    example: 'manual',
    type: String,
  })
  source?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'remarks of the expense',
    example: 'food expense',
    type: String,
  })
  remarks?: string;
}

export class CreateManyExpensesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExpenseDto)
  expenses: CreateExpenseDto[];
}
