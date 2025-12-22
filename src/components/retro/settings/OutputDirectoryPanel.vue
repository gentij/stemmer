<script setup lang="ts">
import { AlertTriangle } from "lucide-vue-next";
import type { CassetteTheme } from "@/types/retro/cassete.interface";

interface Props {
  theme: CassetteTheme;
  outputDirectory: string;
  hasProblematicPath: boolean;
}

defineProps<Props>();

defineEmits<{
  (e: "selectDirectory"): void;
  (e: "resetDirectory"): void;
}>();
</script>

<template>
  <div
    class="rounded-xl border-2 p-6"
    :style="{
      borderColor: theme.windowStroke,
      backgroundColor: theme.windowBg,
    }"
  >
    <div 
      class="text-sm font-mono uppercase tracking-wider mb-4"
      :style="{ color: theme.tapeAccent }"
    >
      OUTPUT DIRECTORY
    </div>

    <div class="space-y-4">
      <div v-if="hasProblematicPath" 
        class="p-4 rounded-lg border"
        :style="{
          borderColor: theme.infoBorder,
          backgroundColor: theme.infoBg,
        }"
      >
        <div class="flex items-start gap-3">
          <AlertTriangle 
            class="h-5 w-5 flex-shrink-0 mt-0.5"
            :style="{ color: theme.borderColor }"
          />
          <div class="flex-1">
            <h4 
              class="font-mono text-sm font-medium mb-2"
              :style="{ color: theme.borderColor }"
            >
              PERMISSION WARNING
            </h4>
            <p 
              class="text-xs font-mono mb-3 opacity-70"
              :style="{ color: theme.borderColor }"
            >
              Current directory may have write restrictions.
            </p>
            <div class="flex gap-2 flex-wrap">
              <button
                @click="$emit('selectDirectory')"
                class="px-4 py-2 text-xs font-mono border rounded-lg transition-all hover:scale-105"
                :style="{
                  borderColor: theme.borderColor,
                  backgroundColor: 'transparent',
                  color: theme.borderColor,
                }"
              >
                CHANGE FOLDER
              </button>
              <button
                @click="$emit('resetDirectory')"
                class="px-4 py-2 text-xs font-mono border rounded-lg transition-all hover:scale-105"
                :style="{
                  borderColor: theme.controlBorder,
                  backgroundColor: theme.controlBg,
                  color: theme.borderColor,
                }"
              >
                USE DEFAULT
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="flex gap-3 mb-3">
          <div 
            class="flex-1 p-3 rounded-lg border font-mono text-xs overflow-x-auto"
            :style="{
              borderColor: theme.controlBorder,
              backgroundColor: theme.controlBg,
              color: theme.tapeAccent,
            }"
          >
            {{ outputDirectory || "Not configured" }}
          </div>
          <button
            @click="$emit('selectDirectory')"
            class="px-6 py-3 rounded-lg border-2 transition-all hover:scale-105 active:scale-95 font-mono text-xs font-medium"
            :style="{
              borderColor: theme.borderColor,
              backgroundColor: 'transparent',
              color: theme.borderColor,
            }"
          >
            BROWSE
          </button>
        </div>
        <div 
          class="p-3 rounded-lg border text-xs font-mono"
          :style="{
            borderColor: theme.infoBorder,
            backgroundColor: theme.infoBg,
          }"
        >
          <p 
            class="mb-2 font-medium"
            :style="{ color: theme.tapeAccent }"
          >
            INFO
          </p>
          <ul 
            class="space-y-1 ml-4 list-disc opacity-70"
            :style="{ color: theme.borderColor }"
          >
            <li>Choose a directory with write permissions</li>
            <li>Directory will be created automatically if missing</li>
            <li>Stems saved in subdirectories named after input files</li>
            <li>Recommended: Documents, Music, or Desktop</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

