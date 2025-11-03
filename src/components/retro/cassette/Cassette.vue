<template>
  <div class="flex flex-col items-center gap-8 md:gap-12 w-full max-w-md">
    <!-- Cassette Body -->
    <CassetteBody
      :theme="props.theme"
      :is-playing="isPlaying"
      :gradient-id="uniqueId"
      :track-name="props.trackName"
      @toggle="togglePlay"
      @back="skipBackward"
      @forward="skipForward"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { CassetteTheme } from "@/types/retro/cassete.interface";
import { defaultCassetteTheme } from "@/constants/retro/cassete";
import CassetteBody from "./CassetteBody.vue";

interface Props {
  theme?: CassetteTheme;
  trackName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  theme: () => defaultCassetteTheme,
  trackName: "Serenity Vol.1",
});

const isPlaying = ref(false);
const uniqueId = Math.random().toString(36).slice(2);

function togglePlay() {
  isPlaying.value = !isPlaying.value;
}
function skipForward() {
  console.log("Skip forward");
}
function skipBackward() {
  console.log("Skip backward");
}
</script>

<style scoped>
svg {
  display: block;
}
</style>
