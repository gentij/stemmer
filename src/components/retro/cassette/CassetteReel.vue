<template>
  <div class="w-[16%] aspect-square">
    <svg
      class="w-full h-full"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="16"
        cy="16"
        r="15.5"
        :fill="theme.reelOuter"
        :stroke="theme.reelStroke"
      />
      <g
        class="reel-rotor"
        :class="{ 'reel-playing': props.isPlaying, 'reel-skipping': props.isSkipping }"
        :style="{
          filter: props.isSkipping ? 'blur(2px)' : 'none',
        }"
      >
        <ellipse
          cx="16"
          cy="15.9375"
          rx="12"
          ry="11.9375"
          :fill="theme.reelInner"
        />
        <rect
          x="14.5"
          y="4"
          width="3"
          height="4.47657"
          :fill="theme.reelCenter"
        />
        <rect
          width="3"
          height="4.47657"
          transform="matrix(1 0 0 -1 14.5 28)"
          :fill="theme.reelCenter"
        />
        <rect
          width="2.9922"
          height="4.4883"
          transform="matrix(0.70895 0.705259 -0.70895 0.705259 24.0301 7.05566)"
          :fill="theme.reelCenter"
        />
        <rect
          width="2.9922"
          height="4.4883"
          transform="matrix(0.70895 -0.705259 -0.70895 -0.705259 24.0301 24.9443)"
          :fill="theme.reelCenter"
        />
        <rect
          width="2.9922"
          height="4.4883"
          transform="matrix(-0.70895 0.705259 0.70895 0.705259 7.59489 7.05566)"
          :fill="theme.reelCenter"
        />
        <rect
          width="2.9922"
          height="4.4883"
          transform="matrix(-0.70895 -0.705259 0.70895 -0.705259 7.59489 24.9443)"
          :fill="theme.reelCenter"
        />
        <rect
          width="2.98438"
          height="4.5"
          transform="matrix(-0.00464132 0.999989 -0.999989 -0.00459312 28 14.4434)"
          :fill="theme.reelCenter"
        />
        <rect
          width="2.98438"
          height="4.5"
          transform="matrix(0.00461716 0.999989 0.999989 -0.00461716 4 14.4431)"
          :fill="theme.reelCenter"
        />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import type { CassetteTheme } from "@/types/retro/cassete.interface";

const props = withDefaults(defineProps<{ theme: CassetteTheme; isPlaying: boolean; isSkipping?: boolean }>(), {
  isSkipping: false,
});
</script>

<style scoped>
svg {
  display: block;
}

.reel-rotor {
  transform-box: fill-box;
  transform-origin: 50% 50%;
  transition: transform 0.3s ease-out;
}

.reel-playing {
  animation: reel-rotate 3s linear infinite;
}

.reel-skipping {
  animation: reel-rotate-fast 0.3s linear infinite;
}

@keyframes reel-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes reel-rotate-fast {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
