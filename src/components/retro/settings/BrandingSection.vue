<script setup lang="ts">
import type { CassetteTheme } from "@/types/retro/cassete.interface";
import CassetteScrew from "@/components/retro/cassette/CassetteScrew.vue";

interface Props {
  theme: CassetteTheme;
}

defineProps<Props>();

const uniqueId = Math.random().toString(36).slice(2);
</script>

<template>
  <div
    class="border-2 rounded-3xl p-8 md:p-10 shadow-[-4px_8px_16px_0_rgba(255,255,255,0.16)] relative overflow-hidden"
    :style="{ 
      borderColor: theme.borderColor,
      backgroundColor: theme.housingColor,
    }"
  >
    <div class="absolute inset-0 flex flex-col justify-between opacity-30">
      <div
        v-for="i in 20"
        :key="i"
        class="w-full h-[4%]"
        :style="{ backgroundColor: theme.lineColor }"
      ></div>
    </div>

    <div class="absolute top-4 left-4">
      <CassetteScrew :theme="theme" :gradient-id="`branding-${uniqueId}-1`" />
    </div>
    <div class="absolute top-4 right-4">
      <CassetteScrew :theme="theme" :gradient-id="`branding-${uniqueId}-2`" />
    </div>
    <div class="absolute bottom-4 left-4">
      <CassetteScrew :theme="theme" :gradient-id="`branding-${uniqueId}-3`" />
    </div>
    <div class="absolute bottom-4 right-4">
      <CassetteScrew :theme="theme" :gradient-id="`branding-${uniqueId}-4`" />
    </div>

    <div class="relative z-10 flex items-center gap-6">
      <img
        src="/stemmer_logo.svg"
        alt="Stemmer Logo"
        class="w-20 h-20 flex-shrink-0"
      />
      <div>
        <h1 
          class="text-4xl font-bold mb-1 font-mono tracking-wider"
          :style="{ color: theme.tapeAccent }"
        >
          STEMMER
        </h1>
        <p 
          class="text-sm font-mono opacity-70"
          :style="{ color: theme.borderColor }"
        >
          by gentij
        </p>
      </div>
    </div>
  </div>
</template>

