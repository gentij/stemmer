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

      <div class="w-full">
        <div
          class="border-2 border-dashed rounded-2xl p-8 text-center transition-all hover:border-cassette-pink-border cursor-pointer"
          :style="{ borderColor: currentTheme.borderColor + '40' }"
        >
          <svg
            class="w-12 h-12 mx-auto mb-4 opacity-50"
            :style="{ color: currentTheme.borderColor }"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 16V10H5L12 3L19 10H15V16H9ZM5 20V18H19V20H5Z"
              :fill="currentTheme.borderColor"
            />
          </svg>
          <p class="text-white/70 text-sm md:text-base mb-2">
            Drop your audio file here
          </p>
          <p class="text-white/50 text-xs">MP3, WAV, FLAC supported</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CassettePlayer from "@/components/retro/cassette/Cassette.vue";
import StemControl from "@/components/retro/stems/StemMixer.vue";
import ThemeKnob from "@/components/retro/theme-knob/ThemeKnob.vue";
import { retroCassetteThemes, getThemeById } from "@/constants/retro/cassete";
import { CassetteTheme } from "@/types/retro/cassete.interface";

const currentThemeId = ref("purple-dream");
const currentTheme = ref<CassetteTheme>(getThemeById(currentThemeId.value));
const currentTrack = ref("Serenity Vol.1");

function selectTheme(themeId: string) {
  currentThemeId.value = themeId;
  currentTheme.value = getThemeById(themeId);
}
</script>

<style scoped></style>
