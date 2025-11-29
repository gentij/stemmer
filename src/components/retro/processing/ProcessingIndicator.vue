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
              <div class="w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
                <CassetteReel :theme="theme" :is-playing="true" />
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
          </div>

          <div class="space-y-2">
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
              {{ formattedStage }}
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

const formattedStage = computed(() => {
  if (!props.currentStage) return "";
  
  const stage = props.currentStage
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
  
  return `> ${stage}`;
});
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
