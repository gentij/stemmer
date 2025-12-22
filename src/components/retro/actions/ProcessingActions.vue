<template>
  <div class="w-full max-w-2xl">
    <div
      class="border-2 rounded-3xl p-6 md:p-8 shadow-[-4px_8px_16px_0_rgba(255,255,255,0.16)] relative overflow-hidden"
      :style="{ 
        borderColor: theme.borderColor,
        backgroundColor: theme.housingColor,
      }"
    >
      <div class="absolute inset-0 flex flex-col justify-between opacity-30">
        <div
          v-for="i in 8"
          :key="i"
          class="w-full h-[12%]"
          :style="{ backgroundColor: theme.lineColor }"
        ></div>
      </div>

      <div class="absolute top-2 left-2">
        <CassetteScrew :theme="theme" gradient-id="actions-screw-1" />
      </div>
      <div class="absolute top-2 right-2">
        <CassetteScrew :theme="theme" gradient-id="actions-screw-2" />
      </div>
      <div class="absolute bottom-2 left-2">
        <CassetteScrew :theme="theme" gradient-id="actions-screw-3" />
      </div>
      <div class="absolute bottom-2 right-2">
        <CassetteScrew :theme="theme" gradient-id="actions-screw-4" />
      </div>

      <div class="relative z-10 flex flex-col gap-4">
        <div
          class="rounded-xl border-2 p-4"
          :style="{
            borderColor: theme.infoBorder,
            backgroundColor: theme.infoBg,
          }"
        >
          <p class="text-white/90 text-xs md:text-sm font-mono text-center mb-4">
            Processing Complete
          </p>

          <div class="flex flex-col sm:flex-row gap-3">
            <button
              @click="handleOpenFolder"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all hover:scale-105 active:scale-95"
              :style="{
                borderColor: theme.controlBorder,
                backgroundColor: theme.controlBg,
                color: theme.tapeAccent,
              }"
              :class="{
                'opacity-50 cursor-not-allowed': !outputPath,
              }"
              :disabled="!outputPath"
            >
              <svg
                class="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9 22V12H15V22"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="font-mono text-sm font-medium">Open Folder</span>
            </button>

            <button
              @click="handleReset"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all hover:scale-105 active:scale-95"
              :style="{
                borderColor: theme.borderColor,
                backgroundColor: 'transparent',
                color: theme.borderColor,
              }"
            >
              <svg
                class="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 4V10H7"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M23 20V14H17"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M20.49 9C20.0173 7.6447 19.2361 6.41074 18.203 5.4038C17.1699 4.39686 15.9164 3.64539 14.5394 3.21493C13.1624 2.78447 11.6996 2.68634 10.2818 2.92831C8.86404 3.17028 7.52949 3.74573 6.38991 4.60491C5.25033 5.46409 4.33894 6.58426 3.73054 7.86408C3.12215 9.1439 2.83373 10.5468 2.89015 11.9574C2.94656 13.368 3.34591 14.7445 4.05129 15.9739C4.75668 17.2033 5.74881 18.2507 6.943 19.0307L7 19H13"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="font-mono text-sm font-medium">New Track</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { openPath } from "@tauri-apps/plugin-opener";
import { useSplitterToolStore } from "@/stores/splitter-tool.store";
import { useAudioCoreStore } from "@/stores/audio-core.store";
import { useStemsAudioStore } from "@/stores/stems-audio.store";
import { useToast } from "@/composables/useToast";
import type { CassetteTheme } from "@/types/retro/cassete.interface";
import CassetteScrew from "@/components/retro/cassette/CassetteScrew.vue";

interface Props {
  theme: CassetteTheme;
  outputPath?: string;
}

const props = defineProps<Props>();

const splitterStore = useSplitterToolStore();
const audioStore = useAudioCoreStore();
const stemsAudioStore = useStemsAudioStore();
const toast = useToast();

async function handleOpenFolder() {
  if (!props.outputPath) {
    toast.error("No output path available");
    return;
  }

  try {
    await openPath(props.outputPath);
  } catch (error) {
    toast.error("Failed to open output folder. Please navigate manually.");
  }
}

function handleReset() {
  splitterStore.resetProgress();
  audioStore.reset();
  stemsAudioStore.reset();
}
</script>

