<template>
  <div class="w-full max-w-md space-y-4">
    <StemItem
      v-for="stem in stems"
      :key="stem.id"
      :stem="stem"
      :theme="props.theme"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { defaultStems } from "@/constants/stems";
import type { CassetteTheme } from "@/types/retro/cassete.interface";
import { defaultCassetteTheme } from "@/constants/retro/cassete";
import StemItem from "./StemItem.vue";

interface Props {
  theme?: CassetteTheme;
}

const props = withDefaults(defineProps<Props>(), {
  theme: () => defaultCassetteTheme,
});

const stems = reactive([...defaultStems]);
</script>
