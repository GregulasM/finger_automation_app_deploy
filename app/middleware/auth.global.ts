export default defineNuxtRouteMiddleware(async (to) => {
  const isPublic =
    to.path === "/" ||
    to.path.startsWith("/auth") ||
    to.path.startsWith("/about") ||
    to.path.startsWith("/main");

  if (isPublic) {
    return;
  }

  const accessToken = useCookie("access_token");
  if (accessToken.value) {
    return;
  }

  if (import.meta.client) {
    const requestFetch = useRequestFetch();
    try {
      await requestFetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include"
      });
      return;
    } catch {
      // Fall through to login redirect.
    }
  }

  return navigateTo("/auth/login");
});
