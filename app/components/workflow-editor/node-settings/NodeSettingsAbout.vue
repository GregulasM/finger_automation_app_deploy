<script setup lang="ts">
import { useWorkflowEditorContext } from "../workflowEditorContext";

const { t } = useI18n();
const { translatedSelectedHelp, selectedLabel } = useWorkflowEditorContext();
</script>

<template>
  <div class="rounded-lg border border-orange-500/30 bg-zinc-800/50 p-3">
    <div
      class="text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold uppercase tracking-wider text-zinc-100/60"
    >
      {{ t("editor.aboutBlock") }}
    </div>
    <div
      class="mt-1 text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 font-semibold text-zinc-100"
    >
      {{ translatedSelectedHelp?.label || selectedLabel }}
    </div>
    <p
      class="mt-1 text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/70"
    >
      {{ translatedSelectedHelp?.details || t("editor.configureBlock") }}
    </p>
    <div
      v-if="translatedSelectedHelp?.tips?.length"
      class="mt-2 space-y-1 text-[5px] 4xs:text-[6px] 3xs:text-[7px] 2xs:text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm 2xl:text-base 3xl:text-lg/8 4xl:text-2xl/10 5xl:text-3xl/12 text-zinc-100/70"
    >
      <div v-for="tip in translatedSelectedHelp.tips" :key="tip">
        - {{ tip }}
      </div>
    </div>
  </div>
</template>
