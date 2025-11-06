<template>
  <div
    class="min-h-screen flex items-center justify-center py-16 px-4 overflow-y-auto retro-background"
  >
    <SynthwaveBg
      :theme="currentTheme"
      class="pointer-events-none absolute inset-0 z-0 w-full h-full"
    />

    <div class="fixed bottom-8 right-8 z-50">
      <ThemeKnob
        :themes="retroCassetteThemes"
        :current-theme-id="currentTheme.id"
        @change="selectTheme"
      />
    </div>

    <div
      class="w-full max-w-4xl mx-auto space-y-8 md:space-y-12 relative z-10 flex flex-col items-center my-auto px-4"
    >
      <div class="w-full max-w-3xl">
        <CassettePlayer :theme="currentTheme" :track-name="currentTrack" />
      </div>

      <ProcessingIndicator
        v-if="isProcessing"
        :theme="currentTheme"
        :message="processingMessage"
      />

      <div v-if="showStems" class="w-full max-w-3xl">
        <StemControl :theme="currentTheme" />
      </div>

      <div v-if="showUpload" class="w-full max-w-3xl">
        <FileUpload
          :theme="currentTheme"
          @file-loaded="handleFileLoaded"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import CassettePlayer from "@/components/retro/cassette/Cassette.vue";
import StemControl from "@/components/retro/stems/StemMixer.vue";
import ThemeKnob from "@/components/retro/theme-knob/ThemeKnob.vue";
import FileUpload from "@/components/retro/upload/FileUpload.vue";
import ProcessingIndicator from "@/components/retro/processing/ProcessingIndicator.vue";
import SynthwaveBg from "@/components/retro/background/Background.vue";
import { useRetroCassetteTheme } from "@/composables/useRetroCassetteTheme";
import { useAudioProcessing } from "@/composables/useAudioProcessing";

const { currentTheme, retroCassetteThemes, selectTheme } =
  useRetroCassetteTheme();

const {
  currentTrack,
  showStems,
  showUpload,
  isProcessing,
  processingMessage,
  handleFileLoaded,
  initialize,
} = useAudioProcessing();

onMounted(async () => {
  await initialize();
});
</script>

