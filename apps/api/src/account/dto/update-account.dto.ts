import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateAccountDto } from './create-account.dto';

export class UpdateAccountDto extends PartialType(CreateAccountDto) { }

export class ListAccountDto {
    @ApiPropertyOptional({ example: true })
    @IsOptional()
    show_archived: boolean;

    @ApiPropertyOptional({ example: 1 })
    @IsNumber()
    page?: number;

    @ApiPropertyOptional({ example: '10' })
    @IsNumber()
    limit?: number;

    @IsOptional()
    @IsString()
    sort?: string;

    @IsOptional()
    @IsString()
    order?: 'asc' | 'desc' = 'desc';
}

export class AccountFilterDto {

    @IsOptional()
    @IsString()
    name?: string;

}