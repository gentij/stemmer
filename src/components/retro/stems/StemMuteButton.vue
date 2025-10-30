<template>
  <button
    @click="$emit('toggle')"
    class="p-2 rounded-full transition-all hover:scale-110"
    :style="{ backgroundColor: muted ? 'rgba(255, 255, 255, 0.1)' : color }"
    :aria-label="`${muted ? 'Unmute' : 'Mute'} ${name}`"
  >
    <svg
      v-if="!muted"
      class="w-5 h-5 md:w-6 md:h-6"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 9V15H7L12 20V4L7 9H3ZM16.5 12C16.5 10.23 15.48 8.71 14 7.97V16.02C15.48 15.29 16.5 13.77 16.5 12ZM14 3.23V5.29C16.89 6.15 19 8.83 19 12C19 15.17 16.89 17.85 14 18.71V20.77C18.01 19.86 21 16.28 21 12C21 7.72 18.01 4.14 14 3.23Z"
        fill="#0D041D"
      />
    </svg>
    <svg
      v-else
      class="w-5 h-5 md:w-6 md:h-6"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.5 12C16.5 10.23 15.48 8.71 14 7.97V10.18L16.45 12.63C16.48 12.43 16.5 12.22 16.5 12ZM19 12C19 12.94 18.8 13.82 18.46 14.64L19.97 16.15C20.63 14.91 21 13.5 21 12C21 7.72 18.01 4.14 14 3.23V5.29C16.89 6.15 19 8.83 19 12ZM4.27 3L3 4.27L7.73 9H3V15H7L12 20V13.27L16.25 17.52C15.58 18.04 14.83 18.45 14 18.7V20.76C15.38 20.45 16.63 19.81 17.69 18.95L19.73 21L21 19.73L12 10.73L4.27 3ZM12 4L9.91 6.09L12 8.18V4Z"
        fill="white"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
defineProps<{ name: string; muted: boolean; color: string }>();

defineEmits<{ (e: "toggle"): void }>();
</script>
