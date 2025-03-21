import { z } from 'zod';

export const reimbursementSchema = z.object({
  categoryId: z.string().nonempty('Category is required'),
  accountId: z.string().nonempty('Bank Account is required'),
  amount: z.coerce
    .number({
      required_error: 'Amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .positive()
    .min(1, { message: 'Amount should be at least 1' }),
  date: z.date({
    required_error: 'Reimbursement Date is required',
  }),
  //attachments: z.array(),
  // bankTransferFees: z
  //   .number()
  //   .nonnegative('Bank transfer fees must be non-negative')
  //   .optional(),
  bankTransferFees: z.coerce
    .number({
      invalid_type_error: 'Amount must be a number',
    })
    .min(0, { message: 'Amount should be at least 0' }),
  remarks: z.string().optional(),
});

export type Reimbursement = z.infer<typeof reimbursementSchema>;
