import { z } from 'zod';
export const projectSchema = z.object({
  name: z
    .string()
    .nonempty('Project name is required')
    .refine((value) => /^[A-Za-z0-9\s]*$/.test(value), {
      message: 'Invalid project name. Use letters, numbers, and spaces only.',
    }),
  departmentId: z.string().nonempty('Department is required'),
  owner: z.string(),
});
