<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useSettingsStore } from "@/stores/settings.store";
import { Button } from "@/components/ui/button";
import { Settings, FolderOpen, Save, RotateCcw, AlertTriangle } from "lucide-vue-next";
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
  return path.includes('/music/') || 
         path.includes('\\music\\') ||
         path.includes('/applications/') ||
         path.includes('/system/') ||
         path.includes('/library/');
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
  if (confirm("Are you sure you want to reset all settings to defaults? This will set the output directory to ~/Documents/Stemmer.")) {
    await reset();
  }
};
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="border-b border-border bg-background/95 backdrop-blur p-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="p-2 rounded-lg bg-primary/10">
            <Settings class="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 class="text-2xl font-bold">Settings</h1>
            <p class="text-muted-foreground">
              Configure your audio processing preferences
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-auto">
      <div class="max-w-4xl mx-auto p-6 space-y-6">
        <!-- Output Directory Section -->
        <div class="bg-card border border-border rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4 flex items-center">
            <FolderOpen class="h-5 w-5 mr-2" />
            Output Directory
          </h2>

          <div class="space-y-4">
            <div 
              v-if="hasProblematicPath"
              class="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg"
            >
              <div class="flex items-start space-x-3">
                <AlertTriangle class="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div class="flex-1">
                  <h4 class="font-medium text-orange-500 mb-1">⚠️ Permission Issue Detected</h4>
                  <p class="text-sm text-muted-foreground mb-3">
                    The current output directory may have permission restrictions that prevent the app from creating files.
                  </p>
                  <div class="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      @click="selectOutputDirectory"
                      class="text-orange-500 border-orange-500 hover:bg-orange-500/10"
                    >
                      <FolderOpen class="h-4 w-4 mr-2" />
                      Choose Different Folder
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      @click="handleReset"
                      class="text-orange-500 border-orange-500 hover:bg-orange-500/10"
                    >
                      <RotateCcw class="h-4 w-4 mr-2" />
                      Use Default (Documents)
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label class="text-sm font-medium text-muted-foreground block mb-2">
                Where should processed audio files be saved?
              </label>
              <div class="flex gap-3">
                <div class="flex-1 p-3 bg-muted rounded border border-border font-mono text-sm overflow-x-auto">
                  {{ outputDirectory || "Not configured" }}
                </div>
                <Button @click="selectOutputDirectory" size="default">
                  <FolderOpen class="h-4 w-4 mr-2" />
                  Browse
                </Button>
              </div>
            </div>

            <div class="p-4 bg-blue-500/10 border border-blue-500/20 rounded text-sm">
              <p class="mb-2 font-medium text-blue-600 dark:text-blue-400">
                💡 Important Information
              </p>
              <ul class="space-y-1 text-muted-foreground ml-4 list-disc">
                <li>Choose a directory where you have <strong>write permissions</strong></li>
                <li>The app will automatically create the directory if it doesn't exist</li>
                <li>Processed stems are saved in subdirectories named after your input files</li>
                <li>Avoid system-protected folders (like Applications, System, etc.)</li>
                <li>Recommended: Use Documents, Music, or Desktop folders</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-card border border-border rounded-lg p-6 opacity-50">
          <h2 class="text-xl font-semibold mb-4 flex items-center">
            <Settings class="h-5 w-5 mr-2" />
            Processing Options
          </h2>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">High Quality Mode</p>
                <p class="text-sm text-muted-foreground">
                  Use higher quality processing (slower)
                </p>
              </div>
              <input type="checkbox" disabled class="rounded" />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">Normalize Output</p>
                <p class="text-sm text-muted-foreground">
                  Normalize volume levels of output stems
                </p>
              </div>
              <input type="checkbox" disabled class="rounded" />
            </div>

            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">Keep Original Format</p>
                <p class="text-sm text-muted-foreground">
                  Maintain the input file's audio format
                </p>
              </div>
              <input type="checkbox" disabled class="rounded" />
            </div>
          </div>

          <div class="mt-4 p-3 bg-muted/50 rounded text-sm text-muted-foreground">
            <strong>Note:</strong> Additional processing options are coming soon.
          </div>
        </div>

        <div class="bg-card border border-border rounded-lg p-6 opacity-50">
          <h2 class="text-xl font-semibold mb-4 flex items-center">
            <Save class="h-5 w-5 mr-2" />
            Model Settings
          </h2>

          <div class="space-y-4">
            <div>
              <label class="text-sm font-medium text-muted-foreground block mb-2">
                Separation Model
              </label>
              <select disabled class="w-full p-2 bg-muted border border-border rounded">
                <option>Demucs v4 (Default)</option>
                <option>Demucs v3</option>
                <option>MDX-Net</option>
              </select>
            </div>

            <div>
              <label class="text-sm font-medium text-muted-foreground block mb-2">
                Model Variant
              </label>
              <select disabled class="w-full p-2 bg-muted border border-border rounded">
                <option>4-stem (vocals, drums, bass, other)</option>
                <option>2-stem (vocals, accompaniment)</option>
                <option>6-stem (experimental)</option>
              </select>
            </div>
          </div>

          <div class="mt-4 p-3 bg-muted/50 rounded text-sm text-muted-foreground">
            <strong>Note:</strong> Model selection will be available in future updates.
          </div>
        </div>

        <div class="bg-card border border-border rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4 flex items-center">
            <RotateCcw class="h-5 w-5 mr-2" />
            Reset Settings
          </h2>

          <div class="space-y-4">
            <p class="text-muted-foreground">
              Reset all settings to their default values. This action cannot be undone.
            </p>

            <Button @click="handleReset" variant="outline" class="text-red-500 hover:text-red-600">
              <RotateCcw class="h-4 w-4 mr-2" />
              Reset All Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

