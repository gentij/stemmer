<template>
  <div
    class="fixed bottom-0 left-0 right-0 z-30 px-6 py-4 pointer-events-none"
  >
    <div
      class="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity pointer-events-auto backdrop-blur-md bg-black/30 rounded-lg px-3 py-2 border border-white/10"
    >
      <img
        src="/stemmer_logo.svg"
        alt="Stemmer Logo"
        class="w-5 h-5 flex-shrink-0"
      />
      <p
        class="text-xs font-mono"
        :style="{ color: theme.borderColor }"
      >
        Stemmer by gentij
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CassetteTheme } from "@/types/retro/cassete.interface";

interface Props {
  theme: CassetteTheme;
}

defineProps<Props>();
</script>

