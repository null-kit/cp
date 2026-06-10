import type { z } from 'zod';

export const validateSchema = <T>(result: z.ZodSafeParseResult<T>): T => {
  if (!result.success) {
    const issues = result.error.issues;

    const data = issues.map(({ path, message }) => {
      return {
        message,
        path: Array.isArray(path) ? path[path.length - 1] : path
      };
    });

    throw createError({ status: 422, statusMessage: 'Unprocessable Entity', data });
  }

  return result.data;
};
