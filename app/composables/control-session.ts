export const useControlSession = () => {
  const session = useState<ControlSession | null>('control-session', () => null);

  const { setErrors, clearErrors } = useValidate();
  const { setToast } = useToast();

  const getSession = async () => {
    if (!session.value) {
      session.value = await $fetch<ControlSession>('/api/auth/session');
    }
  };

  const login = async (body: UserLogin) => {
    await $fetch<{ user: ControlSession }>('/api/auth/login', { method: 'POST', body })
      .then(async (response) => {
        session.value = response.user;

        navigateTo('/control', { replace: true });

        clearErrors();

        setToast('Success!', 'Logged in successfully!', 'info');
      })
      .catch((error) => {
        if (error.statusCode === 403) return setToast(error.statusMessage, error.data.message, 'error');

        setErrors(error.data?.data);
      });
  };

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' });

    clearNuxtState(['control-session']);
    clearNuxtData();

    navigateTo('/control', { replace: true });
  };

  const hasAuth = computed(() => Boolean(session.value));

  return {
    session,
    hasAuth,
    getSession,
    login,
    logout
  };
};
