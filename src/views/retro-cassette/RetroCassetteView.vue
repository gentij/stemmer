<template>
  <div
    class="flex flex-col gap-8 items-center justify-center min-h-screen bg-[#1a1028]"
  >
    <Cassette />

    <StemMixer />
  </div>
</template>

<script setup lang="ts">
import Cassette from "@/components/retro/cassette/Cassette.vue";
import StemMixer from "@/components/retro/stems/StemMixer.vue";
</script>
