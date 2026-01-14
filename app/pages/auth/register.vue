<template>
  <div class="relative overflow-hidden px-6 py-16">
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(148,163,184,0.25),_transparent_55%)]"
    />
    <div
      class="pointer-events-none absolute -left-24 top-12 h-40 w-40 rounded-full bg-amber-200/50 blur-3xl"
    />
    <UContainer>
      <div class="mx-auto w-full max-w-md">
        <div class="mb-6 text-center">
          <p
            class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500"
          >
            Finger Automation
          </p>
          <h1 class="mt-3 text-3xl font-semibold text-slate-900">
            Create your account
          </h1>
          <p class="mt-2 text-sm text-slate-500">
            Start building automations in minutes.
          </p>
        </div>

        <UCard class="border-slate-200/70 shadow-sm">
          <UAlert
            v-if="errorMessage"
            color="red"
            variant="soft"
            title="Registration failed"
            :description="errorMessage"
            class="mb-4"
          />
          <UForm :schema="schema" :state="state" @submit="onSubmit">
            <div class="space-y-4">
              <UFormField label="Name" name="name">
                <UInput
                  v-model="state.name"
                  type="text"
                  placeholder="Your name"
                  autocomplete="name"
                />
              </UFormField>
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
                  placeholder="Create a password"
                  autocomplete="new-password"
                />
              </UFormField>
              <UButton
                type="submit"
                color="primary"
                class="w-full"
                :loading="loading"
              >
                Create account
              </UButton>
            </div>
          </UForm>

          <div class="mt-6 text-center text-sm text-slate-500">
            Already have an account?
            <NuxtLink
              to="/auth/login"
              class="font-semibold text-amber-600 hover:text-amber-700"
            >
              Sign in
            </NuxtLink>
          </div>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { $fetch } from "ofetch";
import { reactive, ref } from "vue";
import { z } from "zod";

const auth = useAuthStore();

const state = reactive({
  name: "",
  email: "",
  password: "",
});

const nameRegex = /^[A-Za-z\p{Script=Cyrillic}\s'-]+$/u;

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name must be under 80 characters.")
    .regex(nameRegex, "Use Russian or English letters only."),
  email: z.string().email("Enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const loading = ref(false);
const errorMessage = ref<string | null>(null);

async function onSubmit(event: { data: z.infer<typeof schema> }) {
  loading.value = true;
  errorMessage.value = null;

  try {
    await $fetch("/api/auth/register", {
      method: "POST",
      body: event.data,
      credentials: "include",
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
  return "Unable to register.";
}
</script>
