import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Currency, InvoiceType } from '@rumsan/raman/types/enums/index';
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

  @IsOptional()
  @ApiProperty({
    example: 'ESTIMATE',
  })
  invoiceType: InvoiceType;

  @IsOptional()
  @ApiProperty({
    example: '23',
  })
  vatAmount: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Category Id',
    example: 'xsjbcdbc829',
    type: String,
  })
  categoryId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Account Id of the User',
    example: '2131ddw3a',
    type: String,
  })
  accountId: string;

  @IsString()
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

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'isPending of the expenses',
    example: true,
    type: Boolean,
  })
  isPending?: boolean;
}

export class CreateManyExpensesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExpenseDto)
  expenses: CreateExpenseDto[];
}
