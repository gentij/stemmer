<template>
  <Motion
    :initial="{ opacity: 0, y: 20 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{
      type: 'spring',
      stiffness: 260,
      damping: 20,
      delay: stemIndex * 0.1
    }"
    class="flex flex-col gap-3 p-4 rounded-2xl border-2"
    :style="{
      borderColor: stemColor,
      backgroundColor: 'rgba(13, 13, 13, 0.8)',
    }"
  >
    <StemWaveform
      v-if="audioSrc"
      :key="audioSrc"
      :stem-id="stem.id"
      :stem-name="stem.name"
      :audio-src="audioSrc"
      :color="stemColor"
      :theme="props.theme"
      :height="70"
    />

    <div class="flex items-center gap-4">
      <StemSlider 
        :stem="stem" 
        :color="stemColor"
        @volume-change="handleVolumeChange"
        @volume-final="handleVolumeFinal"
      />
      <StemMuteButton
        :name="stem.name"
        :muted="stem.muted"
        :color="stemColor"
        @toggle="handleMuteToggle"
      />
    </div>
  </Motion>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Motion } from "motion-v";
import type { Stem } from "@/types/stems.interface";
import type { CassetteTheme } from "@/types/retro/cassete.interface";
import { defaultCassetteTheme } from "@/constants/retro/cassete";
import { useStemControls } from "@/composables/useStemControls";
import StemSlider from "./StemSlider.vue";
import StemMuteButton from "./StemMuteButton.vue";
import StemWaveform from "./StemWaveform.vue";

interface Props {
  stem: Stem;
  theme?: CassetteTheme;
  stemIndex?: number;
}

const props = withDefaults(defineProps<Props>(), {
  theme: () => defaultCassetteTheme,
  stemIndex: 0,
});

const { audioSrc, setVolumeDirectly, setVolume, toggleMute } = useStemControls({
  stemId: props.stem.id,
});

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
  setVolumeDirectly(volume / 100);
}

function handleVolumeFinal(volume: number) {
  setVolume(volume / 100);
}

function handleMuteToggle() {
  toggleMute();
}
</script>
