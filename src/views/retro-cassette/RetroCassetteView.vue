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
import { ref, computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useAudioCoreStore } from "@/stores/audio-core.store";
import { useSplitterToolStore } from "@/stores/splitter-tool.store";
import { useSettingsStore } from "@/stores/settings.store";
import { useStemsAudioStore } from "@/stores/stems-audio.store";
import CassettePlayer from "@/components/retro/cassette/Cassette.vue";
import StemControl from "@/components/retro/stems/StemMixer.vue";
import ThemeKnob from "@/components/retro/theme-knob/ThemeKnob.vue";
import FileUpload from "@/components/retro/upload/FileUpload.vue";
import ProcessingIndicator from "@/components/retro/processing/ProcessingIndicator.vue";
import { retroCassetteThemes, getThemeById } from "@/constants/retro/cassete";
import { CassetteTheme } from "@/types/retro/cassete.interface";

const currentThemeId = ref("purple-dream");
const currentTheme = ref<CassetteTheme>(getThemeById(currentThemeId.value));

const audioStore = useAudioCoreStore();
const { audioPath } = storeToRefs(audioStore);

const splitterStore = useSplitterToolStore();
const { status, currentStage, downloadProgress, writingPercent } = storeToRefs(splitterStore);

const settingsStore = useSettingsStore();
const stemsAudioStore = useStemsAudioStore();

const displayName = ref<string | null>(null);

const currentTrack = computed(() => {
  if (displayName.value) return displayName.value;
  if (audioPath.value) return audioPath.value.split(/[\\/]/).pop() || "Unknown Track";
  return "No Track Loaded";
});

const showStems = computed(() => status.value === "finished");
const showUpload = computed(() => {
  return status.value === "idle" || status.value === "error";
});
const isProcessing = computed(() => splitterStore.isProcessing);

watch(status, async (newStatus, oldStatus) => {
  if (newStatus === "finished" && oldStatus !== "finished") {
    console.log("🎵 Splitting complete, loading stems for playback...");
    await stemsAudioStore.loadStems();
  }
});

const processingMessage = computed(() => {
  switch (status.value) {
    case "downloading":
      return `Downloading model... ${downloadProgress.value}%`;
    case "processing":
      return currentStage.value || "Processing audio...";
    case "writing":
      return `Writing stems... ${writingPercent.value}%`;
    default:
      return "Processing...";
  }
});

function selectTheme(themeId: string) {
  currentThemeId.value = themeId;
  currentTheme.value = getThemeById(themeId);
}

async function handleFileLoaded(filename: string) {
  displayName.value = filename;

  if (audioStore.audioPath && settingsStore.hasValidOutputDirectory && splitterStore.status === "idle") {
    console.log("✅ All requirements met, starting split...");
    await splitterStore.split();
  } else {
    console.error("❌ Missing requirements for splitting:");
    if (!audioStore.audioPath) console.error("  - No audio path");
    if (!settingsStore.hasValidOutputDirectory) console.error("  - No output directory");
    if (splitterStore.status !== "idle") console.error("  - Already processing");
  }
}

onMounted(async () => {
  await settingsStore.initialize();
});
</script>

<style scoped></style>
