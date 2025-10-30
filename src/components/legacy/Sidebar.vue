<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Music } from "lucide-vue-next";
import { TOOLS, SETTINGS_ITEM, type ToolId, type ViewId } from "@/constants/tools";
import ThemeToggle from "@/components/ThemeToggle.vue";

const tools = Object.entries(TOOLS).map(([id, tool]) => ({
  id: id as ToolId,
  ...tool,
}));

defineProps<{
  activeView: ViewId;
}>();

const emit = defineEmits<{
  viewChange: [viewId: ViewId];
}>();

const handleToolClick = (toolId: string, available: boolean) => {
  if (available) {
    emit("viewChange", toolId as ViewId);
  }
};
</script>

<template>
  <div class="h-full bg-card border-r border-border flex flex-col">
    <div class="p-6 border-b border-border">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="p-2 rounded-lg bg-primary/10">
            <Music class="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 class="text-2xl font-bold">Stemmer</h1>
            <p class="text-muted-foreground">Audio Processing Suite</p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </div>

    <div class="flex-1 p-4 space-y-2 overflow-y-auto">
      <div v-for="tool in tools" :key="tool.id">
        <Button variant="ghost" class="w-full justify-start p-4 h-auto" :class="{
          'bg-primary/10 text-primary':
            activeView === tool.id && tool.available,
          'opacity-50 cursor-not-allowed': !tool.available,
        }" @click="handleToolClick(tool.id, tool.available)" :disabled="!tool.available">
          <div class="flex items-center space-x-3 w-full">
            <div class="p-2 rounded-lg bg-background">
              <component :is="tool.icon" class="h-5 w-5" />
            </div>
            <div class="flex-1 text-left">
              <div class="font-medium">{{ tool.name }}</div>
              <div class="text-xs text-muted-foreground mt-1">
                {{ tool.description }}
              </div>
              <div v-if="!tool.available" class="text-xs text-primary mt-1">
                Coming Soon
              </div>
            </div>
          </div>
        </Button>
      </div>
    </div>

    <div class="p-4 border-t border-border">
      <Button variant="ghost" class="w-full justify-start p-4 h-auto" :class="{
        'bg-primary/10 text-primary': activeView === 'settings',
      }" @click="handleToolClick(SETTINGS_ITEM.id, SETTINGS_ITEM.available)">
        <div class="flex items-center space-x-3 w-full">
          <div class="p-2 rounded-lg bg-background">
            <component :is="SETTINGS_ITEM.icon" class="h-5 w-5" />
          </div>
          <div class="flex-1 text-left">
            <div class="font-medium">{{ SETTINGS_ITEM.name }}</div>
            <div class="text-xs text-muted-foreground mt-1">
              {{ SETTINGS_ITEM.description }}
            </div>
          </div>
        </div>
      </Button>
    </div>
  </div>
</template>
