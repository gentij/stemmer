<template>
  <div class="w-full max-w-3xl">
    <div
      class="border-2 rounded-3xl p-6 md:p-8 shadow-[-4px_8px_16px_0_rgba(255,255,255,0.16)] relative overflow-hidden"
      :style="{ 
        borderColor: theme.borderColor,
        backgroundColor: theme.housingColor,
      }"
    >
      <div class="absolute inset-0 flex flex-col justify-between opacity-30">
        <div
          v-for="i in 12"
          :key="i"
          class="w-full h-[8%]"
          :style="{ backgroundColor: theme.lineColor }"
        ></div>
      </div>

      <div class="absolute top-2 left-2">
        <CassetteScrew :theme="theme" gradient-id="processing-screw-1" />
      </div>
      <div class="absolute top-2 right-2">
        <CassetteScrew :theme="theme" gradient-id="processing-screw-2" />
      </div>
      <div class="absolute bottom-2 left-2">
        <CassetteScrew :theme="theme" gradient-id="processing-screw-3" />
      </div>
      <div class="absolute bottom-2 right-2">
        <CassetteScrew :theme="theme" gradient-id="processing-screw-4" />
      </div>

      <div class="relative z-10 flex flex-col gap-6">
        <div
          class="rounded-xl border-2 p-4 md:p-6"
          :style="{
            borderColor: theme.windowStroke,
            backgroundColor: theme.windowBg,
          }"
        >
          <div class="flex items-center justify-between gap-4 mb-4">
            <div class="flex items-center gap-3">
              <div class="w-16 h-16 flex-shrink-0">
                <CassetteReel class="w-full h-full" :theme="theme" :is-playing="true" />
              </div>
              <div>
                <h3 class="text-white font-bold text-sm md:text-base uppercase tracking-wider">
                  {{ statusLabel }}
                </h3>
                <p
                  class="text-xs md:text-sm font-mono"
                  :style="{ color: theme.tapeAccent }"
                >
                  {{ displayMessage }}
                </p>
              </div>
            </div>
            <button
              v-if="showCancelButton"
              @click="$emit('cancel')"
              class="px-4 py-2 rounded-lg border-2 transition-all hover:scale-105 active:scale-95 text-sm font-mono font-medium"
              :style="{
                borderColor: theme.borderColor,
                backgroundColor: 'transparent',
                color: theme.borderColor,
              }"
            >
              Cancel
            </button>
          </div>

          <div class="space-y-2">
            <!-- Progress bar for downloading and writing (where we have actual progress) -->
            <template v-if="status === 'downloading' || status === 'writing'">
              <div class="flex items-center justify-between text-xs text-white/70 mb-1">
                <span class="font-mono">{{ progressLabel }}</span>
                <span class="font-mono font-bold" :style="{ color: theme.borderColor }">
                  {{ progressValue }}%
                </span>
              </div>
              <div
                class="h-3 md:h-4 rounded-full overflow-hidden border"
                :style="{
                  borderColor: theme.controlBorder,
                  backgroundColor: theme.controlBg,
                }"
              >
                <div
                  class="h-full transition-all duration-300 ease-out relative"
                  :style="{
                    width: `${progressValue}%`,
                    background: `linear-gradient(90deg, ${theme.borderColor} 0%, ${theme.tapeAccent} 100%)`,
                  }"
                >
                  <div
                    class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
                  ></div>
                </div>
              </div>
            </template>
            
            <template v-else-if="status === 'processing'">
              <div class="flex items-center justify-between text-xs text-white/70 mb-3">
                <span class="font-mono">{{ progressLabel }}</span>
              </div>
              <div class="flex items-center gap-2">
                <div
                  v-for="(step, index) in processingSteps"
                  :key="index"
                  class="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    class="w-3 h-3 rounded-full border-2 transition-all"
                    :style="{
                      borderColor: step.active ? theme.borderColor : `${theme.borderColor}40`,
                      backgroundColor: step.active ? theme.borderColor : `${theme.borderColor}15`,
                      boxShadow: step.active ? `0 0 8px ${theme.borderColor}60` : `0 0 2px ${theme.borderColor}20`,
                    }"
                  >
                    <div
                      v-if="step.active"
                      class="w-full h-full rounded-full animate-pulse"
                      :style="{ backgroundColor: theme.tapeAccent }"
                    ></div>
                  </div>
                  <span
                    class="text-xs font-mono text-center"
                    :style="{
                      color: step.active ? theme.tapeAccent : `${theme.borderColor}70`,
                      opacity: step.active ? 1 : 0.7,
                    }"
                  >
                    {{ step.label }}
                  </span>
                </div>
              </div>
            </template>
          </div>
        </div>

        <div
          v-if="showStageDisplay"
          class="rounded-xl border-2 p-4"
          :style="{
            borderColor: theme.infoBorder,
            backgroundColor: theme.infoBg,
          }"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-2 h-2 rounded-full animate-pulse"
              :style="{ backgroundColor: theme.borderColor }"
            ></div>
            <p class="text-white/90 text-xs md:text-sm font-mono">
              {{ humanFriendlyMessage }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { CassetteTheme } from "@/types/retro/cassete.interface";
import type { ProcessingStatus } from "@/stores/splitter-tool.store";
import CassetteReel from "@/components/retro/cassette/CassetteReel.vue";
import CassetteScrew from "@/components/retro/cassette/CassetteScrew.vue";

interface Props {
  theme: CassetteTheme;
  status: ProcessingStatus;
  message: string;
  progress?: number;
  currentStage?: string;
  currentStem?: string;
}

const props = withDefaults(defineProps<Props>(), {
  progress: 0,
  currentStage: "",
  currentStem: "",
});

const statusLabel = computed(() => {
  switch (props.status) {
    case "downloading":
      return "Downloading";
    case "processing":
      return "Processing";
    case "writing":
      return "Writing";
    default:
      return "Processing";
  }
});

const progressValue = computed(() => {
  return Math.max(0, Math.min(100, props.progress || 0));
});

const progressLabel = computed(() => {
  switch (props.status) {
    case "downloading":
      return "Model Download";
    case "processing":
      return "Audio Analysis";
    case "writing":
      return props.currentStem ? `Writing ${props.currentStem}` : "Writing Stems";
    default:
      return "Progress";
  }
});

const displayMessage = computed(() => {
  if (props.status === "writing" && props.currentStem) {
    return `Saving ${props.currentStem.toUpperCase()} stem...`;
  }
  return props.message || "Initializing...";
});

const showStageDisplay = computed(() => {
  return props.status === "processing" && props.currentStage;
});

const showCancelButton = computed(() => {
  return props.status === "downloading" || props.status === "processing" || props.status === "writing";
});

const processingSteps = computed(() => {
  const stage = props.currentStage?.toLowerCase() || "";
  
  const steps = [
    { label: "Load", active: stage.includes("load") || stage.includes("preprocess") || stage.includes("resolve") || (!stage && props.status === "processing") },
    { label: "Analyze", active: stage.includes("analyze") || stage.includes("read") || stage.includes("engine") },
    { label: "Separate", active: stage.includes("separate") || stage.includes("infer") || stage.includes("extract") },
    { label: "Prepare", active: stage.includes("prepare") || stage.includes("postprocess") || stage.includes("finalize") },
  ];
  
  if (!stage && props.status === "processing") {
    return steps.map((s, i) => ({ ...s, active: i === 0 }));
  }
  
  return steps;
});

const humanFriendlyMessage = computed(() => {
  if (!props.currentStage) {
    return "Initializing audio processing...";
  }
  
  const stage = props.currentStage.toLowerCase();
  
  const stageMessages: Record<string, string> = {
    "resolve_model": "Loading AI model into memory",
    "engine_preload": "Preparing audio processing engine",
    "read_audio": "Reading and analyzing audio file",
    "infer": "Separating audio into individual stems",
    "preprocess": "Preparing audio for analysis",
    "postprocess": "Finalizing separated stems",
  };
  
  if (stageMessages[stage]) {
    return stageMessages[stage];
  }
  
  if (stage.includes("resolve")) {
    return "Loading AI model";
  }
  if (stage.includes("engine") || stage.includes("preload")) {
    return "Initializing processing engine";
  }
  if (stage.includes("read")) {
    return "Reading audio file";
  }
  if (stage.includes("infer") || stage.includes("separate")) {
    return "Separating audio stems";
  }
  if (stage.includes("prepare") || stage.includes("postprocess")) {
    return "Preparing final output";
  }
  
  return stage
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
});

defineEmits<{
  (e: "cancel"): void;
}>();
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
</style>
