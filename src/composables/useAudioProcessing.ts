import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useAudioCoreStore } from "@/stores/audio-core.store";
import { useSplitterToolStore } from "@/stores/splitter-tool.store";
import { useSettingsStore } from "@/stores/settings.store";
import { useStemsAudioStore } from "@/stores/stems-audio.store";

export function useAudioProcessing() {
  const audioStore = useAudioCoreStore();
  const { audioPath } = storeToRefs(audioStore);

  const splitterStore = useSplitterToolStore();
  const { status, currentStage, downloadProgress, writingPercent, currentStem, outputPath } = storeToRefs(splitterStore);

  const settingsStore = useSettingsStore();
  const stemsAudioStore = useStemsAudioStore();

  const displayName = ref<string | null>(null);

  const currentTrack = computed(() => {
    if (displayName.value) return displayName.value;
    if (audioPath.value) return audioPath.value.split(/[\\/]/).pop() || "Unknown Track";
    return "No Track Loaded";
  });

  const showStems = computed(() => status.value === "finished");
  const showUpload = computed(() => status.value === "idle" || status.value === "error");
  const isProcessing = computed(() => splitterStore.isProcessing);

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

  const progress = computed(() => {
    switch (status.value) {
      case "downloading":
        return downloadProgress.value;
      case "processing":
        return 50; // Show halfway to indicate active processing
      case "writing":
        return writingPercent.value;
      default:
        return 0;
    }
  });

  watch(status, async (newStatus, oldStatus) => {
    if (newStatus === "finished" && oldStatus !== "finished") {
      await stemsAudioStore.loadStems();
    }
  });

  async function handleFileLoaded(filename: string) {
    displayName.value = filename;

    if (audioStore.audioPath && settingsStore.hasValidOutputDirectory && splitterStore.status === "idle") {
      await splitterStore.split();
    }
  }

  async function initialize() {
    await settingsStore.initialize();
  }

  return {
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
    initialize
  };
}

