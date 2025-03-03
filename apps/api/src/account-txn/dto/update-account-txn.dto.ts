import { ApiPropertyOptional } from '@nestjs/swagger';
import { AccountTxnStatus, AccountTxnType } from '@rumsan/raman/types/enums';

import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAccountTxnDto {
  @ApiPropertyOptional({
    description: 'Optional identifier for the related expense',
  })
  @IsOptional()
  @IsString()
  expenseId?: string;

  @ApiPropertyOptional({
    description: 'Status of the transaction',
    enum: AccountTxnStatus,
    default: AccountTxnStatus.UNRECONCILED,
  })
  @IsOptional()
  @IsEnum(AccountTxnStatus)
  status?: AccountTxnStatus;

  @ApiPropertyOptional({
    description: 'Type of the transaction',
    enum: AccountTxnType,
  })
  @IsOptional()
  @IsEnum(AccountTxnType)
  type?: AccountTxnType;
}

export class GetAccountTxnDto {
  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ example: '10' })
  @IsNumber()
  limit?: number = 100;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  order?: 'asc' | 'desc' = 'asc';

  @IsOptional()
  @IsString()
  description?: string;
}
