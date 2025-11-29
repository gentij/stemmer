<template>
  <div class="stem-waveform-container">
    <div 
      ref="waveformRef" 
      class="waveform-wrapper"
      :style="{ height: `${height}px` }"
    />
    <Motion
      v-if="isLoading"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0 }"
      :transition="{ duration: 0.3 }"
      class="loading-overlay"
      :style="{ color: color }"
    >
      <Motion
        :animate="{ rotate: 360 }"
        :transition="{ duration: 1, repeat: Infinity, ease: 'linear' }"
        class="loading-spinner-wrapper"
      >
        <div class="loading-spinner" :style="{ borderColor: color, borderTopColor: 'transparent' }"></div>
      </Motion>
      <span class="text-xs">Loading waveform...</span>
    </Motion>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Motion } from "motion-v";
import type { CassetteTheme } from "@/types/retro/cassete.interface";
import { useWaveform } from "@/composables/useWaveform";

const Infinity = Number.POSITIVE_INFINITY;

interface Props {
  stemId: string;
  stemName: string;
  audioSrc: string;
  color: string;
  theme: CassetteTheme;
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  height: 80,
});

const waveformRef = ref<HTMLDivElement | null>(null);

const { isLoading } = useWaveform(waveformRef, {
  audioSrc: props.audioSrc,
  colors: {
    waveColor: `${props.color}40`,
    progressColor: props.color,
    cursorColor: props.theme.goldText,
  },
  height: props.height,
  onLoad: () => {
    console.log(`Waveform loaded for ${props.stemName}`);
  },
  onError: (error) => {
    console.error(`Failed to load waveform for ${props.stemName}:`, error);
  },
});
</script>

<style scoped>
.stem-waveform-container {
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transform: translateZ(0);
  will-change: contents;
}

.waveform-wrapper {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  contain: layout style paint;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.loading-spinner-wrapper {
  display: inline-block;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid;
  border-radius: 50%;
}
</style>

