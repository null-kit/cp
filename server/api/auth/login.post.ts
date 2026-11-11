import bcrypt from 'bcrypt';
import { z } from 'zod';

const INVALID = [{ message: 'Email or password is invalid', path: 'password' }];
const LIMITED = 'Too many login attempts, please try again in 15 minutes';

let dummyHash: string | undefined;

export default defineEventHandler(async (event) => {
  const loginSchema = z.object({
    email: z.email('Please enter valid email').transform((value) => value.toLowerCase()),
    password: z.string('Please enter password').min(1, 'Please enter password').max(256)
  });

  const body = await readBody(event);
  const data = validateSchema(loginSchema.safeParse(body || {}));

  rateLimit(event, { key: 'login', max: 10, windowMs: 15 * 60_000, path: 'password', message: LIMITED });

  rateLimit(event, {
    key: 'login-email',
    id: data.email,
    max: 10,
    windowMs: 15 * 60_000,
    path: 'password',
    message: LIMITED
  });

  const user = await prisma.user.findUnique({
    where: { email: data.email }
  });

  dummyHash ??= await bcrypt.hash('cp-dummy-password', 10);

  const comparePassword = await bcrypt.compare(data.password, user?.password ?? dummyHash);

  if (!user || !comparePassword) {
    throw createError({ status: 401, statusMessage: 'Unauthorized', data: INVALID });
  }

  const sessionUser = { id: user.id, name: user.name, email: user.email };

  await createSession(event, sessionUser);

  return {
    message: 'Logged in successfully',
    user: sessionUser
  };
});
