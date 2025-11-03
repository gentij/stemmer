<template>
  <div class="w-full max-w-md px-4">
    <div
      class="border-2 rounded-2xl p-8 text-center"
      :style="{ 
        borderColor: theme.borderColor,
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
      }"
    >
      <div class="flex flex-col items-center gap-4">
        <svg
          class="w-16 h-16 animate-spin"
          :style="{ color: theme.borderColor }"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="2"
            stroke-dasharray="60"
            stroke-dashoffset="0"
            stroke-linecap="round"
          />
        </svg>
        
        <div class="space-y-2">
          <p class="text-white font-medium text-lg">
            Separating Stems
          </p>
          <p class="text-white/70 text-sm">
            {{ message }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CassetteTheme } from "@/types/retro/cassete.interface";

interface Props {
  theme: CassetteTheme;
  message: string;
}

defineProps<Props>();
</script>
