import { z } from 'zod/v4';

export const validateSchema = <T>(result: z.ZodSafeParseResult<T>): T => {
  if (!result.success) {
    const issues = z.flattenError(result.error);

    const data = Object.entries(issues.fieldErrors).map(([path, messages]) => ({
      message: Array.isArray(messages) ? messages[0] : messages,
      path
    }));

    throw createError({ status: 422, statusMessage: 'Unprocessable Entity', data });
  }

  return result.data;
};
