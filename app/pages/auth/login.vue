<template>
  <div class="relative overflow-hidden px-6 py-16">
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.25),_transparent_55%)]"
    />
    <div
      class="pointer-events-none absolute -right-24 top-10 h-40 w-40 rounded-full bg-emerald-200/40 blur-3xl"
    />
    <UContainer>
      <div class="mx-auto w-full max-w-md">
        <div class="mb-6 text-center">
          <p
            class="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500"
          >
            Finger Automation
          </p>
          <h1 class="mt-3 text-3xl font-semibold text-slate-900">
            Welcome back
          </h1>
          <p class="mt-2 text-sm text-slate-500">
            Sign in to manage your workflows and triggers.
          </p>
        </div>

        <UCard class="border-slate-200/70 shadow-sm">
          <UAlert
            v-if="errorMessage"
            color="red"
            variant="soft"
            title="Login failed"
            :description="errorMessage"
            class="mb-4"
          />
          <UForm :schema="schema" :state="state" @submit="onSubmit">
            <div class="space-y-4">
              <UFormField label="Email" name="email">
                <UInput
                  v-model="state.email"
                  type="email"
                  placeholder="you@company.com"
                  autocomplete="email"
                />
              </UFormField>
              <UFormField label="Password" name="password">
                <UInput
                  v-model="state.password"
                  type="password"
                  placeholder="********"
                  autocomplete="current-password"
                />
              </UFormField>
              <UButton
                type="submit"
                color="primary"
                class="w-full"
                :loading="loading"
              >
                Sign in
              </UButton>
            </div>
          </UForm>

          <div class="mt-6 text-center text-sm text-slate-500">
            Don't have an account?
            <NuxtLink
              to="/auth/register"
              class="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Create one
            </NuxtLink>
          </div>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { $fetch } from "ofetch";
import { storeToRefs } from "pinia";
import { reactive, ref, watch } from "vue";
import { z } from "zod";

const auth = useAuthStore();
const { loggedIn } = storeToRefs(auth);
const accessToken = useCookie("access_token");

const state = reactive({
  email: "",
  password: "",
});

const schema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const loading = ref(false);
const errorMessage = ref<string | null>(null);
const refreshing = ref(false);

watch(
  [loggedIn, accessToken],
  async ([isLoggedIn, token]) => {
    if (!import.meta.client || !isLoggedIn) {
      return;
    }
    if (!token && !refreshing.value) {
      refreshing.value = true;
      try {
        await $fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include"
        });
      } catch {
        return;
      } finally {
        refreshing.value = false;
      }
    }
    if (useCookie("access_token").value) {
      await navigateTo("/workflows/editor");
    }
  },
  { immediate: true }
);

async function onSubmit(event: { data: z.infer<typeof schema> }) {
  loading.value = true;
  errorMessage.value = null;

  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: event.data,
      credentials: "include"
    });
    await auth.refresh();
    await navigateTo("/workflows/editor");
  } catch (error) {
    errorMessage.value = getErrorMessage(error);
  } finally {
    loading.value = false;
  }
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object") {
    const data = (
      error as { data?: { statusMessage?: string; message?: string } }
    ).data;
    if (data?.statusMessage) {
      return data.statusMessage;
    }
    if (data?.message) {
      return data.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Unable to login.";
}
</script>
