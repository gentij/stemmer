<template>
  <div
    v-if="isDragging"
    class="fixed inset-0 z-40 pointer-events-none"
  >
    <div
      class="absolute top-0 left-0 right-0 h-1"
      :style="{ backgroundColor: theme.borderColor, boxShadow: `0 0 20px ${theme.borderColor}` }"
    ></div>
    <div
      class="absolute bottom-0 left-0 right-0 h-1"
      :style="{ backgroundColor: theme.borderColor, boxShadow: `0 0 20px ${theme.borderColor}` }"
    ></div>
    <div
      class="absolute top-0 bottom-0 left-0 w-1"
      :style="{ backgroundColor: theme.borderColor, boxShadow: `0 0 20px ${theme.borderColor}` }"
    ></div>
    <div
      class="absolute top-0 bottom-0 right-0 w-1"
      :style="{ backgroundColor: theme.borderColor, boxShadow: `0 0 20px ${theme.borderColor}` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { listen, TauriEvent } from "@tauri-apps/api/event";
import type { CassetteTheme } from "@/types/retro/cassete.interface";

interface Props {
  theme: CassetteTheme;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: "fileDropped", path: string): void;
}>();

const isDragging = ref(false);

const AUDIO_EXT = /\.(mp3|wav|m4a|flac|ogg|aac)$/i;

function isAudioPath(path: string) {
  return AUDIO_EXT.test(path);
}

let unlistenEnter: (() => void) | null = null;
let unlistenLeave: (() => void) | null = null;
let unlistenDrop: (() => void) | null = null;

onMounted(async () => {
  unlistenEnter = await listen(TauriEvent.DRAG_ENTER, () => {
    isDragging.value = true;
  });

  unlistenLeave = await listen(TauriEvent.DRAG_LEAVE, () => {
    isDragging.value = false;
  });

  unlistenDrop = await listen(TauriEvent.DRAG_DROP, async (event: any) => {
    isDragging.value = false;
    const payload = event.payload;
    let paths: string[] = [];
    
    if (Array.isArray(payload)) {
      paths = payload;
    } else if (payload && typeof payload === 'object') {
      if ('paths' in payload && Array.isArray(payload.paths)) {
        paths = payload.paths;
      } else if ('path' in payload && typeof payload.path === 'string') {
        paths = [payload.path];
      }
    } else if (typeof payload === 'string') {
      paths = [payload];
    }
    
    if (paths.length > 0 && paths[0] && isAudioPath(paths[0])) {
      emit("fileDropped", paths[0]);
    }
  });
});

onBeforeUnmount(() => {
  unlistenEnter?.();
  unlistenLeave?.();
  unlistenDrop?.();
});
</script>

