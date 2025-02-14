import { z } from 'zod';

export const csvSchema = z.object({
  title: z.string().min(1),
  amount: z.string().transform((str) => {
    const number = Number(str);
    if (isNaN(number)) {
      throw new Error('Invalid number');
    }
    return number;
  }),
  entityId: z.string().min(1),
  categoryId: z.string().min(1),
  accountId: z.string().min(1),
  source: z.string().default('manual'),
  remarks: z.string().min(1),
  isArchived: z.boolean().default(false).optional(),
});

export const ErrorArray: string[] = [];
