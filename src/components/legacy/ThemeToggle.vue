<script setup lang="ts">
import { useThemeStore } from "@/stores/theme";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-vue-next";

const themeStore = useThemeStore();

const handleToggle = () => {
  themeStore.toggleTheme();
};
</script>

<template>
  <Button
    variant="ghost"
    size="sm"
    @click="handleToggle"
    class="h-9 w-9 transition-all duration-200"
    :title="`Switch to ${
      themeStore.currentTheme === 'light' ? 'dark' : 'light'
    } mode`"
  >
    <Transition name="theme-fade" mode="out-in">
      <Sun
        v-if="themeStore.currentTheme === 'dark'"
        key="sun"
        class="h-4 w-4 text-yellow-500"
      />
      <Moon
        v-else
        key="moon"
        class="h-4 w-4 text-slate-600 dark:text-slate-300"
      />
    </Transition>
  </Button>
</template>

<style scoped>
.theme-fade-enter-active,
.theme-fade-leave-active {
  transition: all 0.2s ease;
}

.theme-fade-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.8);
}

.theme-fade-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.8);
}
</style>
