import { join } from 'node:path';
import sharp from 'sharp';
import type { FitEnum } from 'sharp';

defineRouteMeta({
  openAPI: {
    description: 'Upload a file to the storage',
    tags: ['Storage'],
    security: [{ cookieAuth: [] }]
  }
});

type Query = {
  width?: number;
  height?: number;
  fit?: keyof FitEnum;
};

export default defineEventHandler(async (event) => {
  const noAuth = getHeader(event, 'NoAuth');

  if (!noAuth) await requireAuth(event);

  const { width, height, fit = 'cover' }: Query = getQuery(event);
  const path = getRouterParam(event, 'path');
  const multipartData = await readMultipartFormData(event);

  if (!multipartData || !path) throw createError({ statusCode: 400, message: 'No media provided' });

  const uploaded = [];

  for (const media of multipartData) {
    if (!media.type || !media.filename) continue;

    const isImage = media.type.includes('image');

    let fileName = media.filename.replace(/[^\w\s\-.]/g, '').replace(/\s+/g, '-');

    const today = new Date();
    const date = today.toISOString().split('T')[0].split('-').join('');
    const seconds = today.getSeconds();
    const minutes = today.getMinutes();

    const datetime = date + seconds + minutes;

    const { setItemRaw } = useStorage('fs');

    if (isImage && fileName) {
      fileName = fileName.replace(/\.[^/.]+$/, '');

      const compress = await sharp(media.data)
        .webp({ quality: 80 })
        .resize(Number(width) || null, Number(height) || null, { fit })
        .toBuffer();

      await setItemRaw(`${path}:${datetime}_${fileName}.webp`, compress);

      uploaded.push({ fileName, uploaded: true, url: join('/storage', path, `${datetime}_${fileName}.webp`) });
    } else {
      await setItemRaw(`${path}:${datetime}_${fileName}`, media.data);

      uploaded.push({ fileName, uploaded: true, url: join('/storage', path, `${datetime}_${fileName}`) });
    }
  }

  return uploaded;
});
