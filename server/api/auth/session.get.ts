defineRouteMeta({
  openAPI: {
    description: 'Get the current user session',
    tags: ['Auth'],
    security: [{ cookieAuth: [] }]
  }
});

export default defineEventHandler(async (event) => {
  const config = getSessionConfig(event);

  try {
    return await requireAuth(event);
  } catch (error) {
    if ((error as { statusCode?: number }).statusCode !== 401) throw error;

    await clearSession(event, config);

    deleteCookie(event, config.name);

    return null;
  }
});
