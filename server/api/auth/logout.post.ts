defineRouteMeta({
  openAPI: {
    description: 'Logout a user',
    tags: ['Auth']
  }
});

export default defineEventHandler(async (event) => {
  const config = getSessionConfig(event);

  await clearSession(event, config);

  deleteCookie(event, config.name);

  return { message: 'Logged out successfully' };
});
