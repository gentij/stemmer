<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useAudioCoreStore } from "@/stores/audio-core.store";
import { Button } from "@/components/ui/button";
import { Upload, FileAudio, X } from "lucide-vue-next";

// Tauri v2 APIs
import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { listen, TauriEvent } from "@tauri-apps/api/event";
import { basename } from "@tauri-apps/api/path";

const { loadFileFromPath, reset, audioPath } = useAudioCoreStore();

const isDragging = ref(false);
const displayName = ref<string | null>(null);

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
    displayName.value = await basename(path);
  } catch {
    displayName.value = path.split(/[\\/]/).pop() ?? path;
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

function clearFile() {
  reset();
  displayName.value = null;
}

onMounted(async () => {
  // Drag in/out visual feedback
  unlistenEnter = await listen(TauriEvent.DRAG_ENTER, () => {
    isDragging.value = true;
  });

  unlistenLeave = await listen(TauriEvent.DRAG_LEAVE, () => {
    isDragging.value = false;
  });

  // Actual drop: gives absolute filesystem paths
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

<template>
  <div class="w-full">
    <div v-if="audioPath" class="space-y-4">
      <div
        class="flex items-center justify-between p-4 bg-card border border-border rounded-lg"
      >
        <div class="flex items-center space-x-3">
          <FileAudio class="h-5 w-5 text-primary" />
          <div>
            <p class="font-medium">
              {{ displayName || audioPath }}
            </p>
            <p class="text-xs text-muted-foreground break-all">
              {{ audioPath }}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" @click="clearFile">
          <X class="h-4 w-4" />
        </Button>
      </div>
    </div>

    <div v-else>
      <div
        class="relative w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:border-primary/50 hover:bg-muted/20"
        :class="{
          'border-primary bg-primary/10': isDragging,
          'border-border': !isDragging,
        }"
        @click="openFileDialog"
      >
        <Upload
          class="h-12 w-12 text-muted-foreground mb-4"
          :class="{ 'text-primary': isDragging }"
        />

        <div class="text-center">
          <p class="text-lg font-medium mb-2">
            {{ isDragging ? "Drop your audio file here" : "Upload audio file" }}
          </p>
          <p class="text-sm text-muted-foreground mb-4">
            Drag & drop anywhere in the window, or click to browse
          </p>
          <p class="text-xs text-muted-foreground">
            Supports MP3, WAV, M4A, FLAC, OGG, AAC
          </p>
        </div>

        <Button variant="outline" class="mt-4" @click.stop="openFileDialog">
          <Upload class="h-4 w-4 mr-2" />
          Choose File
        </Button>
      </div>
    </div>
  </div>
</template>
