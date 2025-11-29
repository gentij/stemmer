<template>
  <div class="relative flex items-center gap-4">
    <div class="relative w-8 h-8 md:w-10 md:h-10 flex-shrink-0">
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
      </svg>
    </div>

    <div
      class="relative flex items-center px-6 py-3 md:px-8 md:py-4 border-2 shadow-[-4px_8px_16px_0_rgba(255,255,255,0.16)]"
      :style="{
        borderColor: theme.borderColor,
        backgroundColor: theme.housingColor,
      }"
    >
      <div class="absolute inset-0 flex flex-col justify-between opacity-30">
        <div
          v-for="i in 10"
          :key="i"
          class="w-full h-[10%]"
          :style="{ backgroundColor: theme.lineColor }"
        ></div>
      </div>

      <div class="absolute top-1 left-1">
        <CassetteScrew :theme="theme" gradient-id="logo-screw-1" />
      </div>
      <div class="absolute top-1 right-1">
        <CassetteScrew :theme="theme" gradient-id="logo-screw-2" />
      </div>
      <div class="absolute bottom-1 left-1">
        <CassetteScrew :theme="theme" gradient-id="logo-screw-3" />
      </div>
      <div class="absolute bottom-1 right-1">
        <CassetteScrew :theme="theme" gradient-id="logo-screw-4" />
      </div>

      <div class="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" :style="{ borderColor: theme.borderColor }"></div>
      <div class="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" :style="{ borderColor: theme.borderColor }"></div>
      <div class="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" :style="{ borderColor: theme.borderColor }"></div>
      <div class="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" :style="{ borderColor: theme.borderColor }"></div>

      <h1
        class="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-tropical whitespace-nowrap tracking-wider z-10"
        :style="{
          color: theme.tapeColor,
          textShadow: `0 2px 8px ${theme.borderColor}40, 0 0 16px ${theme.tapeAccent}30`,
        }"
      >
        STEMMER
      </h1>

      <div class="absolute top-1 left-4 right-4 h-0.5" :style="{ backgroundColor: theme.tapeAccent, opacity: 0.5 }"></div>
      <div class="absolute bottom-1 left-4 right-4 h-0.5" :style="{ backgroundColor: theme.tapeAccent, opacity: 0.5 }"></div>
    </div>

    <div class="relative w-8 h-8 md:w-10 md:h-10 flex-shrink-0">
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
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CassetteTheme } from "@/types/retro/cassete.interface";
import CassetteScrew from "@/components/retro/cassette/CassetteScrew.vue";

defineProps<{ theme: CassetteTheme }>();
</script>

