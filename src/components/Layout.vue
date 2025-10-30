<script setup lang="ts">
import { ref } from "vue";
import SettingsView from "@/views/SettingsView.vue";

const activeView = ref("settings");
</script>

<template>
  <div class="h-screen flex bg-background">
    <div class="flex-1 flex flex-col min-w-0">
      <!-- <SplitterView 
        v-if="activeView === 'splitter'" 
        @navigateToSettings="handleViewChange('settings')"
      /> -->


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
