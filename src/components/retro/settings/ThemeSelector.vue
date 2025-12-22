<script setup lang="ts">
import type { CassetteTheme } from "@/types/retro/cassete.interface";

interface Theme {
  value: string;
  label: string;
  description: string;
}

interface Props {
  theme: CassetteTheme;
  availableThemes: Theme[];
  currentThemeRoute: string;
}

defineProps<Props>();

defineEmits<{
  (e: "themeChange", themeValue: string): void;
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
    <div class="flex items-center justify-between mb-4">
      <label 
        class="text-sm font-mono uppercase tracking-wider"
        :style="{ color: theme.tapeAccent }"
      >
        INTERFACE THEME
      </label>
    </div>
    <div class="space-y-2">
      <label
        v-for="availableTheme in availableThemes"
        :key="availableTheme.value"
        class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all"
        :class="currentThemeRoute === availableTheme.value ? 'border-2' : 'border'"
        :style="currentThemeRoute === availableTheme.value 
          ? { 
              borderColor: theme.borderColor,
              backgroundColor: `${theme.controlBg}80`,
            }
          : {
              borderColor: theme.controlBorder,
              backgroundColor: theme.controlBg,
            }"
        @click="$emit('themeChange', availableTheme.value)"
      >
        <div class="relative w-5 h-5 flex-shrink-0">
          <div
            class="absolute inset-0 rounded-full border-2"
            :style="{ borderColor: theme.borderColor }"
          ></div>
          <div
            v-if="currentThemeRoute === availableTheme.value"
            class="absolute inset-1 rounded-full"
            :style="{ backgroundColor: theme.borderColor }"
          ></div>
        </div>
        <div class="flex-1">
          <div 
            class="font-mono text-sm font-medium"
            :style="{ color: currentThemeRoute === availableTheme.value ? theme.tapeAccent : theme.borderColor }"
          >
            {{ availableTheme.label }}
          </div>
          <div 
            class="text-xs font-mono opacity-60"
            :style="{ color: theme.borderColor }"
          >
            {{ availableTheme.description }}
          </div>
        </div>
      </label>
    </div>
  </div>
</template>

