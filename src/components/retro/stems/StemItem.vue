<template>
  <div
    class="flex items-center gap-4 p-4 rounded-2xl border-2 transition-all hover:shadow-lg"
    :style="{
      borderColor: stemColor,
      backgroundColor: 'rgba(13, 13, 13, 0.8)',
    }"
  >
    <StemSlider 
      :stem="stem" 
      :color="stemColor"
      @volume-change="handleVolumeChange"
    />
    <StemMuteButton
      :name="stem.name"
      :muted="stem.muted"
      :color="stemColor"
      @toggle="handleMuteToggle"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Stem } from "@/types/stems.interface";
import type { CassetteTheme } from "@/types/retro/cassete.interface";
import { defaultCassetteTheme } from "@/constants/retro/cassete";
import { useStemsAudioStore } from "@/stores/stems-audio.store";
import StemSlider from "./StemSlider.vue";
import StemMuteButton from "./StemMuteButton.vue";

interface Props {
  stem: Stem;
  theme?: CassetteTheme;
}

const props = withDefaults(defineProps<Props>(), {
  theme: () => defaultCassetteTheme,
});

const stemsAudioStore = useStemsAudioStore();

const stemColor = computed(() => {
  const colorMap: Record<string, keyof CassetteTheme> = {
    vocals: "borderColor",
    drums: "tapeColor",
    bass: "tapeAccent",
    other: "goldText",
  };
  const colorKey = colorMap[props.stem.id] || "borderColor";
  return props.theme[colorKey] as string;
});

function handleVolumeChange(volume: number) {
  stemsAudioStore.setStemVolume(props.stem.id, volume / 100);
}

function handleMuteToggle() {
  stemsAudioStore.setStemMuted(props.stem.id, !props.stem.muted);
}
</script>
