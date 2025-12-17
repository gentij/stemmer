<template>
  <div
    class="min-h-screen flex items-center justify-center py-16 px-4 overflow-y-auto retro-background"
  >
    <SynthwaveBg
      :theme="currentTheme"
      class="pointer-events-none absolute inset-0 z-0 w-full h-full"
    />

    <div class="fixed top-8 left-8 z-50">
      <div class="backdrop-blur-md bg-black/20 rounded-2xl p-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] border border-white/10">
        <ThemeKnob
          :themes="retroCassetteThemes"
          :current-theme-id="currentTheme.id"
          @change="selectTheme"
        />
      </div>
    </div>

    <div class="fixed top-8 left-1/2 -translate-x-1/2 z-50">
      <div class="backdrop-blur-md bg-black/20 rounded-2xl p-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] border border-white/10">
        <AppLogo :theme="currentTheme" />
      </div>
    </div>

    <div
      class="w-full max-w-6xl mx-auto space-y-6 md:space-y-8 relative z-10 flex flex-col items-center my-auto px-4 pt-24"
    >
      <Motion
        v-if="showStems || isProcessing"
        as="div"
        :key="`cassette-${renderKey}`"
        class="w-full max-w-3xl"
        :initial="{ y: 100, opacity: 0 }"
        :animate="{ y: 0, opacity: 1 }"
        :transition="{
          type: 'spring',
          stiffness: 200,
          damping: 20,
        }"
      >
        <CassettePlayer :theme="currentTheme" :track-name="currentTrack" />
      </Motion>

      <ProcessingIndicator
        v-if="isProcessing"
        :theme="currentTheme"
        :status="status"
        :message="processingMessage"
        :progress="progress"
        :current-stage="currentStage"
        :current-stem="currentStem"
      />

      <Motion
        v-if="showStems"
        as="div"
        :key="`stems-${renderKey}`"
        class="w-full space-y-6"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{
          type: 'spring',
          stiffness: 200,
          damping: 20,
        }"
      >
        <StemControl :theme="currentTheme" />
        
        <div class="flex justify-center">
          <ProcessingActions :theme="currentTheme" :output-path="outputPath" />
        </div>
      </Motion>

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
import { ref, watch, onMounted } from "vue";
import { Motion } from "motion-v";
import CassettePlayer from "@/components/retro/cassette/Cassette.vue";
import StemControl from "@/components/retro/stems/StemMixer.vue";
import ThemeKnob from "@/components/retro/theme-knob/ThemeKnob.vue";
import AppLogo from "@/components/retro/logo/AppLogo.vue";
import FileUpload from "@/components/retro/upload/FileUpload.vue";
import ProcessingIndicator from "@/components/retro/processing/ProcessingIndicator.vue";
import ProcessingActions from "@/components/retro/actions/ProcessingActions.vue";
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
  status,
  progress,
  currentStage,
  currentStem,
  outputPath,
  handleFileLoaded,
  initialize,
} = useAudioProcessing();

const renderKey = ref(0);

watch(() => status.value, (newStatus) => {
  if (newStatus === "processing" || newStatus === "finished") {
    renderKey.value++;
  }
});

onMounted(async () => {
  await initialize();
});
</script>

