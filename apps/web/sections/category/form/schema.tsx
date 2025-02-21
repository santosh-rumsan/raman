import { z } from 'zod';

export const categorySchema = z.object({
  name: z
    .string()
    .nonempty('Category name is required')
    .regex(/^(?!\s)(?!.*\s$)[A-Za-z\s]+$/, {
      message: 'Invalid category name. Use letters, numbers, and spaces only.',
    }),
  group: z.string(),
});
