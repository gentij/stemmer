<template>
  <div
    class="w-full aspect-[17/10] rounded-3xl border-2 shadow-[-4px_8px_16px_0_rgba(255,255,255,0.16)] relative overflow-hidden"
    :style="{
      borderColor: theme.borderColor,
      backgroundColor: theme.housingColor,
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
  </div>
</template>

<script setup lang="ts">
import type { CassetteTheme } from "@/types/retro/cassete.interface";
import CassetteWindow from "./CassetteWindow.vue";
import CassetteScrew from "./CassetteScrew.vue";
import CassetteInfoBar from "./CassetteInfoBar.vue";

defineProps<{
  theme: CassetteTheme;
  isPlaying: boolean;
  gradientId: string;
  trackName: string;
}>();

defineEmits<{ (e: "toggle"): void; (e: "back"): void; (e: "forward"): void }>();
</script>
