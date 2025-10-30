<template>
  <div class="w-full max-w-md mx-auto space-y-4 px-4">
    <StemItem v-for="stem in stems" :key="stem.id" :stem="stem" />
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { defaultStems } from "@/constants/stems";
import StemItem from "./StemItem.vue";

const stems = reactive([...defaultStems]);
</script>
