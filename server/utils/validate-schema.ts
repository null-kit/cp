import type { ZodSafeParseResult } from 'zod/v4';

/**
 * Validates a Zod parse result and either throws an error or returns the data.
 */
export const validateSchema = <T>(result: ZodSafeParseResult<NonNullable<T>>): NonNullable<T> => {
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: result.error.issues.map((issue) => ({
        message: issue.message,
        path: issue.path[issue.path.length - 1]
      }))
    });
  }

  return result.data;
};
