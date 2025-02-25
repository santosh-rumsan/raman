import { Currency, InvoiceType } from '@rumsan/raman/types/enums';
import { InvoiceBase } from '@rumsan/raman/types/invoice.type';


import * as z from 'zod';

export type Invoice = Omit<
  InvoiceBase,
  'amount' | 'vatAmount' | 'attachments'
> & {
  amount?: string | null;
  vatAmount?: string | null;
  attachments?: string[];
};

export const invoiceSchema = (additional?: object) => {
  let _schema = {
    amount: z.coerce
      .number({
        required_error: 'Amount is required',
        invalid_type_error: 'Amount must be a number',
      })
      .positive()
      .min(1, { message: 'Amount should be at least 1' }),
    categoryId: z.string().min(1, 'Category is required'),
    description: z.string().min(1, 'Description is required'),
    projectId: z.string().nonempty({ message: 'Project is required' }),
    receipts: z.any(),
    currency: z.nativeEnum(Currency).refine((type) => !!type, {
      message: 'Currency is required',
    }),
    date: z
      .date()
      .refine((date) => !isNaN(date.getTime()), {
        message: 'Recorded date must be a valid date',
      })
      .optional(),
    userId: z.string().min(1, 'User is required'),
    invoiceType: z.nativeEnum(InvoiceType).refine((type) => !!type, {
      message: 'Invoice Type is required',
    }),
    vatAmount: z.coerce
      .number()
      .nonnegative('vatAmount is requires')
      .optional(),
  };

  if (additional) {
    _schema = { ..._schema, ...additional };
  }
  return z.object(_schema).superRefine((data, ctx) => {
    if (data.invoiceType === InvoiceType.VAT && !data.vatAmount) {
      ctx.addIssue({
        path: ['vatAmount'],
        message: 'VAT Amount is required when Invoice Type is "Vat"',
        code: 'unrecognized_keys',
        keys: ['vatAmount'],
      });
    }
  });
};
