<template>
  <button
    @click="navigateToSettings"
    class="fixed top-8 right-8 z-50 p-3 rounded-full backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] border border-white/10"
    :class="isSettings ? 'bg-white/10 hover:bg-white/20' : 'bg-black/20 hover:bg-black/30'"
    :aria-label="isSettings ? 'Back to cassette' : 'Open settings'"
  >
    <component
      :is="isSettings ? XIcon : SettingsIcon"
      class="w-6 h-6"
      :class="isSettings ? 'text-white' : 'text-white/90'"
    />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Settings as SettingsIcon, X as XIcon } from "lucide-vue-next";

const router = useRouter();
const route = useRoute();

const isSettings = computed(() => route.name === "settings");

function navigateToSettings() {
  if (isSettings.value) {
    router.back();
  } else {
    router.push({ name: "settings" });
  }
}
</script>

