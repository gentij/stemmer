<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import WaveSurfer from "wavesurfer.js";
import { useStemStore } from "@/stores/stem";

const store = useStemStore();
const waveformContainer = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (!waveformContainer.value) return;

  const wavesurfer = WaveSurfer.create({
    container: waveformContainer.value,
    waveColor: "#4f46e5",
    progressColor: "#8b5cf6",
    cursorColor: "#ec4899",
    barWidth: 2,
    barGap: 1,
    height: 100,
    normalize: true,
    fillParent: true,
  });

  // Hand WS to the store; the store will:
  // - attach events
  // - load whatever is currently selected (path or File) via its internal logic
  store.setWavesurfer(wavesurfer);

  // Optional: click-to-seek on the waveform container
  const onClick = (e: MouseEvent) => {
    if (!store.wavesurfer || store.duration <= 0) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const pct = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    store.seek(pct * store.duration);
  };
  waveformContainer.value.addEventListener("click", onClick);

  // Cleanup
  onUnmounted(() => {
    waveformContainer.value?.removeEventListener("click", onClick);
    // If you want to preserve audio state when navigating away,
    // remove the next line. Otherwise this mirrors your previous behavior.
    store.reset();
  });
});
</script>

<template>
  <div class="w-full">
    <div class="relative">
      <div
        ref="waveformContainer"
        class="w-full bg-background border border-border rounded-lg overflow-hidden min-h-[100px]"
        :class="{ 'opacity-50': store.isLoading }"
      />

      <div
        v-if="store.isLoading"
        class="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg"
      >
        <div class="flex items-center space-x-2">
          <div
            class="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"
          ></div>
          <span class="text-sm text-muted-foreground">Loading audio...</span>
        </div>
      </div>

      <div
        v-if="!store.isReady && !store.isLoading"
        class="absolute inset-0 flex items-center justify-center bg-muted/20 rounded-lg"
      >
        <span class="text-muted-foreground text-sm">No audio loaded</span>
      </div>
    </div>

    <div
      v-if="store.isReady"
      class="mt-3 flex justify-between items-center text-sm text-muted-foreground"
    >
      <span>{{ store.formattedCurrentTime }}</span>
      <div class="flex-1 mx-4">
        <div class="w-full bg-muted rounded-full h-1">
          <div
            class="bg-primary h-1 rounded-full transition-all duration-100"
            :style="{ width: `${store.progress}%` }"
          />
        </div>
      </div>
      <span>{{ store.formattedDuration }}</span>
    </div>
  </div>
</template>
