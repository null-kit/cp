type ValidationErrors = Record<string, string | null>;

export const useValidate = () => {
  const validate = useState<ValidationErrors>('validation', () => ({}));

  const setErrors = (errors: ValidationErrors) => {
    if (typeof errors === 'object') {
      validate.value = { ...errors };
    }

    if (Array.isArray(errors)) {
      validate.value = Object.fromEntries(errors.map((error) => [error.path, error.message]));
    }
  };

  const clearErrors = () => {
    validate.value = {};
  };

  const clearError = (path: string) => {
    validate.value = { ...validate.value, [path]: null };
  };

  return {
    validate,
    setErrors,
    clearErrors,
    clearError
  };
};
