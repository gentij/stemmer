<template>
  <div 
    class="min-h-screen flex items-center justify-center py-16 px-4 overflow-y-auto retro-background"
    :style="backgroundStyle"
  >
    
    <div class="palm-left">
      <Palm :theme="currentTheme" />
    </div>

    <div class="palm-right">
      <Palm :theme="currentTheme" />
    </div>

    <div class="fixed bottom-8 right-8 z-50">
      <ThemeKnob
        :themes="retroCassetteThemes"
        :current-theme-id="currentTheme.id"
        @change="selectTheme"
      />
    </div>

    <div
      class="w-full max-w-2xl mx-auto space-y-8 md:space-y-12 relative z-10 flex flex-col items-center my-auto"
    >
      <CassettePlayer :theme="currentTheme" :track-name="currentTrack" />

      <ProcessingIndicator 
        v-if="isProcessing" 
        :theme="currentTheme" 
        :message="processingMessage" 
      />

      <StemControl v-if="showStems" :theme="currentTheme" />

      <FileUpload 
        v-if="showUpload" 
        :theme="currentTheme" 
        @file-loaded="handleFileLoaded" 
      />
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
import Palm from "@/components/retro/background/Palm.vue";
import { useRetroCassetteTheme } from "@/composables/useRetroCassetteTheme";
import { useAudioProcessing } from "@/composables/useAudioProcessing";

const { 
  currentTheme, 
  retroCassetteThemes, 
  backgroundStyle, 
  selectTheme 
} = useRetroCassetteTheme();

const {
  currentTrack,
  showStems,
  showUpload,
  isProcessing,
  processingMessage,
  handleFileLoaded,
  initialize
} = useAudioProcessing();

onMounted(async () => {
  await initialize();
});
</script>

<style scoped>
.retro-background {
  position: relative;
  transition: background 0.5s ease;
}

.palm-left,
.palm-right {
  position: fixed;
  bottom: 0;
  width: 600px;
  height: 100vh;
  z-index: 1;
  pointer-events: none;
  opacity: 1;
}

.palm-left {
  left: -100px;
  transform: rotate(8deg);
  transform-origin: bottom center;
}

.palm-right {
  right: -100px;
  transform: rotate(-8deg);
  transform-origin: bottom center;
}

.palm-left svg,
.palm-right svg {
  width: 100%;
  height: 100%;
  transition: all 0.5s ease;
}

@media (max-width: 768px) {
  .palm-left,
  .palm-right {
    width: 400px;
  }
  
  .palm-left {
    left: -120px;
  }
  
  .palm-right {
    right: -120px;
  }
}
</style>
