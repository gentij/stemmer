<script setup lang="ts">
import { ref, computed } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import SplitterView from "@/views/splitter/SplitterView.vue";
import SettingsView from "@/views/SettingsView.vue";
import ComingSoon from "@/components/ComingSoon.vue";
import {
  TOOLS,
  TOOL_DESCRIPTIONS,
  DEFAULT_TOOL,
  type ToolId,
  type ViewId,
} from "@/constants/tools";

const activeView = ref<ViewId>(DEFAULT_TOOL);

const currentTool = computed(() => {
  if (activeView.value === 'settings') {
    return null;
  }
  
  return {
    name: TOOLS[activeView.value as ToolId].name,
    description: TOOL_DESCRIPTIONS[activeView.value as ToolId],
    icon: TOOLS[activeView.value as ToolId].icon,
  };
});

const handleViewChange = (viewId: ViewId) => {
  activeView.value = viewId;
};
</script>

<template>
  <div class="h-screen flex bg-background">
    <div class="w-80 flex-shrink-0">
      <Sidebar :activeView="activeView" @viewChange="handleViewChange" />
    </div>

    <div class="flex-1 flex flex-col min-w-0">
      <SplitterView 
        v-if="activeView === 'splitter'" 
        @navigateToSettings="handleViewChange('settings')"
      />
      <SettingsView v-else-if="activeView === 'settings'" />

      <ComingSoon
        v-else-if="currentTool"
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
