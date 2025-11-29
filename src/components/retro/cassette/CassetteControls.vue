<template>
  <div class="flex-1 flex items-center justify-center gap-3 md:gap-4">
    <div class="relative group">
      <button
        @click="$emit('back')"
        class="w-7 h-7 md:w-9 md:h-9 opacity-20 hover:opacity-100 transition-opacity"
        aria-label="Skip backward"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0)">
            <path d="M18 18L9.5 12L18 6V18ZM8 6V18H6V6H8Z" fill="white" />
          </g>
          <defs>
            <clipPath id="clip0">
              <rect
                width="24"
                height="24"
                fill="white"
                transform="matrix(-1 0 0 1 24 0)"
              />
            </clipPath>
          </defs>
        </svg>
      </button>
      <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 backdrop-blur-sm border border-white/20 rounded text-xs font-mono text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        Skip Backward
        <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-black/90"></div>
      </div>
    </div>

    <div class="relative group">
      <button
        @click="$emit('toggle')"
        class="w-8 h-8 md:w-10 md:h-10 hover:scale-110 transition-transform"
        :aria-label="isPlaying ? 'Pause' : 'Play'"
      >
        <svg
          v-if="!isPlaying"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 6.82V17.18C8 17.97 8.87 18.45 9.54 18.02L17.68 12.84C18.3 12.45 18.3 11.55 17.68 11.15L9.54 5.98C8.87 5.55 8 6.03 8 6.82Z"
            fill="white"
          />
        </svg>
        <svg
          v-else
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 4H10V20H6V4ZM14 4H18V20H14V4Z" fill="white" />
        </svg>
      </button>
      <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 backdrop-blur-sm border border-white/20 rounded text-xs font-mono text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        {{ isPlaying ? 'Pause' : 'Play' }}
        <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-black/90"></div>
      </div>
    </div>

    <div class="relative group">
      <button
        @click="$emit('forward')"
        class="w-7 h-7 md:w-9 md:h-9 opacity-20 hover:opacity-100 transition-opacity"
        aria-label="Skip forward"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip1)">
            <path d="M6 18L14.5 12L6 6V18ZM16 6V18H18V6H16Z" fill="white" />
          </g>
          <defs>
            <clipPath id="clip1">
              <rect width="24" height="24" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </button>
      <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 backdrop-blur-sm border border-white/20 rounded text-xs font-mono text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        Skip Forward
        <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-black/90"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ isPlaying?: boolean }>(), { isPlaying: false });

defineEmits<{ (e: "back"): void; (e: "toggle"): void; (e: "forward"): void }>();
</script>
