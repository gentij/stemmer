<template>
  <div class="flex-1 space-y-2">
    <div class="flex items-center justify-between">
      <label
        :for="`${stem.id}-volume`"
        class="text-white font-medium text-sm md:text-base"
      >
        {{ stem.name }}
      </label>
      <Motion
        :animate="{ scale: isDragging ? 1.1 : 1 }"
        :transition="{ type: 'spring', stiffness: 400, damping: 25 }"
      >
        <span class="text-white/60 text-xs md:text-sm">{{ displayVolume }}%</span>
      </Motion>
    </div>
    <input
      :id="`${stem.id}-volume`"
      :value="displayVolume"
      type="range"
      min="0"
      max="100"
      class="w-full h-2 rounded-full appearance-none cursor-pointer stem-slider"
      :style="{
        '--slider-color': color,
        '--slider-progress': `${displayVolume}%`,
      }"
      @input="onInput"
      @mousedown="startDrag"
      @mouseup="onDragEnd"
      @touchstart="startDrag"
      @touchend="onDragEnd"
    />
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { Motion } from "motion-v";
import type { Stem } from "@/types/stems.interface";
import { useVolumeControl } from "@/composables/useVolumeControl";

const props = defineProps<{ stem: Stem; color: string }>();

const emit = defineEmits<{
  (e: "volume-change", volume: number): void;
  (e: "volume-final", volume: number): void;
}>();

const {
  displayVolume,
  isDragging,
  handleVolumeInput,
  startDrag,
  endDrag,
  syncVolume,
} = useVolumeControl({
  initialVolume: props.stem.volume,
  onVolumeChange: (volume) => emit("volume-change", volume),
  onVolumeFinal: (volume) => emit("volume-final", volume),
});

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  handleVolumeInput(Number(target.value));
}

function onDragEnd(event: Event) {
  const target = event.target as HTMLInputElement;
  endDrag(Number(target.value));
}

watch(() => props.stem.volume, (newVolume) => {
  syncVolume(newVolume);
});
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
  transition: background 0.1s ease-out;
}

.stem-slider::-webkit-slider-thumb,
.stem-slider::-moz-range-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  cursor: grab;
  border: 2px solid var(--slider-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.15s ease;
}

.stem-slider::-webkit-slider-thumb:hover,
.stem-slider::-moz-range-thumb:hover {
  transform: scale(1.15);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
}

.stem-slider::-webkit-slider-thumb:active,
.stem-slider::-moz-range-thumb:active {
  cursor: grabbing;
  transform: scale(1.25);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}
</style>
