defineRouteMeta({
  openAPI: {
    description: 'Delete a file from the storage',
    tags: ['Storage'],
    security: [{ cookieAuth: [] }]
  }
});

export default defineEventHandler(async (event) => {
  const noAuth = getHeader(event, 'NoAuth');

  if (!noAuth) await requireAuth(event);

  const path = getRouterParam(event, 'path');

  if (path) await useStorage('fs').removeItem(path.replace('storage/', ''));
});
