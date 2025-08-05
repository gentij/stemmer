<script setup lang="ts">
import { ref } from "vue";
import { useStemStore } from "@/stores/stem";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  RotateCcw,
} from "lucide-vue-next";

const store = useStemStore();
const showVolumeSlider = ref(false);

const handleVolumeChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  store.setVolume(parseFloat(target.value));
};

const toggleMute = () => {
  store.setVolume(store.volume > 0 ? 0 : 0.7);
};
</script>

<template>
  <div
    class="flex items-center gap-4 p-4 bg-card border border-border rounded-lg"
  >
    <!-- Skip Backward -->
    <Button
      variant="outline"
      size="sm"
      @click="store.skipBackward()"
      :disabled="!store.isReady"
      class="h-10 w-10"
    >
      <SkipBack class="h-4 w-4" />
    </Button>

    <!-- Play/Pause -->
    <Button
      @click="store.togglePlayPause()"
      :disabled="!store.isReady"
      class="h-12 w-12"
      :variant="store.isPlaying ? 'default' : 'default'"
    >
      <Play v-if="!store.isPlaying" class="h-5 w-5 ml-0.5" />
      <Pause v-else class="h-5 w-5" />
    </Button>

    <!-- Skip Forward -->
    <Button
      variant="outline"
      size="sm"
      @click="store.skipForward()"
      :disabled="!store.isReady"
      class="h-10 w-10"
    >
      <SkipForward class="h-4 w-4" />
    </Button>

    <!-- Reset -->
    <Button
      variant="outline"
      size="sm"
      @click="
        () => {
          store.seek(0);
          store.pause();
        }
      "
      :disabled="!store.isReady"
      class="h-10 w-10"
    >
      <RotateCcw class="h-4 w-4" />
    </Button>

    <!-- Spacer -->
    <div class="flex-1"></div>

    <!-- Volume Control -->
    <div class="flex items-center gap-2">
      <Button variant="ghost" size="sm" @click="toggleMute" class="h-10 w-10">
        <Volume2 v-if="store.volume > 0" class="h-4 w-4" />
        <VolumeX v-else class="h-4 w-4" />
      </Button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        :value="store.volume"
        @input="handleVolumeChange"
        class="w-20 h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
      />
    </div>

    <!-- Time Display -->
    <div
      v-if="store.isReady"
      class="text-sm text-muted-foreground min-w-[100px] text-right"
    >
      {{ store.formattedCurrentTime }} / {{ store.formattedDuration }}
    </div>
  </div>
</template>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: hsl(var(--primary));
  cursor: pointer;
}

.slider::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: hsl(var(--primary));
  cursor: pointer;
  border: none;
}
</style>
