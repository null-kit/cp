import { z } from 'zod';
import { hashSync } from 'bcrypt';

export const userSchema = z.object({
  name: z.string('Please enter name').min(3, 'Please enter name'),
  email: z.email('Please enter valid email').toLowerCase(),
  password: z
    .string('Please enter password')
    .min(10, 'Please enter password (min. 10)')
    .max(72, 'Password is too long (max. 72)')
    .transform((value) => hashSync(value, 10))
});
