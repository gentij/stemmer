<template>
  <div
    class="flex px-4 py-0.5 items-center border-4 bg-white shadow-[2px_4px_8px_0_rgba(0,0,0,0.32)]"
    :style="{ borderColor: theme.borderColor }"
  >
    <h1
      class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-tropical whitespace-nowrap"
      :style="{ color: theme.textDark }"
    >
      STEMMER
    </h1>
  </div>
</template>

<script setup lang="ts">
import type { CassetteTheme } from "@/types/retro/cassete.interface";

defineProps<{ theme: CassetteTheme }>();
</script>
