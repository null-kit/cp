export default defineNuxtRouteMiddleware(() => {
  if (import.meta.client) {
    const { hasAuth } = useControlSession();

    if (!hasAuth.value) return navigateTo('/control', { replace: true });
  }
});
