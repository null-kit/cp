defineRouteMeta({
  openAPI: {
    description: 'Get the current user session',
    tags: ['Auth'],
    security: [{ cookieAuth: [] }]
  }
});

export default defineEventHandler(async (event) => {
  const { sessionName, sessionSecret } = useRuntimeConfig(event);

  const session = await getSession(event, {
    name: sessionName,
    password: sessionSecret
  });

  if (!session.data.user) {
    await clearSession(event, {
      name: sessionName,
      password: sessionSecret
    });

    deleteCookie(event, sessionName);

    return null;
  }

  return session.data.user;
});
