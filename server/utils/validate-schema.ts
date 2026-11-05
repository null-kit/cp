type Issue = { path: PropertyKey[]; message: string };

type SafeParseResult<T> = { success: true; data: T } | { success: false; error: { issues: Issue[] } };

export const validateSchema = <T>(result: SafeParseResult<T>): T => {
  if (!result.success) {
    const data = result.error.issues.map(({ path, message }) => ({
      message,
      path: path[path.length - 1]
    }));

    throw createError({ status: 422, statusMessage: 'Unprocessable Entity', data });
  }

  return result.data;
};
