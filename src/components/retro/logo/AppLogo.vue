<template>
  <div class="relative flex items-center gap-3">
    <div class="flex flex-col gap-1">
      <div class="w-1 h-4 rounded-full" :style="{ backgroundColor: theme.tapeAccent }"></div>
      <div class="w-1 h-4 rounded-full" :style="{ backgroundColor: theme.tapeAccent }"></div>
    </div>

    <div
      class="relative flex items-center px-5 py-2.5 border-2 shadow-[0_4px_12px_0_rgba(0,0,0,0.4)]"
      :style="{
        borderColor: theme.borderColor,
        backgroundColor: theme.housingColor,
      }"
    >
      <div class="absolute inset-0 flex flex-col justify-between opacity-20">
        <div
          v-for="i in 6"
          :key="i"
          class="w-full h-[16%]"
          :style="{ backgroundColor: theme.lineColor }"
        ></div>
      </div>

      <div class="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2" :style="{ borderColor: theme.borderColor }"></div>
      <div class="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2" :style="{ borderColor: theme.borderColor }"></div>
      <div class="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2" :style="{ borderColor: theme.borderColor }"></div>
      <div class="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2" :style="{ borderColor: theme.borderColor }"></div>

      <h1
        class="relative text-xl sm:text-2xl md:text-3xl font-tropical whitespace-nowrap tracking-wider"
        :style="{ color: theme.tapeColor }"
      >
        STEMMER
      </h1>
    </div>

    <div class="flex flex-col gap-1">
      <div class="w-1 h-4 rounded-full" :style="{ backgroundColor: theme.tapeAccent }"></div>
      <div class="w-1 h-4 rounded-full" :style="{ backgroundColor: theme.tapeAccent }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CassetteTheme } from "@/types/retro/cassete.interface";

defineProps<{ theme: CassetteTheme }>();
</script>

