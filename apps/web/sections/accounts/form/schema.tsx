import { Currency } from '@rumsan/raman/types';
import { z } from 'zod';

export const accountSchema = z.object({
  name: z.string().nonempty('Account name is required'),
  acctNumber: z.string().nonempty('Account number is required'),
  currency: z.nativeEnum(Currency).refine((type) => !!type, {
    message: 'Currency is required',
  }),
  balance: z.coerce
    .number({
      required_error: 'Balance is required',
      invalid_type_error: 'Balance must be a number',
    })
    .positive()
    .min(1, { message: 'balance should be at least 1' }),
});
