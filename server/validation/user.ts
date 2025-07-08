import { z } from 'zod/v4';
import { hashSync } from 'bcrypt';

export const userSchema = z.object({
  name: z.string('Please enter name').min(3, 'Please enter name'),
  email: z.email('Please enter valid email'),
  password: z
    .string('Please enter password')
    .min(6, 'Please enter password (min. 6)')
    .transform((value) => hashSync(value, 10))
});
