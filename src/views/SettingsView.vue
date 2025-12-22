<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useSettingsStore } from "@/stores/settings.store";
import { storeToRefs } from "pinia";
import RetroCassetteSettings from "@/components/retro/settings/RetroCassetteSettings.vue";

const settingsStore = useSettingsStore();
const { themeRoute } = storeToRefs(settingsStore);
const { initialize } = settingsStore;

onMounted(async () => {
  await initialize();
});

// Map theme routes to their settings components
const settingsComponents = {
  "retro-cassette": RetroCassetteSettings
};

const currentSettingsComponent = computed(() => {
  return settingsComponents[themeRoute.value as keyof typeof settingsComponents] || RetroCassetteSettings;
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4 overflow-y-auto">
    <component :is="currentSettingsComponent" />
  </div>
</template>
