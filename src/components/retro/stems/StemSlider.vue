<template>
  <div class="flex-1 space-y-2">
    <div class="flex items-center justify-between">
      <label
        :for="`${stem.id}-volume`"
        class="text-white font-medium text-sm md:text-base"
      >
        {{ stem.name }}
      </label>
      <span class="text-white/60 text-xs md:text-sm">{{ stem.volume }}%</span>
    </div>
    <input
      :id="`${stem.id}-volume`"
      v-model.number="stem.volume"
      type="range"
      min="0"
      max="100"
      class="w-full h-2 rounded-full appearance-none cursor-pointer stem-slider"
      :style="{
        '--slider-color': color,
        '--slider-progress': `${stem.volume}%`,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import type { Stem } from "@/types/stems.interface";

defineProps<{ stem: Stem; color: string }>();
</script>

<style scoped>
.stem-slider {
  background: linear-gradient(
    to right,
    var(--slider-color) 0%,
    var(--slider-color) var(--slider-progress),
    rgba(255, 255, 255, 0.2) var(--slider-progress),
    rgba(255, 255, 255, 0.2) 100%
  );
}

.stem-slider::-webkit-slider-thumb,
.stem-slider::-moz-range-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  border: 2px solid var(--slider-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
</style>
