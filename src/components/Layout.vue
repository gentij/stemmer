<script setup lang="ts">
import { RouterView } from "vue-router";
import SettingsButton from "./SettingsButton.vue";
</script>

<template>
  <div class="h-screen flex bg-background">
    <div class="flex-1 flex flex-col min-w-0">
      <SettingsButton />
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.h-screen {
  height: 100vh;
  height: 100dvh;
}
</style>
