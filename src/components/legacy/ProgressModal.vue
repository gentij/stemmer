<script setup lang="ts">
import { computed } from "vue";
import { useSplitterToolStore } from "@/stores/splitter-tool.store";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Cpu, 
  FileEdit, 
  CheckCircle2, 
  XCircle,
  FolderOpen,
  Check,
  Database,
  Settings,
  FileAudio,
  Scissors
} from "lucide-vue-next";
import { openPath } from "@tauri-apps/plugin-opener";
import { storeToRefs } from "pinia";

const splitterStore = useSplitterToolStore();
const { 
  status, 
  downloadProgress, 
  currentStage, 
  currentStem, 
  writingPercent,
  errorMessage,
  outputPath,
  isProcessing,
  hasError,
  isFinished
} = storeToRefs(splitterStore);

const { resetProgress } = splitterStore;

const statusConfig = computed(() => {
  switch (status.value) {
    case "downloading":
      return {
        icon: Download,
        title: "Downloading Model",
        description: "Downloading AI model for stem separation...",
        color: "text-blue-500",
        showProgress: true,
        progress: downloadProgress.value,
      };
    case "processing":
      return {
        icon: Cpu,
        title: "Processing Audio",
        description: currentStage.value 
          ? getFriendlyStageMessage(currentStage.value)
          : "Analyzing and separating stems...",
        color: "text-purple-500",
        showProgress: false,
        progress: 0,
      };
    case "writing":
      return {
        icon: FileEdit,
        title: "Writing Stems",
        description: currentStem.value ? `Writing ${currentStem.value}...` : "Saving separated stems...",
        color: "text-orange-500",
        showProgress: true,
        progress: writingPercent.value,
      };
    case "finished":
      return {
        icon: CheckCircle2,
        title: "Success!",
        description: outputFolderName.value 
          ? `Your stems have been saved to: ${outputFolderName.value}`
          : "Your audio has been successfully separated into stems.",
        color: "text-green-500",
        showProgress: false,
        progress: 100,
      };
    case "error":
      return {
        icon: XCircle,
        title: "Error",
        description: errorMessage.value || "An error occurred during processing.",
        color: "text-red-500",
        showProgress: false,
        progress: 0,
      };
    default:
      return null;
  }
});

const outputFolderName = computed(() => {
  if (!outputPath.value) return '';
  const parts = outputPath.value.split(/[\\/]/);
  return parts[parts.length - 1] || '';
});

const processingSteps = [
  { 
    id: 'resolve_model', 
    label: 'Load Model',
    description: 'Loading AI model',
    icon: Database 
  },
  { 
    id: 'engine_preload', 
    label: 'Initialize Engine',
    description: 'Preparing processor',
    icon: Settings 
  },
  { 
    id: 'read_audio', 
    label: 'Read Audio',
    description: 'Analyzing audio',
    icon: FileAudio 
  },
  { 
    id: 'infer', 
    label: 'Separate Stems',
    description: 'Splitting audio',
    icon: Scissors 
  },
];

const currentStepIndex = computed(() => {
  if (!currentStage.value) return -1;
  return processingSteps.findIndex(step => step.id === currentStage.value.toLowerCase());
});

const lineProgress = computed(() => {
  if (currentStepIndex.value < 0) return 0;
  
  if (currentStepIndex.value >= processingSteps.length - 1) {
    return ((processingSteps.length - 2) / (processingSteps.length - 1)) * 100;
  }
  
  return (currentStepIndex.value / (processingSteps.length - 1)) * 100;
});

const getFriendlyStageMessage = (stage: string): string => {
  const stageMap: Record<string, string> = {
    'resolve_model': 'Loading AI separation model...',
    'engine_preload': 'Initializing audio processing engine...',
    'read_audio': 'Reading and analyzing audio file...',
    'infer': 'Separating audio into individual stems...',
  };
  
  return stageMap[stage.toLowerCase()] || stage;
};

const handleClose = () => {
  resetProgress();
};

const handleOpenFolder = async () => {
  if (outputPath.value) {
    try {
      console.log("🔍 Opening folder:", outputPath.value);
      await openPath(outputPath.value);
    } catch (error) {
      console.error("❌ Failed to open output folder:", error);
      alert(`Failed to open folder: ${error}`);
    }
  } else {
    console.error("❌ No output path available");
    alert("Output path is not available");
  }
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};
</script>

<template>
  <div v-if="status !== 'idle'" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-card border border-border rounded-lg shadow-2xl max-w-2xl w-full p-6 space-y-6">
      <div v-if="statusConfig" class="text-center space-y-4">
        <div class="flex justify-center">
          <div 
            class="p-4 rounded-full"
            :class="[
              isProcessing ? 'bg-primary/10' : hasError ? 'bg-red-500/10' : 'bg-green-500/10'
            ]"
          >
            <component 
              :is="statusConfig.icon" 
              :class="[
                'h-12 w-12',
                statusConfig.color              
              ]"
            />
          </div>
        </div>

        <div>
          <h2 class="text-2xl font-bold mb-2">{{ statusConfig.title }}</h2>
          <p class="text-muted-foreground">{{ statusConfig.description }}</p>
        </div>

        <div v-if="status === 'processing'" class="py-4">
          <div class="flex items-center justify-between relative">
            <div class="absolute top-5 left-0 right-0 h-0.5 bg-muted mx-8">
              <div 
                class="h-full bg-primary transition-all duration-500"
                :style="{ width: `${lineProgress}%` }"
              />
            </div>
            
            <div 
              v-for="(step, index) in processingSteps"
              :key="step.id"
              class="flex flex-col items-center flex-1 relative z-10"
            >
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300"
                :class="[
                  index < currentStepIndex ? 'bg-primary text-primary-foreground' : 
                  index === currentStepIndex ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 animate-pulse' : 
                  'bg-muted text-muted-foreground'
                ]"
              >
                <component 
                  v-if="index < currentStepIndex"
                  :is="Check" 
                  class="h-5 w-5" 
                />
                <component 
                  v-else
                  :is="step.icon" 
                  class="h-5 w-5" 
                />
              </div>
              <p 
                class="text-xs font-medium text-center transition-colors"
                :class="index <= currentStepIndex ? 'text-foreground' : 'text-muted-foreground'"
              >
                {{ step.label }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="statusConfig.showProgress" class="space-y-2">
          <div class="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div 
              class="h-full bg-primary transition-all duration-300 ease-out rounded-full"
              :style="{ width: `${statusConfig.progress}%` }"
            />
          </div>
          <p class="text-sm text-muted-foreground">
            {{ statusConfig.progress }}%
            <span v-if="status === 'downloading' && downloadProgress > 0">
              ({{ formatBytes(splitterStore.downloadedBytes) }} / {{ formatBytes(splitterStore.totalBytes) }})
            </span>
          </p>
        </div>

        <div class="flex gap-3 justify-center pt-4">
          <Button
            v-if="isFinished"
            @click="handleOpenFolder"
            variant="default"
            size="lg"
          >
            <FolderOpen class="h-4 w-4 mr-2" />
            Open Output Folder
          </Button>

          <Button
            v-if="isFinished || hasError"
            @click="handleClose"
            :variant="isFinished ? 'outline' : 'default'"
            size="lg"
          >
            {{ isFinished ? 'Done' : 'Close' }}
          </Button>
        </div>

        <div v-if="hasError && errorMessage" class="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-sm text-left">
          <p class="text-red-500 font-medium mb-1">Error Details:</p>
          <p class="text-muted-foreground">{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

