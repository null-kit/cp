export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path.includes('/control')) {
    await useControlSession().getSession();
  }
});
