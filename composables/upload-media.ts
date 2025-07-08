type UploadMedia = {
  newFile: File | File[];
  oldFile?: string;
  directory?: string;
  width: number | null;
  height: number | null;
  fit?: string;
  noAuth?: string;
};

export const useUploadMedia = async (args: UploadMedia) => {
  const { newFile, oldFile, directory, width, height, fit, noAuth } = args;

  if (oldFile) await $fetch(`/api/storage/${oldFile}`, { method: 'DELETE' });

  const body = new FormData();

  if (Array.isArray(newFile)) {
    newFile.forEach((file) => body.append('media', file));
  } else {
    body.append('media', newFile);
  }

  const params: Record<string, string | number> = {};

  if (width && height) {
    params.width = width;
    params.height = height;
  }

  if (fit) params.fit = fit;

  const response = await $fetch(`/api/storage/${directory}`, {
    method: 'POST',
    params,
    body,
    ...(noAuth && { headers: { NoAuth: noAuth } })
  });

  const urls = response.map((result) => result.url);

  if (urls.length === 1) return urls[0];

  return urls.join(', ');
};

export const useDeleteMedia = async (path?: string) => {
  if (path) {
    await $fetch(`/api/storage/${path}`, { method: 'DELETE' });
  }
};
