import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAccount } from '@rumsan/raman/types/account.type';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAccountDto implements CreateAccount {
  @ApiProperty({ example: 'Global IME Bank' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'GLBB' })
  @IsOptional()
  @IsString()
  bankCode?: string;

  @ApiProperty({ example: '24000012000012' })
  @IsNotEmpty()
  @IsString()
  acctNumber: string;

  @ApiProperty({ example: 'NPR' })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({ example: '12000' })
  @IsNumber()
  @IsOptional()
  balance: number;
}

export class GetAccountDto {
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  show_archived: boolean;
}
