<script setup lang="ts">
import { useWorkflowEditorContext } from "../workflowEditorContext";

const { t } = useI18n();
const {
  selectedConfig,
  updateTextConfig,
  inputStyles,
  textareaStyles,
  formFieldStyles,
  selectStyles,
  telegramParseModes,
  canTestTelegram,
  telegramTesting,
  telegramTestResult,
  testTelegramMessage,
} = useWorkflowEditorContext();
</script>

<template>
  <div class="space-y-4">
    <UFormField :label="t('editor.botToken')" :ui="formFieldStyles">
      <UInput
        :model-value="String(selectedConfig.botToken ?? '')"
        placeholder="123456789:ABCdefGHI..."
        type="password"
        :ui="inputStyles"
        @update:model-value="(value) => updateTextConfig('botToken', String(value))"
      />
      <template #hint>
        <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
          {{ t("editor.telegram.botTokenHint") }}
          <a
            href="https://t.me/BotFather"
            target="_blank"
            class="text-orange-400 hover:text-orange-300 underline"
          >
            @BotFather
          </a>
        </span>
      </template>
    </UFormField>

    <UFormField :label="t('editor.chatId')" :ui="formFieldStyles">
      <UInput
        :model-value="String(selectedConfig.chatId ?? '')"
        placeholder="123456789"
        :ui="inputStyles"
        @update:model-value="(value) => updateTextConfig('chatId', String(value))"
      />
      <template #hint>
        <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
          {{ t("editor.telegram.chatIdHint") }}
          <a
            href="https://t.me/userinfobot"
            target="_blank"
            class="text-orange-400 hover:text-orange-300 underline"
          >
            @userinfobot
          </a>
        </span>
      </template>
    </UFormField>

    <UFormField :label="t('editor.message')" :ui="formFieldStyles">
      <UTextarea
        :model-value="String(selectedConfig.message ?? '')"
        :placeholder="t('editor.telegram.messagePlaceholder')"
        :ui="textareaStyles"
        :rows="3"
        @update:model-value="(value) => updateTextConfig('message', String(value))"
      />
      <template #hint>
        <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
          {{ t("editor.telegram.messageHint") }}
        </span>
      </template>
    </UFormField>

    <UFormField :label="t('editor.parseMode')" :ui="formFieldStyles">
      <USelect
        :items="telegramParseModes"
        :model-value="String(selectedConfig.parseMode ?? 'Markdown')"
        :ui="selectStyles"
        @update:model-value="
          (value) => updateTextConfig('parseMode', String(value))
        "
      />
      <template #hint>
        <span class="text-zinc-400 text-[9px] xs:text-[10px] sm:text-[11px]">
          {{ t("editor.telegram.parseModeHint") }}
        </span>
      </template>
    </UFormField>

    <div
      v-if="selectedConfig.message"
      class="rounded-lg border border-orange-500/20 bg-zinc-900/50 p-3"
    >
      <div
        class="text-[9px] xs:text-[10px] sm:text-[11px] font-semibold text-zinc-400 mb-2"
      >
        {{ t("editor.telegram.preview") }}
      </div>
      <div
        class="text-zinc-100 text-[10px] xs:text-[11px] sm:text-xs whitespace-pre-wrap break-words"
      >
        {{ String(selectedConfig.message ?? "") }}
      </div>
    </div>

    <div class="flex items-center gap-3 pt-2">
      <button
        type="button"
        :disabled="!canTestTelegram || telegramTesting"
        class="rounded-md border border-cyan-500/50 bg-cyan-500/20 px-3 py-2 text-cyan-400 transition hover:bg-cyan-500/30 hover:border-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed"
        @click="testTelegramMessage"
      >
        <span
          class="text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs font-semibold flex items-center gap-2"
        >
          <svg
            v-if="telegramTesting"
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
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          {{
            telegramTesting
              ? t("editor.telegram.sending")
              : t("editor.telegram.testSend")
          }}
        </span>
      </button>
      <span
        v-if="telegramTestResult"
        class="text-[9px] xs:text-[10px] sm:text-[11px]"
        :class="telegramTestResult.ok ? 'text-green-400' : 'text-red-400'"
      >
        {{ telegramTestResult.message }}
      </span>
    </div>
  </div>
</template>
