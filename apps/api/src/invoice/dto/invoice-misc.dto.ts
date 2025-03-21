import {
  ReceiptApproval,
  ReceiptReimbursement,
} from '@rumsan/raman/types/invoice.type';

import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

// export class InvoiceListParamsDto {
//   @IsString()
//   @IsOptional()
//   @ApiProperty({
//     description: 'Page Number',
//     example: '1',
//     required: false,
//   })
//   page?: string;

//   @IsString()
//   @IsOptional()
//   @ApiProperty({
//     description: 'Number of Invoices to fetch at a time',
//     example: '10',
//     required: false,
//   })
//   perPage?: string;

//   @IsString()
//   @IsOptional()
//   @ApiProperty({
//     description: 'Search By Name',
//     required: false,
//   })
//   name?: string;

//   @IsString()
//   @IsOptional()
//   orderby?: string;

//   @IsString()
//   @IsOptional()
//   order?: string;

//   @IsString()
//   @IsOptional()
//   startDate?: string;

//   @IsString()
//   @IsOptional()
//   endDate?: string;
// }

export class ReceiptApprovalDto implements ReceiptApproval {
  @IsString()
  @IsEnum(['APPROVED', 'REJECTED'])
  @IsNotEmpty()
  status: 'APPROVED' | 'REJECTED';

  @IsString()
  @IsOptional()
  remarks?: string;
}

export class ReceiptReimbursementDto implements ReceiptReimbursement {
  @IsDate()
  date: Date;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  accountId: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsOptional()
  @IsNumber()
  bankTransferFees?: number;

  @IsOptional()
  remarks?: string;
}
