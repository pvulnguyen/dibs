import {z} from 'zod';

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must contain at least 8 characters'),
});

export type UserCredentials = z.infer<typeof authSchema>;
