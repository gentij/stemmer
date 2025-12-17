<template>
  <div class="w-full space-y-4">
    <div class="flex items-center justify-center gap-3">
      <button
        @click="handleMuteAll"
        class="px-4 py-2 rounded-lg border-2 transition-all hover:scale-105 flex items-center gap-2 backdrop-blur-md shadow-xl"
        :style="{
          borderColor: `${theme.borderColor}`,
          backgroundColor: allMuted ? `${theme.borderColor}60` : 'rgba(0, 0, 0, 0.85)',
          boxShadow: `0 4px 12px rgba(0, 0, 0, 0.5), 0 0 8px ${theme.borderColor}40`,
        }"
      >
        <VolumeX
          v-if="allMuted"
          :size="18"
          :style="{ color: theme.borderColor }"
        />
        <Volume2
          v-else
          :size="18"
          :style="{ color: theme.borderColor }"
        />
        <span
          class="text-xs font-mono font-semibold"
          :style="{ color: theme.borderColor, textShadow: `0 1px 2px rgba(0, 0, 0, 0.8)` }"
        >
          {{ allMuted ? 'Unmute All' : 'Mute All' }}
        </span>
      </button>

      <button
        @click="handleToggleLock"
        class="px-4 py-2 rounded-lg border-2 transition-all hover:scale-105 flex items-center gap-2 backdrop-blur-md shadow-xl"
        :style="{
          borderColor: volumesLocked ? theme.tapeAccent : theme.borderColor,
          backgroundColor: volumesLocked ? `${theme.tapeAccent}70` : 'rgba(0, 0, 0, 0.85)',
          boxShadow: volumesLocked 
            ? `0 4px 12px rgba(0, 0, 0, 0.5), 0 0 12px ${theme.tapeAccent}60`
            : `0 4px 12px rgba(0, 0, 0, 0.5), 0 0 8px ${theme.borderColor}40`,
        }"
      >
        <Lock
          v-if="volumesLocked"
          :size="18"
          :style="{ 
            color: theme.tapeAccent,
            filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))'
          }"
        />
        <Unlock
          v-else
          :size="18"
          :style="{ 
            color: theme.borderColor,
            filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))'
          }"
        />
        <span
          class="text-xs font-mono font-semibold"
          :style="{ 
            color: volumesLocked ? theme.tapeAccent : theme.borderColor,
            textShadow: `0 1px 2px rgba(0, 0, 0, 0.8)`
          }"
        >
          {{ volumesLocked ? 'Locked' : 'Lock Volumes' }}
        </span>
      </button>
    </div>

    <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      <StemItem
        v-for="(stem, index) in stems"
        :key="stemKeys[index]"
        :stem="stem"
        :theme="props.theme"
        :stem-index="index"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { Volume2, VolumeX, Lock, Unlock } from "lucide-vue-next";
import type { CassetteTheme } from "@/types/retro/cassete.interface";
import { defaultCassetteTheme } from "@/constants/retro/cassete";
import { useStemsAudioStore } from "@/stores/stems-audio.store";
import StemItem from "./StemItem.vue";

interface Props {
  theme?: CassetteTheme;
}

const props = withDefaults(defineProps<Props>(), {
  theme: () => defaultCassetteTheme,
});

const stemsAudioStore = useStemsAudioStore();
const { stems: stemsState, volumesLocked } = storeToRefs(stemsAudioStore);

const stems = computed(() => [
  { ...stemsState.value.vocals, volume: stemsState.value.vocals.volume * 100, color: "" },
  { ...stemsState.value.drums, volume: stemsState.value.drums.volume * 100, color: "" },
  { ...stemsState.value.bass, volume: stemsState.value.bass.volume * 100, color: "" },
  { ...stemsState.value.other, volume: stemsState.value.other.volume * 100, color: "" },
]);

const stemKeys = computed(() => 
  stems.value.map(stem => `${stem.id}-${stemsState.value[stem.id as keyof typeof stemsState.value]?.audio?.src || 'no-audio'}`)
);

const allMuted = computed(() => {
  return Object.values(stemsState.value).every((stem) => stem.muted);
});

function handleMuteAll() {
  stemsAudioStore.toggleMuteAll();
}

function handleToggleLock() {
  stemsAudioStore.toggleVolumesLocked();
}
</script>
