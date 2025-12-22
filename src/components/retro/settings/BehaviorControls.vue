<script setup lang="ts">
import type { CassetteTheme } from "@/types/retro/cassete.interface";

interface Props {
  theme: CassetteTheme;
  animationsEnabled: boolean;
  soundEnabled: boolean;
}

defineProps<Props>();

defineEmits<{
  (e: "animationsToggle", enabled: boolean): void;
  (e: "soundToggle", enabled: boolean): void;
}>();
</script>

<template>
  <div
    class="rounded-xl border-2 p-6"
    :style="{
      borderColor: theme.windowStroke,
      backgroundColor: theme.windowBg,
    }"
  >
    <div 
      class="text-sm font-mono uppercase tracking-wider mb-6"
      :style="{ color: theme.tapeAccent }"
    >
      BEHAVIOR CONTROLS
    </div>
    
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <div 
            class="font-mono text-sm font-medium mb-1"
            :style="{ color: theme.tapeAccent }"
          >
            ANIMATIONS
          </div>
          <div 
            class="text-xs font-mono opacity-60"
            :style="{ color: theme.borderColor }"
          >
            Enable popup effects
          </div>
        </div>
        <button
          @click="$emit('animationsToggle', !animationsEnabled)"
          class="relative w-14 h-7 rounded-full border-2 transition-all focus:outline-none"
          :style="{
            borderColor: animationsEnabled ? theme.borderColor : theme.controlBorder,
            backgroundColor: animationsEnabled ? theme.borderColor : theme.controlBg,
          }"
        >
          <div
            class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full border transition-all"
            :style="{
              transform: animationsEnabled ? 'translateX(28px)' : 'translateX(0)',
              borderColor: theme.windowBg,
              backgroundColor: animationsEnabled ? theme.tapeAccent : theme.windowBg,
            }"
          ></div>
        </button>
      </div>

      <div class="flex items-center justify-between">
        <div>
          <div 
            class="font-mono text-sm font-medium mb-1"
            :style="{ color: theme.tapeAccent }"
          >
            SOUND EFFECTS
          </div>
          <div 
            class="text-xs font-mono opacity-60"
            :style="{ color: theme.borderColor }"
          >
            Cassette insert sounds
          </div>
        </div>
        <button
          @click="$emit('soundToggle', !soundEnabled)"
          class="relative w-14 h-7 rounded-full border-2 transition-all focus:outline-none"
          :style="{
            borderColor: soundEnabled ? theme.borderColor : theme.controlBorder,
            backgroundColor: soundEnabled ? theme.borderColor : theme.controlBg,
          }"
        >
          <div
            class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full border transition-all"
            :style="{
              transform: soundEnabled ? 'translateX(28px)' : 'translateX(0)',
              borderColor: theme.windowBg,
              backgroundColor: soundEnabled ? theme.tapeAccent : theme.windowBg,
            }"
          ></div>
        </button>
      </div>
    </div>
  </div>
</template>

