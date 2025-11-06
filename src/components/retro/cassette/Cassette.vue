<template>
  <div class="flex flex-col items-center gap-8 md:gap-12 w-full">
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
import { storeToRefs } from "pinia";
import type { CassetteTheme } from "@/types/retro/cassete.interface";
import { defaultCassetteTheme } from "@/constants/retro/cassete";
import { useStemsAudioStore } from "@/stores/stems-audio.store";
import CassetteBody from "./CassetteBody.vue";

interface Props {
  theme?: CassetteTheme;
  trackName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  theme: () => defaultCassetteTheme,
  trackName: "Serenity Vol.1",
});

const stemsAudioStore = useStemsAudioStore();
const { isPlaying } = storeToRefs(stemsAudioStore);

const uniqueId = Math.random().toString(36).slice(2);

function togglePlay() {
  stemsAudioStore.togglePlayPause();
}
function skipForward() {
  stemsAudioStore.skipForward(10);
}
function skipBackward() {
  stemsAudioStore.skipBackward(10);
}
</script>

<style scoped>
svg {
  display: block;
}
</style>
