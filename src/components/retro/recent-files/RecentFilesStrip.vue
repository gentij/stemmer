<template>
  <div
    v-if="recentFiles.length > 0"
    class="w-full"
  >
    <div class="flex items-center gap-2 mb-3">
      <p
        class="text-sm font-mono opacity-70"
        :style="{ color: theme.borderColor }"
      >
        RECENT FILES
      </p>
      <div
        class="flex-1 h-px"
        :style="{ backgroundColor: `${theme.borderColor}40` }"
      ></div>
    </div>
    <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      <button
        v-for="file in recentFiles"
        :key="file.path"
        @click="$emit('fileSelected', file.path)"
        class="flex-shrink-0 px-4 py-2 rounded-lg border-2 transition-all hover:scale-105"
        :style="{
          borderColor: `${theme.borderColor}60`,
          backgroundColor: 'rgba(13, 13, 13, 0.6)',
        }"
        :class="{
          'hover:border-opacity-100': true,
        }"
      >
        <div class="flex items-center gap-2">
          <svg
            class="w-4 h-4 flex-shrink-0"
            :style="{ color: theme.tapeAccent }"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
              :fill="theme.tapeAccent"
              fill-opacity="0.6"
            />
            <path
              d="M14 2V8H20"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span
            class="text-sm font-mono truncate max-w-[200px]"
            :style="{ color: theme.borderColor }"
          >
            {{ file.name }}
          </span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CassetteTheme } from "@/types/retro/cassete.interface";

interface Props {
  theme: CassetteTheme;
  recentFiles: Array<{ path: string; name: string; processedAt: number }>;
}

defineProps<Props>();

defineEmits<{
  (e: "fileSelected", path: string): void;
}>();
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>

