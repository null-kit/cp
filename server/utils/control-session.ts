import type { H3Event } from 'h3';

export const createSession = async (event: H3Event, user: ControlSession) => {
  const { sessionName, sessionSecret } = useRuntimeConfig(event);

  const session = await useSession(event, {
    name: sessionName,
    password: sessionSecret,
    cookie: { httpOnly: true, secure: true, sameSite: 'strict' },
    maxAge: 60 * 60 * 24 * 7
  });

  await session.update({
    user: {
      ...user,
      password: undefined
    }
  });
};

export const requireAuth = async (event: H3Event) => {
  const { sessionName, sessionSecret } = useRuntimeConfig(event);

  const session = await getSession(event, {
    name: sessionName,
    password: sessionSecret
  });

  if (!session || !session.data.user) {
    throw createError({ status: 401, statusMessage: 'Unauthorized' });
  }
};
