<template>
  <Motion
    as="button"
    @click="$emit('toggle')"
    class="relative rounded-full flex items-center justify-center"
    :style="{ 
      backgroundColor: muted ? 'rgba(255, 255, 255, 0.1)' : color,
      width: '44px',
      height: '44px'
    }"
    :aria-label="`${muted ? 'Unmute' : 'Mute'} ${name}`"
    :whileHover="{ scale: 1.1 }"
    :whileTap="{ scale: 0.95 }"
    :transition="{
      type: 'spring',
      stiffness: 400,
      damping: 25
    }"
  >
    <div class="relative w-6 h-6">
      <Motion
        class="absolute inset-0"
        :animate="{
          opacity: muted ? 0 : 1,
          scale: muted ? 0.7 : 1,
          rotate: muted ? -45 : 0
        }"
        :transition="{
          type: 'spring',
          stiffness: 300,
          damping: 20
        }"
      >
        <Volume2 
          :size="24"
          :color="muted ? 'white' : '#0D041D'"
        />
      </Motion>

      <Motion
        class="absolute inset-0"
        :animate="{
          opacity: muted ? 1 : 0,
          scale: muted ? 1 : 0.7,
          rotate: muted ? 0 : 45
        }"
        :transition="{
          type: 'spring',
          stiffness: 300,
          damping: 20
        }"
      >
        <VolumeX 
          :size="24"
          color="white"
        />
      </Motion>
    </div>
  </Motion>
</template>

<script setup lang="ts">
import { Motion } from "motion-v";
import { Volume2, VolumeX } from "lucide-vue-next";

defineProps<{ name: string; muted: boolean; color: string }>();

defineEmits<{ (e: "toggle"): void }>();
</script>
