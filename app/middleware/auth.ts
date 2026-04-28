export default defineNuxtRouteMiddleware(async (to) => {
  const { user, authReady } = useAuth();

  // Wait for Firebase to resolve the initial auth state
  if (!authReady.value) {
    await new Promise<void>((resolve) => {
      const stop = watch(authReady, (ready) => {
        if (ready) {
          stop();
          resolve();
        }
      });
    });
  }

  if (!user.value) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } });
  }
});
