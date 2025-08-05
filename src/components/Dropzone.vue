<script setup lang="ts">
import { ref } from "vue";
import { useStemStore } from "@/stores/stem";
import { Button } from "@/components/ui/button";
import { Upload, FileAudio, X } from "lucide-vue-next";

const store = useStemStore();
const isDragging = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

const handleDrop = async (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = false;

  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    const file = files[0];
    if (isAudioFile(file)) {
      store.loadFile(file);
    }
  }
};

const openFileDialog = () => {
  fileInputRef.value?.click();
};

const handleFileInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file && isAudioFile(file)) {
    store.loadFile(file);
  }
};

const isAudioFile = (file: File): boolean => {
  return (
    file.type.startsWith("audio/") ||
    /\.(mp3|wav|m4a|flac|ogg|aac)$/i.test(file.name)
  );
};

const clearFile = () => {
  store.reset();
};
</script>

<template>
  <div class="w-full">
    <div v-if="store.audioFile" class="space-y-4">
      <div
        class="flex items-center justify-between p-4 bg-card border border-border rounded-lg"
      >
        <div class="flex items-center space-x-3">
          <FileAudio class="h-5 w-5 text-primary" />
          <div>
            <p class="font-medium">{{ store.audioFile.name }}</p>
            <p class="text-sm text-muted-foreground">
              {{ (store.audioFile.size / (1024 * 1024)).toFixed(1) }} MB
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
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @drop="handleDrop"
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
            Drag and drop or click to browse
          </p>
          <p class="text-xs text-muted-foreground">
            Supports MP3, WAV, M4A, FLAC, OGG, AAC
          </p>
        </div>

        <Button variant="outline" class="mt-4" @click.stop="openFileDialog">
          <Upload class="h-4 w-4 mr-2" />
          Choose File
        </Button>

        <input
          ref="fileInputRef"
          type="file"
          accept="audio/*,.mp3,.wav,.m4a,.flac,.ogg,.aac"
          @change="handleFileInput"
          class="hidden"
        />
      </div>
    </div>
  </div>
</template>
