import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const userBaseSchema = z.object({
  username: z
    .string()
    .min(5, 'Username must be 5 characters or more')
    .regex(/^[a-zA-Z0-9]+$/, "Username can't contain special characters")
    .refine((v) => !/^[0-9]/.test(v), {
      message: 'Username cannot start with a number',
    })
    .refine((v) => !/test/i.test(v), {
      message: 'Username must be a real name',
    }),
  role: z.string().min(1, 'Role is required'),
});

export const userCreateSchema = userBaseSchema.extend({
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const userUpdateSchema = userBaseSchema.extend({
  password: z.string().optional().or(z.literal('')).refine((val) => !val || val.length >= 8, {
    message: 'Password must be at least 8 characters long',
  }),
}); 