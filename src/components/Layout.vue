<script setup lang="ts">
import { ref } from "vue";

import { THEMES } from "@/constants/themes";

import SettingsView from "@/views/SettingsView.vue";

const activeView = ref("retro_cassette");

const ActiveViewComponent = THEMES.find(
  (theme) => theme.id === activeView.value
)?.view;
</script>

<template>
  <div class="h-screen flex bg-background">
    <div class="flex-1 flex flex-col min-w-0">
      <ActiveViewComponent />

      <SettingsView v-if="activeView === 'settings'" />
    </div>
  </div>
</template>

<style scoped>
.h-screen {
  height: 100vh;
  height: 100dvh;
}
</style>
