<script setup lang="ts">
import { useWorkflowEditorContext } from "../workflowEditorContext";

const { t } = useI18n();
const {
  emailProviders,
  emailProvider,
  setEmailProvider,
  selectedConfig,
  inputStyles,
  textareaStyles,
  formFieldStyles,
  updateGmailConfig,
  updateSendGridConfig,
  updateTextConfig,
  canTestEmail,
  emailSmtpTesting,
  testEmailConnection,
  emailSmtpTestResult,
  emailContentMode,
  emailSending,
  emailSendResult,
  canSendTestEmail,
  sendTestEmail,
} = useWorkflowEditorContext();
</script>

<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <div
        class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px] font-semibold"
      >
        {{ t("editor.email.provider") }}
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="provider in emailProviders"
          :key="provider.id"
          type="button"
          class="px-3 py-1.5 rounded text-[9px] xs:text-[10px] font-semibold transition-colors flex items-center gap-1.5"
          :class="
            emailProvider === provider.id
              ? 'bg-orange-500 text-zinc-950'
              : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
          "
          @click="setEmailProvider(provider.id)"
        >
          <span v-html="provider.icon" class="w-3 h-3"></span>
          {{ provider.name }}
        </button>
      </div>
    </div>

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
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
          <div v-if="emailProvider === 'gmail'" class="space-y-1">
            <div class="font-semibold text-cyan-400">
              {{ t("editor.email.gmailTitle") }}
            </div>
            <p>{{ t("editor.email.gmailDesc") }}</p>
            <a
              href="https://myaccount.google.com/apppasswords"
              target="_blank"
              class="text-orange-400 hover:underline block"
            >
              {{ t("editor.email.getAppPassword") }} →
            </a>
          </div>
          <div v-else-if="emailProvider === 'sendgrid'" class="space-y-1">
            <div class="font-semibold text-cyan-400">
              {{ t("editor.email.sendgridTitle") }}
            </div>
            <p>{{ t("editor.email.sendgridDesc") }}</p>
            <a
              href="https://app.sendgrid.com/settings/api_keys"
              target="_blank"
              class="text-orange-400 hover:underline block"
            >
              {{ t("editor.email.getSendGridKey") }} →
            </a>
          </div>
          <div v-else class="space-y-1">
            <div class="font-semibold text-cyan-400">
              {{ t("editor.email.resendTitle") }}
            </div>
            <p>{{ t("editor.email.resendDesc") }}</p>
            <a
              href="https://resend.com/api-keys"
              target="_blank"
              class="text-orange-400 hover:underline block"
            >
              {{ t("editor.email.getResendKey") }} →
            </a>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="emailProvider === 'gmail'"
      class="space-y-3 rounded-lg border border-zinc-700 bg-zinc-800/50 p-3"
    >
      <div
        class="text-[9px] xs:text-[10px] sm:text-[11px] font-semibold text-zinc-400"
      >
        {{ t("editor.email.gmailSettings") }}
      </div>
      <UFormField :label="t('editor.email.gmailEmail')" :ui="formFieldStyles">
        <UInput
          :model-value="String(selectedConfig.smtpEmail ?? '')"
          placeholder="your-email@gmail.com"
          type="email"
          :ui="inputStyles"
          @update:model-value="
            (value) => updateGmailConfig('smtpEmail', String(value))
          "
        />
      </UFormField>
      <UFormField :label="t('editor.email.appPassword')" :ui="formFieldStyles">
        <UInput
          :model-value="String(selectedConfig.smtpPassword ?? '')"
          placeholder="xxxx xxxx xxxx xxxx"
          type="password"
          :ui="inputStyles"
          @update:model-value="
            (value) => updateGmailConfig('smtpPassword', String(value))
          "
        />
        <template #hint>
          <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
            {{ t("editor.email.appPasswordHint") }}
          </span>
        </template>
      </UFormField>
    </div>

    <div
      v-if="emailProvider === 'sendgrid'"
      class="space-y-3 rounded-lg border border-zinc-700 bg-zinc-800/50 p-3"
    >
      <div
        class="text-[9px] xs:text-[10px] sm:text-[11px] font-semibold text-zinc-400"
      >
        {{ t("editor.email.sendgridSettings") }}
      </div>
      <UFormField :label="t('editor.email.sendgridApiKey')" :ui="formFieldStyles">
        <UInput
          :model-value="String(selectedConfig.sendgridApiKey ?? '')"
          placeholder="SG.xxx..."
          type="password"
          :ui="inputStyles"
          @update:model-value="
            (value) =>
              updateSendGridConfig('sendgridApiKey', String(value))
          "
        />
      </UFormField>
      <UFormField :label="t('editor.email.senderEmail')" :ui="formFieldStyles">
        <UInput
          :model-value="String(selectedConfig.from ?? '')"
          placeholder="noreply@yourdomain.com"
          type="email"
          :ui="inputStyles"
          @update:model-value="(value) => updateTextConfig('from', String(value))"
        />
        <template #hint>
          <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
            {{ t("editor.email.senderHint") }}
          </span>
        </template>
      </UFormField>
    </div>

    <div class="flex items-center gap-3">
      <button
        type="button"
        :disabled="!canTestEmail || emailSmtpTesting"
        class="px-3 py-1.5 rounded text-[9px] xs:text-[10px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :class="
          canTestEmail
            ? 'bg-cyan-600 text-white hover:bg-cyan-500'
            : 'bg-zinc-700 text-zinc-400'
        "
        @click="testEmailConnection"
      >
        <span class="flex items-center gap-1.5">
          <svg
            v-if="emailSmtpTesting"
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
            emailSmtpTesting
              ? t("editor.email.testing")
              : t("editor.email.testConnection")
          }}
        </span>
      </button>
      <span
        v-if="emailSmtpTestResult"
        :class="[
          'text-[9px] xs:text-[10px] sm:text-[11px]',
          emailSmtpTestResult.ok ? 'text-green-400' : 'text-red-400',
        ]"
      >
        {{
          emailSmtpTestResult.ok
            ? t("editor.email.connectionSuccess")
            : emailSmtpTestResult.error
        }}
      </span>
    </div>

    <hr class="border-zinc-700" />

    <UFormField :label="t('editor.to')" :ui="formFieldStyles">
      <UInput
        :model-value="String(selectedConfig.to ?? '')"
        placeholder="user@example.com"
        type="email"
        :ui="inputStyles"
        @update:model-value="(value) => updateTextConfig('to', String(value))"
      />
      <template #hint>
        <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
          {{ t("editor.email.toHint") }}
        </span>
      </template>
    </UFormField>

    <UFormField :label="t('editor.subject')" :ui="formFieldStyles">
      <UInput
        :model-value="String(selectedConfig.subject ?? '')"
        :placeholder="t('editor.email.subjectPlaceholder')"
        :ui="inputStyles"
        @update:model-value="(value) => updateTextConfig('subject', String(value))"
      />
      <template #hint>
        <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
          {{ t("editor.email.subjectHint") }}
        </span>
      </template>
    </UFormField>

    <div class="flex items-center gap-3">
      <span
        class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px] font-semibold"
      >
        {{ t("editor.email.contentType") }}:
      </span>
      <div class="flex gap-1">
        <button
          type="button"
          class="px-2 py-1 rounded text-[9px] xs:text-[10px] font-semibold transition-colors"
          :class="
            emailContentMode === 'html'
              ? 'bg-orange-500 text-zinc-950'
              : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
          "
          @click="emailContentMode = 'html'"
        >
          HTML
        </button>
        <button
          type="button"
          class="px-2 py-1 rounded text-[9px] xs:text-[10px] font-semibold transition-colors"
          :class="
            emailContentMode === 'text'
              ? 'bg-orange-500 text-zinc-950'
              : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
          "
          @click="emailContentMode = 'text'"
        >
          Text
        </button>
        <button
          type="button"
          class="px-2 py-1 rounded text-[9px] xs:text-[10px] font-semibold transition-colors"
          :class="
            emailContentMode === 'both'
              ? 'bg-orange-500 text-zinc-950'
              : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
          "
          @click="emailContentMode = 'both'"
        >
          {{ t("editor.email.both") }}
        </button>
      </div>
    </div>

    <UFormField
      v-if="emailContentMode === 'html' || emailContentMode === 'both'"
      :label="t('editor.html')"
      :ui="formFieldStyles"
    >
      <UTextarea
        :model-value="String(selectedConfig.html ?? '')"
        :placeholder="t('editor.email.htmlPlaceholder')"
        :ui="textareaStyles"
        :rows="5"
        @update:model-value="(value) => updateTextConfig('html', String(value))"
      />
      <template #hint>
        <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
          {{ t("editor.email.htmlHint") }}
        </span>
      </template>
    </UFormField>

    <UFormField
      v-if="emailContentMode === 'text' || emailContentMode === 'both'"
      :label="t('editor.text')"
      :ui="formFieldStyles"
    >
      <UTextarea
        :model-value="String(selectedConfig.text ?? '')"
        :placeholder="t('editor.email.textPlaceholder')"
        :ui="textareaStyles"
        :rows="4"
        @update:model-value="(value) => updateTextConfig('text', String(value))"
      />
      <template #hint>
        <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
          {{ t("editor.email.textHint") }}
        </span>
      </template>
    </UFormField>

    <div class="flex items-center gap-3">
      <button
        type="button"
        :disabled="!canSendTestEmail || emailSending"
        class="px-3 py-1.5 rounded text-[9px] xs:text-[10px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :class="
          canSendTestEmail
            ? 'bg-green-600 text-white hover:bg-green-500'
            : 'bg-zinc-700 text-zinc-400'
        "
        @click="sendTestEmail"
      >
        <span class="flex items-center gap-1.5">
          <svg
            v-if="emailSending"
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
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          {{
            emailSending ? t("editor.email.sending") : t("editor.email.sendTest")
          }}
        </span>
      </button>
      <span
        v-if="emailSendResult"
        :class="[
          'text-[9px] xs:text-[10px] sm:text-[11px]',
          emailSendResult.ok ? 'text-green-400' : 'text-red-400',
        ]"
      >
        {{
          emailSendResult.ok
            ? t("editor.email.sendSuccess")
            : emailSendResult.error
        }}
      </span>
    </div>

    <div class="rounded-lg border border-orange-500/20 bg-zinc-900/50 p-3">
      <div class="flex items-start gap-2">
        <svg
          class="h-4 w-4 text-orange-400 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
          {{ t("editor.email.autoContentHint") }}
        </span>
      </div>
    </div>
  </div>
</template>
