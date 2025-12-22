<template>
  <div class="flex flex-col items-center gap-8 md:gap-12 w-full">
    <CassetteBody
      :theme="props.theme"
      :is-playing="isPlaying"
      :gradient-id="uniqueId"
      :track-name="props.trackName"
      :is-skipping="isSkipping"
      @toggle="togglePlay"
      @back="skipBackward"
      @forward="skipForward"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import type { CassetteTheme } from "@/types/retro/cassete.interface";
import { defaultCassetteTheme } from "@/constants/retro/cassete";
import { useStemsAudioStore } from "@/stores/stems-audio.store";
import { useSplitterToolStore } from "@/stores/splitter-tool.store";
import { useSettingsStore } from "@/stores/settings.store";
import CassetteBody from "./CassetteBody.vue";
import tapeInsertSound from "@/assets/sounds/tape-recorder-start.wav";

interface Props {
  theme?: CassetteTheme;
  trackName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  theme: () => defaultCassetteTheme,
  trackName: "Serenity Vol.1",
});

const stemsAudioStore = useStemsAudioStore();
const splitterStore = useSplitterToolStore();
const settingsStore = useSettingsStore();
const { isPlaying } = storeToRefs(stemsAudioStore);
const { status } = storeToRefs(splitterStore);
const { soundEnabled } = storeToRefs(settingsStore);

const uniqueId = Math.random().toString(36).slice(2);
const isSkipping = ref(false);

function playTapeInsertSound() {
  if (!soundEnabled.value) return;
  const audio = new Audio(tapeInsertSound);
  audio.volume = 0.3;
  audio.play().catch(() => {});
}

watch(() => props.trackName, (newTrack, oldTrack) => {
  if (newTrack && newTrack !== oldTrack && oldTrack) {
    playTapeInsertSound();
  }
});

watch(() => status.value, (newStatus, oldStatus) => {
  if (newStatus === "finished" && oldStatus !== "finished") {
    playTapeInsertSound();
  }
});

onMounted(() => {
  if (props.trackName && props.trackName !== "Serenity Vol.1") {
    playTapeInsertSound();
  }
});

function togglePlay() {
  stemsAudioStore.togglePlayPause();
}

function skipForward() {
  isSkipping.value = true;
  stemsAudioStore.skipForward(10);
  setTimeout(() => {
    isSkipping.value = false;
  }, 500);
}

function skipBackward() {
  isSkipping.value = true;
  stemsAudioStore.skipBackward(10);
  setTimeout(() => {
    isSkipping.value = false;
  }, 500);
}
</script>

<style scoped>
svg {
  display: block;
}
</style>
