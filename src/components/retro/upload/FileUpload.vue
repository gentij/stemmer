<template>
  <div class="w-full">
    <div
      class="border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer shadow-sm"
      :class="{
        'border-opacity-100 bg-black/20': isDragging,
        'hover:border-opacity-60': !isDragging,
      }"
      :style="{
        borderColor: theme.controlBorder + (isDragging ? '' : '40'),
      }"
      @click="openFileDialog"
    >
      <svg
        class="w-12 h-12 mx-auto mb-4 transition-opacity"
        :class="isDragging ? 'opacity-100' : 'opacity-50'"
        :style="{ color: theme.controlBorder }"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 16V10H5L12 3L19 10H15V16H9ZM5 20V18H19V20H5Z"
          :fill="theme.controlBorder"
        />
      </svg>
      <p class="text-white/70 text-sm md:text-base mb-2">
        {{
          isDragging
            ? "Drop your audio file here"
            : "Click to upload or drag & drop"
        }}
      </p>
      <p class="text-white/50 text-xs">
        {{
          isDragging
            ? "Release to upload"
            : "MP3, WAV, FLAC, OGG, AAC supported"
        }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useAudioCoreStore } from "@/stores/audio-core.store";
import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { listen, TauriEvent } from "@tauri-apps/api/event";
import { basename } from "@tauri-apps/api/path";
import type { CassetteTheme } from "@/types/retro/cassete.interface";

interface Props {
  theme: CassetteTheme;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: "fileLoaded", filename: string): void;
}>();

const audioStore = useAudioCoreStore();
const { loadFileFromPath } = audioStore;

const isDragging = ref(false);

let unlistenEnter: (() => void) | null = null;
let unlistenLeave: (() => void) | null = null;
let unlistenDrop: (() => void) | null = null;

const AUDIO_EXT = /\.(mp3|wav|m4a|flac|ogg|aac)$/i;

function isAudioPath(path: string) {
  return AUDIO_EXT.test(path);
}

async function handlePickedPath(path: string) {
  if (!isAudioPath(path)) return;

  await loadFileFromPath(path);

  try {
    const filename = await basename(path);
    emit("fileLoaded", filename);
  } catch {
    const filename = path.split(/[\\/]/).pop() ?? path;
    emit("fileLoaded", filename);
  }
}

async function openFileDialog() {
  const picked = await openDialog({
    title: "Select an audio file",
    multiple: false,
    filters: [
      {
        name: "Audio",
        extensions: ["mp3", "wav", "m4a", "flac", "ogg", "aac"],
      },
    ],
  });

  if (typeof picked === "string") {
    await handlePickedPath(picked);
  }
}

onMounted(async () => {
  unlistenEnter = await listen(TauriEvent.DRAG_ENTER, () => {
    isDragging.value = true;
  });

  unlistenLeave = await listen(TauriEvent.DRAG_LEAVE, () => {
    isDragging.value = false;
  });

  unlistenDrop = await listen<string[]>(TauriEvent.DRAG_DROP, async (event) => {
    isDragging.value = false;
    const paths = event.payload;
    if (Array.isArray(paths) && paths.length > 0) {
      await handlePickedPath(paths[0]);
    }
  });
});

onBeforeUnmount(() => {
  unlistenEnter?.();
  unlistenLeave?.();
  unlistenDrop?.();
});
</script>
