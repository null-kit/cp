defineRouteMeta({
  openAPI: {
    description: 'Get a file from the storage',
    tags: ['Storage'],
    security: [{ cookieAuth: [] }]
  }
});

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path');

  if (!path) throw createError({ statusCode: 404, statusMessage: 'Path does not exist' });

  const file = await useStorage('fs').getItemRaw(decodeURIComponent(path));

  if (!file) throw createError({ statusCode: 404, statusMessage: 'File not found' });

  if (path.endsWith('.pdf')) setResponseHeader(event, 'Content-Type', 'application/pdf');
  if (path.endsWith('.webp')) setResponseHeader(event, 'Content-Type', 'image/webp');

  return file;
});
