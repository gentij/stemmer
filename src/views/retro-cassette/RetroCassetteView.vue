<template>
  <div class="min-h-screen bg-cassette-bg flex items-center justify-center py-16 px-4 overflow-y-auto">

    <div class="fixed bottom-8 right-8 z-50">
      <ThemeKnob
        :themes="retroCassetteThemes"
        :current-theme-id="currentTheme.id"
        @change="selectTheme"
      />
    </div>

    <div
      class="w-full max-w-2xl mx-auto space-y-8 md:space-y-12 z-10 flex flex-col items-center my-auto"
    >
      <CassettePlayer :theme="currentTheme" :track-name="currentTrack" />

      <StemControl :theme="currentTheme" />

      <FileUpload :theme="currentTheme" @file-loaded="handleFileLoaded" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useAudioCoreStore } from "@/stores/audio-core.store";
import CassettePlayer from "@/components/retro/cassette/Cassette.vue";
import StemControl from "@/components/retro/stems/StemMixer.vue";
import ThemeKnob from "@/components/retro/theme-knob/ThemeKnob.vue";
import FileUpload from "@/components/retro/upload/FileUpload.vue";
import { retroCassetteThemes, getThemeById } from "@/constants/retro/cassete";
import { CassetteTheme } from "@/types/retro/cassete.interface";

const currentThemeId = ref("purple-dream");
const currentTheme = ref<CassetteTheme>(getThemeById(currentThemeId.value));

const audioStore = useAudioCoreStore();
const { audioPath } = storeToRefs(audioStore);

const displayName = ref<string | null>(null);

const currentTrack = computed(() => {
  if (displayName.value) return displayName.value;
  if (audioPath.value) return audioPath.value.split(/[\\/]/).pop() || "Unknown Track";
  return "No Track Loaded";
});

function selectTheme(themeId: string) {
  currentThemeId.value = themeId;
  currentTheme.value = getThemeById(themeId);
}

function handleFileLoaded(filename: string) {
  displayName.value = filename;
}
</script>

<style scoped></style>
