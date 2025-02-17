import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAccount } from '@rumsan/raman/types/account.type';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAccountDto implements CreateAccount {
  @ApiProperty({ example: 'Global IME Bank' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '24000012000012' })
  @IsNotEmpty()
  @IsString()
  acctNumber: string;

  @ApiProperty({ example: 'NPR' })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({ example: '12000' })
  @IsInt()
  @IsOptional()
  balance: number;
}

export class GetAccountDto {
  @ApiPropertyOptional({ example: 'createdAt' })
  @IsString()
  @IsOptional()
  sort?: string;

  @ApiPropertyOptional({ example: 'asc' })
  @IsString()
  @IsOptional()
  order?: 'asc' | 'desc';

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ example: '10' })
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ example: 'Global IME' })
  @IsString()
  @IsOptional()
  name?: string;
}
