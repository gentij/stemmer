<template>
  <Motion
    as="div"
    class="w-full aspect-[17/10] rounded-3xl border-2 shadow-[-4px_8px_16px_0_rgba(255,255,255,0.16)] relative overflow-hidden"
    :style="{
      borderColor: theme.borderColor,
      backgroundColor: theme.housingColor,
    }"
    :animate="wobbleAnimation"
    :transition="{
      type: 'spring',
      stiffness: 500,
      damping: 15,
    }"
  >
    <!-- Horizontal Lines Pattern -->
    <div class="absolute inset-0 flex flex-col justify-between">
      <div
        v-for="i in 18"
        :key="i"
        class="w-full h-[2%]"
        :style="{ backgroundColor: theme.lineColor }"
      ></div>
    </div>

    <!-- Main Tape Window -->
    <div class="absolute inset-0 flex items-start justify-center pt-[12%]">
      <CassetteWindow
        :theme="theme"
        :is-playing="isPlaying"
        :is-skipping="isSkipping"
        @toggle="$emit('toggle')"
        @back="$emit('back')"
        @forward="$emit('forward')"
      />
    </div>

    <!-- Corner Screws -->
    <div class="absolute top-3 left-3">
      <CassetteScrew :theme="theme" :gradient-id="gradientId" />
    </div>
    <div class="absolute top-3 right-3">
      <CassetteScrew :theme="theme" :gradient-id="gradientId" />
    </div>
    <div class="absolute bottom-3 left-3">
      <CassetteScrew :theme="theme" :gradient-id="gradientId" />
    </div>
    <div class="absolute bottom-3 right-3">
      <CassetteScrew :theme="theme" :gradient-id="gradientId" />
    </div>

    <!-- Info Bar -->
    <CassetteInfoBar :theme="theme" :track-name="trackName" />

    <!-- Light Reflection Sweep -->
    <Motion
      class="absolute inset-0 pointer-events-none z-10"
      :animate="{
        x: ['-50%', '150%'],
      }"
      :transition="{
        duration: 2.5,
        repeat: Infinity,
        repeatDelay: 12.5,
        ease: [0.4, 0, 0.2, 1],
      }"
    >
      <div
        class="w-1/2 h-full"
        :style="{
          background: `linear-gradient(90deg, 
            transparent 0%, 
            rgba(255, 255, 255, 0.15) 20%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0.15) 80%,
            transparent 100%
          )`,
          filter: 'blur(30px)',
          transform: 'skewX(-20deg)',
        }"
      />
    </Motion>
  </Motion>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Motion } from "motion-v";
import type { CassetteTheme } from "@/types/retro/cassete.interface";
import CassetteWindow from "./CassetteWindow.vue";
import CassetteScrew from "./CassetteScrew.vue";
import CassetteInfoBar from "./CassetteInfoBar.vue";

const Infinity = Number.POSITIVE_INFINITY;

const props = defineProps<{
  theme: CassetteTheme;
  isPlaying: boolean;
  gradientId: string;
  trackName: string;
  isSkipping?: boolean;
}>();

defineEmits<{ (e: "toggle"): void; (e: "back"): void; (e: "forward"): void }>();

const wobbleAnimation = ref<{ x: number | number[]; y: number | number[] }>({ x: 0, y: 0 });

watch(() => props.isPlaying, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    wobbleAnimation.value = {
      x: [0, -2],
      y: [0, 2],
    };
    setTimeout(() => {
      wobbleAnimation.value = { x: 0, y: 0 };
    }, 150);
  }
});
</script>
