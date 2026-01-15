<script setup lang="ts">
import { useWorkflowEditorContext } from "../workflowEditorContext";

const { t } = useI18n();
const {
  selectedConfig,
  updateTextConfig,
  imapTesting,
  imapTestResult,
  testImapConnection,
  inputStyles,
  formFieldStyles,
} = useWorkflowEditorContext();
</script>

<template>
  <div class="space-y-4">
    <div class="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
      <div class="flex items-start gap-2">
        <svg
          class="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <div class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
          <div class="font-semibold text-cyan-400 mb-1">
            {{ t("editor.emailTrigger.howItWorks") }}
          </div>
          {{ t("editor.emailTrigger.imapDescription") }}
        </div>
      </div>
    </div>

    <UFormField :label="t('editor.emailTrigger.imapEmail')" :ui="formFieldStyles">
      <UInput
        :model-value="String(selectedConfig.imapEmail ?? '')"
        placeholder="your-email@gmail.com"
        :ui="inputStyles"
        @update:model-value="(value) => updateTextConfig('imapEmail', String(value))"
      />
      <template #hint>
        <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
          {{ t("editor.emailTrigger.imapEmailHint") }}
        </span>
      </template>
    </UFormField>

    <UFormField
      :label="t('editor.emailTrigger.imapPassword')"
      :ui="formFieldStyles"
    >
      <UInput
        :model-value="String(selectedConfig.imapPassword ?? '')"
        type="password"
        :placeholder="t('editor.emailTrigger.appPasswordPlaceholder')"
        :ui="inputStyles"
        @update:model-value="
          (value) => updateTextConfig('imapPassword', String(value))
        "
      />
      <template #hint>
        <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
          {{ t("editor.emailTrigger.appPasswordHint") }}
        </span>
      </template>
    </UFormField>

    <div class="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
      <div class="flex items-start gap-2">
        <svg
          class="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
          <div class="font-semibold text-amber-400 mb-1">
            {{ t("editor.emailTrigger.appPasswordTitle") }}
          </div>
          <div class="space-y-1.5">
            <div>
              <span class="font-semibold text-zinc-300">Gmail:</span>
              <a
                href="https://myaccount.google.com/apppasswords"
                target="_blank"
                class="text-cyan-400 hover:underline ml-1"
              >
                {{ t("editor.emailTrigger.createAppPassword") }} →
              </a>
            </div>
            <div>
              <span class="font-semibold text-zinc-300">Mail.ru:</span>
              {{ t("editor.emailTrigger.mailruInstructions") }}
            </div>
            <div>
              <span class="font-semibold text-zinc-300">Yandex:</span>
              {{ t("editor.emailTrigger.yandexInstructions") }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <details class="rounded-lg border border-zinc-700 bg-zinc-800/50">
      <summary
        class="p-3 cursor-pointer text-[9px] xs:text-[10px] sm:text-[11px] font-semibold text-zinc-400 hover:text-zinc-300"
      >
        {{ t("editor.emailTrigger.advancedSettings") }}
      </summary>
      <div class="p-3 pt-0 space-y-3">
        <UFormField :label="t('editor.emailTrigger.imapServer')" :ui="formFieldStyles">
          <UInput
            :model-value="String(selectedConfig.imapHost ?? '')"
            :placeholder="t('editor.emailTrigger.autoDetect')"
            :ui="inputStyles"
            @update:model-value="
              (value) => updateTextConfig('imapHost', String(value))
            "
          />
          <template #hint>
            <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
              {{ t("editor.emailTrigger.imapServerHint") }}
            </span>
          </template>
        </UFormField>

        <UFormField :label="t('editor.emailTrigger.imapPort')" :ui="formFieldStyles">
          <UInput
            :model-value="String(selectedConfig.imapPort ?? '')"
            placeholder="993"
            type="number"
            :ui="inputStyles"
            @update:model-value="
              (value) =>
                updateTextConfig('imapPort', value ? Number(value) : '')
            "
          />
        </UFormField>

        <UFormField :label="t('editor.emailTrigger.folder')" :ui="formFieldStyles">
          <UInput
            :model-value="String(selectedConfig.imapFolder ?? '')"
            placeholder="INBOX"
            :ui="inputStyles"
            @update:model-value="
              (value) => updateTextConfig('imapFolder', String(value))
            "
          />
        </UFormField>

        <UFormField :label="t('editor.emailTrigger.filterFrom')" :ui="formFieldStyles">
          <UInput
            :model-value="String(selectedConfig.filterFrom ?? '')"
            :placeholder="t('editor.emailTrigger.filterFromPlaceholder')"
            :ui="inputStyles"
            @update:model-value="
              (value) => updateTextConfig('filterFrom', String(value))
            "
          />
        </UFormField>

        <UFormField :label="t('editor.emailTrigger.filterSubject')" :ui="formFieldStyles">
          <UInput
            :model-value="String(selectedConfig.filterSubject ?? '')"
            :placeholder="t('editor.emailTrigger.filterSubjectPlaceholder')"
            :ui="inputStyles"
            @update:model-value="
              (value) => updateTextConfig('filterSubject', String(value))
            "
          />
        </UFormField>
      </div>
    </details>

    <div class="flex items-center gap-3">
      <button
        type="button"
        :disabled="
          imapTesting ||
          !selectedConfig.imapEmail ||
          !selectedConfig.imapPassword
        "
        class="rounded-md border border-cyan-500 bg-cyan-500/20 px-4 py-2 text-cyan-400 transition hover:bg-cyan-500/30 disabled:opacity-50"
        @click="testImapConnection"
      >
        <span
          class="text-[9px] xs:text-[10px] sm:text-[11px] font-semibold flex items-center gap-2"
        >
          <svg
            v-if="imapTesting"
            class="h-3 w-3 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {{
            imapTesting
              ? t("editor.emailTrigger.testing")
              : t("editor.emailTrigger.testConnection")
          }}
        </span>
      </button>
      <span
        v-if="imapTestResult"
        :class="[
          'text-[9px] xs:text-[10px] sm:text-[11px]',
          imapTestResult.ok ? 'text-green-400' : 'text-red-400',
        ]"
      >
        {{
          imapTestResult.ok
            ? t("editor.emailTrigger.connectionSuccess")
            : imapTestResult.error
        }}
      </span>
    </div>

    <div class="rounded-lg border border-zinc-700 bg-zinc-800/50 p-3">
      <div
        class="text-[9px] xs:text-[10px] sm:text-[11px] font-semibold text-zinc-400 mb-2"
      >
        {{ t("editor.emailTrigger.supportedProviders") }}
      </div>
      <div class="flex flex-wrap gap-2">
        <span
          class="px-2 py-1 rounded bg-zinc-700 text-zinc-300 text-[8px] xs:text-[9px]"
          >Gmail</span
        >
        <span
          class="px-2 py-1 rounded bg-zinc-700 text-zinc-300 text-[8px] xs:text-[9px]"
          >Mail.ru</span
        >
        <span
          class="px-2 py-1 rounded bg-zinc-700 text-zinc-300 text-[8px] xs:text-[9px]"
          >Yandex</span
        >
        <span
          class="px-2 py-1 rounded bg-zinc-700 text-zinc-300 text-[8px] xs:text-[9px]"
          >Yahoo</span
        >
        <span
          class="px-2 py-1 rounded bg-zinc-700 text-zinc-300 text-[8px] xs:text-[9px]"
          >Outlook</span
        >
        <span
          class="px-2 py-1 rounded bg-zinc-700 text-zinc-300 text-[8px] xs:text-[9px]"
          >iCloud</span
        >
      </div>
    </div>

    <div class="rounded-lg border border-green-500/20 bg-green-500/5 p-3">
      <div class="flex items-start gap-2">
        <svg
          class="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
          {{ t("editor.emailTrigger.pollingInfo") }}
        </span>
      </div>
    </div>
  </div>
</template>
