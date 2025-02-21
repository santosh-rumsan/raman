import { z } from 'zod';
export const departmentSchema = z.object({
  name: z
    .string()
    .nonempty('Department name is required')
    .refine((value) => /^[A-Za-z0-9\s]*$/.test(value), {
      message:
        'Invalid department name. Use letters, numbers, and spaces only.',
    }),
  group: z.string(),
  owner: z.string(),
});
