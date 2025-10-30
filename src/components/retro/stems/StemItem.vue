<template>
  <div
    class="flex items-center gap-4 p-4 rounded-2xl border-2 transition-all hover:shadow-lg"
    :style="{
      borderColor: stem.color,
      backgroundColor: 'rgba(13, 13, 13, 0.8)',
    }"
  >
    <StemSlider :stem="stem" />
    <StemMuteButton
      :name="stem.name"
      :muted="stem.muted"
      :color="stem.color"
      @toggle="stem.muted = !stem.muted"
    />
  </div>
</template>

<script setup lang="ts">
import type { Stem } from "@/types/stems.interface";
import StemSlider from "./StemSlider.vue";
import StemMuteButton from "./StemMuteButton.vue";

defineProps<{ stem: Stem }>();
</script>
