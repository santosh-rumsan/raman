import { Optional } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAccountTxnDto {
  @ApiProperty({ description: 'Amount of the transaction' })
  @IsString()
  txnAmount: string;

  @ApiProperty({
    description: 'Date of the transaction',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  txnDate: Date;

  @ApiProperty({ description: 'Unique transaction identifier' })
  @IsString()
  txnId: string;

  @ApiProperty({ description: 'Currency code for the transaction' })
  @IsString()
  txnCurrencyCode: string;

  @ApiProperty({ description: 'Description of the transaction' })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Transaction Code (e.g., (C) credit, (D) debit)',
  })
  @IsString()
  txnType: string;

  @ApiProperty({ description: 'Debit amount of the transaction' })
  @IsNumber()
  debitAmount: number;

  @ApiProperty({ description: 'Credit amount of the transaction' })
  @IsNumber()
  creditAmount: number;

  @ApiProperty({ description: 'Current balance after the transaction' })
  @IsNumber()
  @Optional()
  balanceAmount: number;

  @ApiPropertyOptional({ description: 'Cheque number if applicable' })
  @IsOptional()
  @IsString()
  @Optional()
  chequeNumber?: string;

  @ApiProperty({
    description: 'Posted date of the transaction',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @Optional()
  pstdDate: Date;
}
