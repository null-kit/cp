import bcrypt from 'bcrypt';
import z from 'zod/v4';

export default defineEventHandler(async (event) => {
  const loginSchema = z.object({
    email: z.email('Please enter valid email').transform((value) => value.toLowerCase()),
    password: z.string('Please enter password (min. 6)').min(6, 'Password is too short (min. 6)')
  });

  const body = await readBody(event);
  const data = validateSchema(loginSchema.safeParse(body || {}));

  const user = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (!user) {
    throw createError({
      status: 401,
      statusMessage: 'Unauthorized',
      data: [{ message: 'Username or password is invalid', path: 'password' }]
    });
  }

  const comparePassword = await bcrypt.compare(data.password, user.password);

  if (!comparePassword) {
    throw createError({
      status: 401,
      statusMessage: 'Unauthorized',
      data: [{ message: 'Invalid password', path: 'password' }]
    });
  }

  await createSession(event, user);

  return {
    message: 'Logged in successfully',
    user: {
      ...user,
      password: undefined
    }
  };
});
