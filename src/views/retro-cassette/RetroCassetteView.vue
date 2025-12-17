<template>
  <div
    class="min-h-screen flex items-center justify-center py-16 px-4 overflow-y-auto retro-background relative"
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
      v-if="showUpload"
      class="fixed top-48 left-1/2 -translate-x-1/2 z-40 w-full max-w-6xl px-4"
    >
      <RecentFilesStrip
        :theme="currentTheme"
        :recent-files="recentFiles"
        @file-selected="handleRecentFileSelected"
      />
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

    <WindowDragDrop
      :theme="currentTheme"
      @file-dropped="handleDroppedFile"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { Motion } from "motion-v";
import { basename } from "@tauri-apps/api/path";
import CassettePlayer from "@/components/retro/cassette/Cassette.vue";
import StemControl from "@/components/retro/stems/StemMixer.vue";
import ThemeKnob from "@/components/retro/theme-knob/ThemeKnob.vue";
import AppLogo from "@/components/retro/logo/AppLogo.vue";
import FileUpload from "@/components/retro/upload/FileUpload.vue";
import ProcessingIndicator from "@/components/retro/processing/ProcessingIndicator.vue";
import ProcessingActions from "@/components/retro/actions/ProcessingActions.vue";
import SynthwaveBg from "@/components/retro/background/Background.vue";
import WindowDragDrop from "@/components/retro/drag-drop/WindowDragDrop.vue";
import RecentFilesStrip from "@/components/retro/recent-files/RecentFilesStrip.vue";
import { useRetroCassetteTheme } from "@/composables/useRetroCassetteTheme";
import { useAudioProcessing } from "@/composables/useAudioProcessing";
import { useRecentFiles } from "@/composables/useRecentFiles";
import { useRecentFileLoader } from "@/composables/useRecentFileLoader";
import { useAudioCoreStore } from "@/stores/audio-core.store";

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

const audioStore = useAudioCoreStore();
const { loadFileFromPath } = audioStore;
const { audioPath } = storeToRefs(audioStore);
const { recentFiles, addRecentFile } = useRecentFiles();
const { loadRecentFile } = useRecentFileLoader();

async function handleDroppedFile(path: string) {
  try {
    await loadFileFromPath(path);

    try {
      const filename = await basename(path);
      handleFileLoaded(filename);
    } catch {
      const filename = path.split(/[\\/]/).pop() ?? path;
      handleFileLoaded(filename);
    }
  } catch (error) {
    console.error('Failed to load file:', error);
  }
}

async function handleRecentFileSelected(path: string) {
  const success = await loadRecentFile(path);
  if (success) {
    await nextTick();
    renderKey.value++;
    try {
      const filename = await basename(path);
      handleFileLoaded(filename);
    } catch {
      const filename = path.split(/[\\/]/).pop() ?? path;
      handleFileLoaded(filename);
    }
  }
}

watch(() => status.value, async (newStatus) => {
  if (newStatus === "processing" || newStatus === "finished") {
    renderKey.value++;
  }

  if (newStatus === "finished" && audioPath.value) {
    const currentPath = audioPath.value;
    try {
      const filename = await basename(currentPath);
      addRecentFile(currentPath, filename);
    } catch {
      const filename = currentPath.split(/[\\/]/).pop() ?? currentPath;
      addRecentFile(currentPath, filename);
    }
  }
});

onMounted(async () => {
  await initialize();
});
</script>


