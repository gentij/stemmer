<template>
  <div class="w-full space-y-4">
    <StemItem
      v-for="(stem, index) in stems"
      :key="stem.id"
      :stem="stem"
      :theme="props.theme"
      :stem-index="index"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
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
const { stems: stemsState } = storeToRefs(stemsAudioStore);

const stems = computed(() => [
  { ...stemsState.value.vocals, volume: stemsState.value.vocals.volume * 100, color: "" },
  { ...stemsState.value.drums, volume: stemsState.value.drums.volume * 100, color: "" },
  { ...stemsState.value.bass, volume: stemsState.value.bass.volume * 100, color: "" },
  { ...stemsState.value.other, volume: stemsState.value.other.volume * 100, color: "" },
]);
</script>
