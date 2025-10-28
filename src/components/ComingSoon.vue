<script setup lang="ts">
import { Clock, Lightbulb, Zap } from "lucide-vue-next";

defineProps<{
  toolName: string;
  toolDescription: string;
  icon?: any;
}>();
</script>

<template>
  <div class="flex items-center justify-center min-h-[500px]">
    <div class="text-center max-w-md mx-auto">
      <!-- Icon -->
      <div class="mb-8">
        <div
          class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <component v-if="icon" :is="icon" class="h-10 w-10 text-primary" />
          <Clock v-else class="h-10 w-10 text-primary" />
        </div>
      </div>

      <!-- Title -->
      <h2 class="text-2xl font-bold mb-3">{{ toolName }}</h2>
      <p class="text-muted-foreground text-lg mb-8">{{ toolDescription }}</p>

      <!-- Coming Soon Badge -->
      <div
        class="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-8"
      >
        <Clock class="h-4 w-4" />
        <span class="font-medium">Coming Soon</span>
      </div>

      <!-- Features Preview -->
      <div class="space-y-4 text-left">
        <div class="flex items-start space-x-3">
          <div
            class="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5"
          >
            <Zap class="h-3 w-3 text-green-500" />
          </div>
          <div>
            <p class="text-sm font-medium">AI-Powered Processing</p>
            <p class="text-xs text-muted-foreground">
              Advanced machine learning algorithms
            </p>
          </div>
        </div>

        <div class="flex items-start space-x-3">
          <div
            class="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center mt-0.5"
          >
            <Lightbulb class="h-3 w-3 text-blue-500" />
          </div>
          <div>
            <p class="text-sm font-medium">High Quality Output</p>
            <p class="text-xs text-muted-foreground">
              Professional-grade audio processing
            </p>
          </div>
        </div>

        <div class="flex items-start space-x-3">
          <div
            class="w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center mt-0.5"
          >
            <Clock class="h-3 w-3 text-purple-500" />
          </div>
          <div>
            <p class="text-sm font-medium">Fast Processing</p>
            <p class="text-xs text-muted-foreground">
              Optimized for speed and efficiency
            </p>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="mt-8 p-4 bg-muted/50 rounded-lg">
        <p class="text-sm text-muted-foreground">
          We're working hard to bring you this feature.
          <br />
          In the meantime, try out our <strong>Splitter</strong> tool!
        </p>
      </div>
    </div>
  </div>
</template>
