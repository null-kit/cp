defineRouteMeta({
  openAPI: {
    description: 'Logout a user',
    tags: ['Auth']
  }
});

export default defineEventHandler(async (event) => {
  const { sessionName, sessionSecret } = useRuntimeConfig(event);

  await clearSession(event, {
    name: sessionName,
    password: sessionSecret
  });

  deleteCookie(event, sessionName);

  return { message: 'Logged out successfully' };
});
