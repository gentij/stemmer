<template>
  <div class="relative w-[86%] h-[60%]">
    <!-- Window Background -->
    <svg
      class="w-full h-full absolute"
      viewBox="0 0 292 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M275.224 0.75L291.25 14.3477V119.25H0.75V14.3398L16.2822 0.75H275.224Z"
        :fill="theme.windowBg"
        :stroke="theme.windowStroke"
        stroke-width="1.5"
      />
    </svg>

    <!-- Tape Section -->
    <div class="absolute inset-0 p-[1.5%]">
      <!-- Pink Tape Top -->
      <svg
        class="w-full h-[47%] absolute top-0"
        viewBox="0 0 284 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 11.5L13.5 0H270.5L284 11.5V56H142H0V11.5Z"
          :fill="theme.tapeColor"
        />
      </svg>

      <!-- Decorative Lines -->
      <div
        class="absolute top-[17%] left-0 w-[14%] h-[3.5%]"
        :style="{ backgroundColor: theme.tapeAccent }"
      ></div>
      <div
        class="absolute top-[22%] right-0 w-[14%] h-[3.5%]"
        :style="{ backgroundColor: theme.tapeAccent }"
      ></div>
      <div
        class="absolute top-[28%] left-0 w-[49%] h-[3.5%]"
        :style="{ backgroundColor: theme.tapeAccent }"
      ></div>
      <div
        class="absolute top-[11.5%] right-0 w-[49%] h-[3.5%]"
        :style="{ backgroundColor: theme.tapeAccent }"
      ></div>

      <!-- Yellow Tape Bottom -->
      <img
        class="w-full h-[47%] absolute bottom-0"
        :src="theme.tapeBottomImage"
        alt=""
      />

      <!-- Control Panel -->
      <div
        class="absolute top-[30%] left-[16%] w-[68%] h-[40%] rounded-full border-2 flex items-center justify-center px-3 gap-3"
        :style="{
          borderColor: theme.controlBorder,
          backgroundColor: theme.controlBg,
        }"
      >
        <CassetteReel :theme="theme" :is-playing="isPlaying" :is-skipping="isSkipping" />

        <CassetteControls
          :is-playing="isPlaying"
          @toggle="$emit('toggle')"
          @back="$emit('back')"
          @forward="$emit('forward')"
        />

        <CassetteReel :theme="theme" :is-playing="isPlaying" :is-skipping="isSkipping" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CassetteTheme } from "@/types/retro/cassete.interface";
import CassetteReel from "./CassetteReel.vue";
import CassetteControls from "./CassetteControls.vue";

defineProps<{ theme: CassetteTheme; isPlaying: boolean; isSkipping?: boolean }>();

defineEmits<{ (e: "toggle"): void; (e: "back"): void; (e: "forward"): void }>();
</script>
