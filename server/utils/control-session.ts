import type { H3Event } from 'h3';

const isSecretInsecure = (secret?: string) => !secret || secret.length < 32;

export const getSessionConfig = (event: H3Event) => {
  const { sessionName, sessionSecret } = useRuntimeConfig(event);

  if (isSecretInsecure(sessionSecret) && !import.meta.dev) {
    console.error('[cp] SESSION_SECRET is missing, shorter than 32 chars or a placeholder. Control panel is disabled.');

    throw createError({ status: 503, statusMessage: 'Control panel is not configured' });
  }

  return { name: sessionName as string, password: sessionSecret as string };
};

export const createSession = async (event: H3Event, user: ControlSession) => {
  const session = await useSession(event, {
    ...getSessionConfig(event),
    cookie: { httpOnly: true, secure: true, sameSite: 'strict' },
    maxAge: 60 * 60 * 24 * 7
  });

  await session.update({
    user: { id: user.id, name: user.name, email: user.email }
  });
};

export const requireAuth = async (event: H3Event) => {
  const session = await useSession(event, getSessionConfig(event));
  const user = session.data.user as ControlSession | undefined;

  if (!user?.id) {
    throw createError({ status: 401, statusMessage: 'Unauthorized' });
  }

  const exists = await prisma.user.findUnique({ where: { id: user.id }, select: { id: true } });

  if (!exists) {
    await session.clear();

    throw createError({ status: 401, statusMessage: 'Unauthorized' });
  }

  return user;
};
