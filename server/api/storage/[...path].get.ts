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

  if (path.endsWith('.mp4')) {
    setResponseHeader(event, 'Content-Type', 'video/mp4');
    setResponseHeader(event, 'Accept-Ranges', 'bytes');

    // Video players (Safari in particular) require partial content responses to play and seek
    const range = getHeader(event, 'range')?.match(/bytes=(\d*)-(\d*)/);

    if (range && Buffer.isBuffer(file)) {
      const size = file.length;
      const start = range[1] ? Number(range[1]) : size - Number(range[2]);
      const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;

      if (start < 0 || start >= size || start > end) {
        setResponseHeader(event, 'Content-Range', `bytes */${size}`);
        throw createError({ statusCode: 416, statusMessage: 'Range Not Satisfiable' });
      }

      setResponseStatus(event, 206);
      setResponseHeader(event, 'Content-Range', `bytes ${start}-${end}/${size}`);

      return file.subarray(start, end + 1);
    }
  }

  return file;
});
