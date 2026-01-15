<script setup lang="ts">
import { useWorkflowEditorContext } from "../workflowEditorContext";

const { t } = useI18n();
const {
  selectedConfig,
  updateTextConfig,
  formatJsonConfig,
  httpMethods,
  inputStyles,
  textareaStyles,
  formFieldStyles,
  canTestHttp,
  httpTesting,
  testHttpRequest,
  httpTestResult,
} = useWorkflowEditorContext();
</script>

<template>
  <div class="space-y-4">
    <UFormField :label="t('editor.url')" :ui="formFieldStyles">
      <UInput
        :model-value="String(selectedConfig.url ?? '')"
        placeholder="https://api.example.com/endpoint"
        :ui="inputStyles"
        @update:model-value="(value) => updateTextConfig('url', String(value))"
      />
      <template #hint>
        <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
          {{ t("editor.http.urlHint") }}
        </span>
      </template>
    </UFormField>

    <UFormField :label="t('editor.method')" :ui="formFieldStyles">
      <div class="flex gap-1 flex-wrap">
        <button
          v-for="method in httpMethods"
          :key="method"
          type="button"
          class="px-3 py-1.5 rounded text-[9px] xs:text-[10px] sm:text-[11px] font-semibold transition-colors"
          :class="
            String(selectedConfig.method ?? 'POST') === method
              ? 'bg-orange-500 text-zinc-950'
              : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
          "
          @click="updateTextConfig('method', method)"
        >
          {{ method }}
        </button>
      </div>
      <template #hint>
        <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
          {{ t("editor.http.methodHint") }}
        </span>
      </template>
    </UFormField>

    <UFormField :label="t('editor.headers')" :ui="formFieldStyles">
      <UTextarea
        :model-value="formatJsonConfig(selectedConfig.headers, '{}')"
        :placeholder="t('editor.http.headersPlaceholder')"
        :ui="textareaStyles"
        :rows="3"
        @update:model-value="(value) => updateTextConfig('headers', String(value))"
      />
      <template #hint>
        <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
          {{ t("editor.http.headersHint") }}
        </span>
      </template>
    </UFormField>

    <UFormField :label="t('editor.body')" :ui="formFieldStyles">
      <UTextarea
        :model-value="String(selectedConfig.body ?? '')"
        :placeholder="t('editor.http.bodyPlaceholder')"
        :ui="textareaStyles"
        :rows="4"
        @update:model-value="(value) => updateTextConfig('body', String(value))"
      />
      <template #hint>
        <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
          {{ t("editor.http.bodyHint") }}
        </span>
      </template>
    </UFormField>

    <div class="flex flex-col gap-3 pt-2">
      <div class="flex items-center gap-3">
        <button
          type="button"
          :disabled="!canTestHttp || httpTesting"
          class="rounded-md border border-cyan-500/50 bg-cyan-500/20 px-3 py-2 text-cyan-400 transition hover:bg-cyan-500/30 hover:border-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed"
          @click="testHttpRequest"
        >
          <span
            class="text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs font-semibold flex items-center gap-2"
          >
            <svg
              v-if="httpTesting"
              class="animate-spin h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <svg
              v-else
              class="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            {{
              httpTesting
                ? t("editor.http.testing")
                : t("editor.http.testRequest")
            }}
          </span>
        </button>
      </div>

      <div
        v-if="httpTestResult"
        class="rounded-lg border p-3 text-[9px] xs:text-[10px] sm:text-[11px]"
        :class="
          httpTestResult.ok
            ? 'border-green-500/30 bg-green-500/10'
            : 'border-red-500/30 bg-red-500/10'
        "
      >
        <div class="flex items-center gap-2 mb-2">
          <span
            class="px-2 py-0.5 rounded font-mono font-bold"
            :class="
              httpTestResult.ok
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            "
          >
            {{ httpTestResult.status }}
          </span>
          <span
            :class="
              httpTestResult.ok ? 'text-green-400' : 'text-red-400'
            "
          >
            {{
              httpTestResult.ok
                ? t("editor.http.success")
                : t("editor.http.failed")
            }}
          </span>
        </div>
        <pre
          class="text-zinc-300 whitespace-pre-wrap break-all max-h-32 overflow-auto font-mono text-[8px] xs:text-[9px]"
          >{{ httpTestResult.data }}</pre
        >
      </div>
    </div>
  </div>
</template>
