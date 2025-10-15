<script setup lang="ts">
import { ref } from "vue";
import { useAudioCoreStore } from "@/stores/audio-core.store";
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

const {
  setVolume,
  volume,
  skipBackward,
  isReady,
  togglePlayPause,
  isPlaying,
  skipForward,
  seek,
  pause,
  formattedCurrentTime,
  formattedDuration,
} = useAudioCoreStore();
const showVolumeSlider = ref(false);

const handleVolumeChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  setVolume(parseFloat(target.value));
};

const toggleMute = () => {
  setVolume(volume > 0 ? 0 : 0.7);
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
      @click="skipBackward()"
      :disabled="!isReady"
      class="h-10 w-10"
    >
      <SkipBack class="h-4 w-4" />
    </Button>

    <!-- Play/Pause -->
    <Button
      @click="togglePlayPause()"
      :disabled="!isReady"
      class="h-12 w-12"
      :variant="isPlaying ? 'default' : 'default'"
    >
      <Play v-if="!isPlaying" class="h-5 w-5 ml-0.5" />
      <Pause v-else class="h-5 w-5" />
    </Button>

    <!-- Skip Forward -->
    <Button
      variant="outline"
      size="sm"
      @click="skipForward()"
      :disabled="!isReady"
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
          seek(0);
          pause();
        }
      "
      :disabled="!isReady"
      class="h-10 w-10"
    >
      <RotateCcw class="h-4 w-4" />
    </Button>

    <!-- Spacer -->
    <div class="flex-1"></div>

    <!-- Volume Control -->
    <div class="flex items-center gap-2">
      <Button variant="ghost" size="sm" @click="toggleMute" class="h-10 w-10">
        <Volume2 v-if="volume > 0" class="h-4 w-4" />
        <VolumeX v-else class="h-4 w-4" />
      </Button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        :value="volume"
        @input="handleVolumeChange"
        class="w-20 h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
      />
    </div>

    <!-- Time Display -->
    <div
      v-if="isReady"
      class="text-sm text-muted-foreground min-w-[100px] text-right"
    >
      {{ formattedCurrentTime }} / {{ formattedDuration }}
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
