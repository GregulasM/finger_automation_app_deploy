import { $fetch } from "ofetch";
import { defineStore } from "pinia";
import { computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const session = useUserSession();

  const user = computed(() => session.user.value ?? null);
  const loggedIn = computed(() => session.loggedIn.value);
  const ready = computed(() => session.ready.value);

  async function refresh() {
    await session.fetch();
  }

  async function logout() {
    await $fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    await session.clear();
  }

  return {
    user,
    loggedIn,
    ready,
    refresh,
    logout,
  };
});
