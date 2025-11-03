<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useSettingsStore } from "@/stores/settings.store";
import { FolderOpen, RotateCcw, AlertTriangle } from "lucide-vue-next";
import { open } from "@tauri-apps/plugin-dialog";
import { storeToRefs } from "pinia";

const settingsStore = useSettingsStore();
const { outputDirectory } = storeToRefs(settingsStore);
const { initialize, setOutputDirectory, reset } = settingsStore;

onMounted(async () => {
  await initialize();
});

const hasProblematicPath = computed(() => {
  const path = outputDirectory.value.toLowerCase();
  return (
    path.includes("/music/") ||
    path.includes("\\music\\") ||
    path.includes("/applications/") ||
    path.includes("/system/") ||
    path.includes("/library/")
  );
});

const selectOutputDirectory = async () => {
  try {
    const selected = await open({
      directory: true,
      multiple: false,
      title: "Select Output Directory",
      defaultPath: outputDirectory.value || undefined,
    });

    if (selected) {
      setOutputDirectory(selected);
    }
  } catch (error) {
    console.error("Failed to select directory:", error);
  }
};

const handleReset = async () => {
  if (
    confirm(
      "Are you sure you want to reset all settings to defaults? This will set the output directory to ~/Documents/Stemmer."
    )
  ) {
    await reset();
  }
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8">
    <div class="w-full max-w-2xl">

      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">Settings</h1>
        <p class="text-gray-400">Configure your audio processing preferences</p>
      </div>

      <div class="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-6">
        <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <FolderOpen class="h-5 w-5" />
          Output Directory
        </h2>

        <div class="space-y-4">
          <div v-if="hasProblematicPath" class="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
            <div class="flex items-start gap-3">
              <AlertTriangle class="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
              <div class="flex-1">
                <h4 class="font-medium text-orange-400 mb-1">⚠️ Permission Issue Detected</h4>
                <p class="text-sm text-gray-400 mb-3">
                  The current output directory may have permission restrictions that prevent the app from creating files.
                </p>
                <div class="flex gap-2 flex-wrap">
                  <button
                    @click="selectOutputDirectory"
                    class="px-4 py-2 text-sm font-medium text-orange-400 border border-orange-400/50 rounded-lg hover:bg-orange-500/10 transition-colors"
                  >
                    <FolderOpen class="h-4 w-4 inline mr-2" />
                    Choose Different Folder
                  </button>
                  <button
                    @click="handleReset"
                    class="px-4 py-2 text-sm font-medium text-orange-400 border border-orange-400/50 rounded-lg hover:bg-orange-500/10 transition-colors"
                  >
                    <RotateCcw class="h-4 w-4 inline mr-2" />
                    Use Default (Documents)
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-300 block mb-2">
              Where should processed audio files be saved?
            </label>
            <div class="flex gap-3">
              <div class="flex-1 p-3 bg-black/40 rounded-lg border border-white/10 font-mono text-sm text-gray-300 overflow-x-auto">
                {{ outputDirectory || "Not configured" }}
              </div>
              <button
                @click="selectOutputDirectory"
                class="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
              >
                <FolderOpen class="h-4 w-4" />
                Browse
              </button>
            </div>
          </div>

          <div class="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-sm">
            <p class="mb-2 font-medium text-blue-400">💡 Important Information</p>
            <ul class="space-y-1 text-gray-400 ml-4 list-disc">
              <li>Choose a directory where you have <strong class="text-gray-300">write permissions</strong></li>
              <li>The app will automatically create the directory if it doesn't exist</li>
              <li>Processed stems are saved in subdirectories named after your input files</li>
              <li>Recommended: Use Documents, Music, or Desktop folders</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6">
        <h2 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <RotateCcw class="h-5 w-5" />
          Reset Settings
        </h2>

        <p class="text-gray-400 mb-4">Reset all settings to their default values. This action cannot be undone.</p>

        <button
          @click="handleReset"
          class="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 font-medium transition-colors flex items-center gap-2"
        >
          <RotateCcw class="h-4 w-4" />
          Reset All Settings
        </button>
      </div>
    </div>
  </div>
</template>

