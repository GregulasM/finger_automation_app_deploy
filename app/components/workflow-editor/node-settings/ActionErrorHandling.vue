<script setup lang="ts">
import { useWorkflowEditorContext } from "../workflowEditorContext";

const { t } = useI18n();
const {
  selectedConfig,
  updateNumberConfig,
  updateTextConfig,
  errorModes,
  inputStyles,
  formFieldStyles,
  selectStyles,
} = useWorkflowEditorContext();
</script>

<template>
  <div class="border-t border-orange-500/30 pt-4">
    <div
      class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold text-zinc-100"
    >
      {{ t("editor.errorHandling") }}
    </div>
    <div class="mt-3 space-y-3">
      <UFormField :label="t('editor.retryCount')" :ui="formFieldStyles">
        <UInput
          type="number"
          :model-value="String(selectedConfig.retryCount ?? 0)"
          :ui="inputStyles"
          @update:model-value="(value) => updateNumberConfig('retryCount', value)"
        />
      </UFormField>
      <UFormField :label="t('editor.retryDelay')" :ui="formFieldStyles">
        <UInput
          type="number"
          :model-value="String(selectedConfig.retryDelayMs ?? 0)"
          :ui="inputStyles"
          @update:model-value="
            (value) => updateNumberConfig('retryDelayMs', value)
          "
        />
      </UFormField>
      <UFormField :label="t('editor.onError')" :ui="formFieldStyles">
        <USelect
          :items="errorModes"
          :model-value="String(selectedConfig.onError ?? 'fail')"
          :ui="selectStyles"
          @update:model-value="(value) => updateTextConfig('onError', String(value))"
        />
      </UFormField>
      <UFormField :label="t('editor.notifyEmail')" :ui="formFieldStyles">
        <UInput
          :model-value="String(selectedConfig.notifyEmail ?? '')"
          placeholder="alerts@example.com"
          :ui="inputStyles"
          @update:model-value="
            (value) => updateTextConfig('notifyEmail', String(value))
          "
        />
      </UFormField>
    </div>
  </div>
</template>
