import { Currency, InvoiceType } from '@rumsan/raman/types/enums';
import { ExpenseBase } from '@rumsan/raman/types/expense.type';

import * as z from 'zod';

export type Expense = Omit<
  ExpenseBase,
  'amount' | 'vatAmount' | 'attachments'
> & {
  amount?: string | null;
  vatAmount?: string | null;
  attachments?: string[];
};

export const expenseSchema = z
  .object({
    accountId: z.string().min(1, 'Payment account is required'),
    departmentId: z.string().min(1, 'Department is required'),
    date: z.date().refine((date) => !isNaN(date.getTime()), {
      message: 'Date must be a valid date',
    }),
    description: z.string().min(1, 'Description is required'),
    projectId: z.string().min(1, 'Project is required'),
    currency: z.nativeEnum(Currency).refine((type) => !!type, {
      message: 'Currency is required',
    }),
    amount: z.coerce
      .number({
        required_error: 'Amount is required',
        invalid_type_error: 'Amount must be a number',
      })
      .positive()
      .min(1, { message: 'Amount should be at least 1' }),
    invoiceType: z.nativeEnum(InvoiceType).refine((type) => !!type, {
      message: 'Invoice Type is required',
    }),
    categoryId: z.string().min(1, 'Category is required'),
    remarks: z.string().optional(),
    attachments: z.any(),
    vatAmount: z.coerce.number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.invoiceType === InvoiceType.VAT && !data.vatAmount) {
      ctx.addIssue({
        path: ['vatAmount'],
        message: 'VAT Amount is required when Invoice Type is VAT',
        code: 'unrecognized_keys',
        keys: ['vatAmount'],
      });
    }
  });
