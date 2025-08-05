<script setup lang="ts">
import { useStemStore } from "@/stores/stem";
import Dropzone from "@/components/Dropzone.vue";
import WaveformViewer from "@/components/WaveformViewer.vue";
import AudioPlayerControls from "@/components/AudioPlayerControls.vue";
import { Button } from "@/components/ui/button";
import { Music, Waves, Scissors, Download, Loader2 } from "lucide-vue-next";

const store = useStemStore();

const processStemSeparation = () => {
  console.log("Processing stem separation...");
  store.spliStems();
};
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="border-b border-border bg-background/95 backdrop-blur p-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="p-2 rounded-lg bg-primary/10">
            <Scissors class="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 class="text-2xl font-bold">Audio Splitter</h1>
            <p class="text-muted-foreground">
              Split music into separated parts with AI-powered algorithms
            </p>
          </div>
        </div>

        <div class="flex items-center space-x-3">
          <Button
            variant="outline"
            :disabled="!store.isReady"
            @click="processStemSeparation"
          >
            <Scissors class="h-4 w-4 mr-2" />
            Split Audio
          </Button>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-auto">
      <div class="max-w-6xl mx-auto p-6 space-y-8">
        <div v-if="!store.audioFile" class="text-center space-y-6">
          <div class="mb-8">
            <h2 class="text-3xl font-bold mb-4">Upload Your Audio File</h2>
            <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started by uploading an audio file. Our AI will analyze the
              track and separate it into individual stems like vocals, drums,
              bass, and other instruments.
            </p>
          </div>

          <div class="max-w-2xl mx-auto">
            <Dropzone />
          </div>

          <div class="mt-12">
            <h3 class="text-xl font-semibold mb-6">What you'll get:</h3>
            <div
              class="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto"
            >
              <div
                class="p-4 bg-card border border-border rounded-lg text-center"
              >
                <div
                  class="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-3"
                >
                  <Music class="h-6 w-6 text-green-500" />
                </div>
                <h4 class="font-medium mb-1">Vocals</h4>
                <p class="text-sm text-muted-foreground">
                  Isolated vocal track
                </p>
              </div>

              <div
                class="p-4 bg-card border border-border rounded-lg text-center"
              >
                <div
                  class="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-3"
                >
                  <Music class="h-6 w-6 text-blue-500" />
                </div>
                <h4 class="font-medium mb-1">Drums</h4>
                <p class="text-sm text-muted-foreground">Drum kit separation</p>
              </div>

              <div
                class="p-4 bg-card border border-border rounded-lg text-center"
              >
                <div
                  class="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-3"
                >
                  <Music class="h-6 w-6 text-purple-500" />
                </div>
                <h4 class="font-medium mb-1">Bass</h4>
                <p class="text-sm text-muted-foreground">
                  Bass line extraction
                </p>
              </div>

              <div
                class="p-4 bg-card border border-border rounded-lg text-center"
              >
                <div
                  class="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mx-auto mb-3"
                >
                  <Music class="h-6 w-6 text-orange-500" />
                </div>
                <h4 class="font-medium mb-1">Other</h4>
                <p class="text-sm text-muted-foreground">
                  Remaining instruments
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="store.audioFile" class="space-y-6">
          <div
            class="flex items-center justify-between p-6 bg-card border border-border rounded-lg"
          >
            <div class="flex items-center space-x-4">
              <div class="p-3 rounded-lg bg-primary/10">
                <Music class="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 class="text-lg font-semibold">
                  {{ store.audioFile.name }}
                </h3>
                <p class="text-muted-foreground">
                  {{ (store.audioFile.size / (1024 * 1024)).toFixed(1) }} MB
                  <span v-if="store.duration > 0">
                    • {{ store.formattedDuration }}</span
                  >
                </p>
              </div>
            </div>

            <div class="flex items-center space-x-3">
              <Button variant="outline" size="sm" @click="store.reset()">
                Replace File
              </Button>
              <Button :disabled="!store.isReady" @click="processStemSeparation">
                <Scissors class="h-4 w-4 mr-2" />
                Process Stems
              </Button>
            </div>
          </div>

          <div class="bg-card border border-border rounded-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-lg font-semibold flex items-center">
                <Waves class="h-5 w-5 mr-2" />
                Audio Waveform
              </h4>
              <div class="text-sm text-muted-foreground">
                Click on the waveform to seek
              </div>
            </div>
            <WaveformViewer />
          </div>

          <div>
            <AudioPlayerControls />
          </div>

          <div class="bg-card border border-border rounded-lg p-6">
            <h4 class="text-lg font-semibold mb-4">Processing Options</h4>
            <div class="grid md:grid-cols-2 gap-4">
              <div class="space-y-3">
                <label class="flex items-center space-x-2 text-sm">
                  <input type="checkbox" checked disabled class="rounded" />
                  <span>Separate Vocals</span>
                </label>
                <label class="flex items-center space-x-2 text-sm">
                  <input type="checkbox" checked disabled class="rounded" />
                  <span>Separate Drums</span>
                </label>
                <label class="flex items-center space-x-2 text-sm">
                  <input type="checkbox" checked disabled class="rounded" />
                  <span>Separate Bass</span>
                </label>
              </div>
              <div class="space-y-3">
                <label class="flex items-center space-x-2 text-sm">
                  <input type="checkbox" disabled class="rounded" />
                  <span
                    >High Quality Mode
                    <span class="text-muted-foreground">(Slower)</span></span
                  >
                </label>
                <label class="flex items-center space-x-2 text-sm">
                  <input type="checkbox" disabled class="rounded" />
                  <span>Noise Reduction</span>
                </label>
                <label class="flex items-center space-x-2 text-sm">
                  <input type="checkbox" disabled class="rounded" />
                  <span>Normalization</span>
                </label>
              </div>
            </div>
            <div
              class="mt-4 p-3 bg-muted/50 rounded text-sm text-muted-foreground"
            >
              <strong>Note:</strong> Stem separation processing is coming soon.
              For now, you can upload and preview your audio files.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
