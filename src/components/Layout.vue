<script setup lang="ts">
import { ref, computed } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import SplitterView from "@/components/SplitterView.vue";
import ComingSoon from "@/components/ComingSoon.vue";
import {
  TOOLS,
  TOOL_DESCRIPTIONS,
  DEFAULT_TOOL,
  type ToolId,
} from "@/constants/tools";

const activeTool = ref<ToolId>(DEFAULT_TOOL);

const currentTool = computed(() => ({
  name: TOOLS[activeTool.value].name,
  description: TOOL_DESCRIPTIONS[activeTool.value],
  icon: TOOLS[activeTool.value].icon,
}));

const handleToolChange = (toolId: string) => {
  activeTool.value = toolId as ToolId;
};
</script>

<template>
  <div class="h-screen flex bg-background">
    <div class="w-80 flex-shrink-0">
      <Sidebar :activeTool="activeTool" @toolChange="handleToolChange" />
    </div>

    <div class="flex-1 flex flex-col min-w-0">
      <SplitterView v-if="activeTool === 'splitter'" />

      <ComingSoon
        v-else
        :toolName="currentTool.name"
        :toolDescription="currentTool.description"
        :icon="currentTool.icon"
      />
    </div>
  </div>
</template>

<style scoped>
.h-screen {
  height: 100vh;
  height: 100dvh;
}
</style>
