<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useSettingsStore } from "@/stores/settings.store";
import { useToast } from "@/composables/useToast";
import { open } from "@tauri-apps/plugin-dialog";
import { storeToRefs } from "pinia";
import { useRetroCassetteTheme } from "@/composables/useRetroCassetteTheme";
import CassetteScrew from "@/components/retro/cassette/CassetteScrew.vue";
import BrandingSection from "./BrandingSection.vue";
import ThemeSelector from "./ThemeSelector.vue";
import BehaviorControls from "./BehaviorControls.vue";
import OutputDirectoryPanel from "./OutputDirectoryPanel.vue";

const router = useRouter();
const settingsStore = useSettingsStore();
const { outputDirectory, themeRoute, animationsEnabled, soundEnabled } = storeToRefs(settingsStore);
const { setOutputDirectory, setThemeRoute, setAnimationsEnabled, setSoundEnabled } = settingsStore;
const toast = useToast();
const { currentTheme } = useRetroCassetteTheme();

const availableThemes = [
  { value: "retro-cassette", label: "Retro Cassette", description: "Classic cassette player aesthetic" },
];

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
      toast.success("Output directory updated");
    }
  } catch (error: any) {
    toast.error("Failed to select directory. Please try again.");
  }
};

const handleThemeChange = (newTheme: string) => {
  setThemeRoute(newTheme);
  router.push({ name: newTheme });
  toast.success("Theme changed");
};

const handleAnimationsToggle = (enabled: boolean) => {
  setAnimationsEnabled(enabled);
  toast.info(enabled ? "Animations enabled" : "Animations disabled");
};

const handleSoundToggle = (enabled: boolean) => {
  setSoundEnabled(enabled);
  toast.info(enabled ? "Sounds enabled" : "Sounds disabled");
};

const handleResetOutputDirectory = async () => {
  try {
    const { documentDir, join } = await import("@tauri-apps/api/path");
    const documentsPath = await documentDir();
    const defaultPath = await join(documentsPath, "Stemmer");
    setOutputDirectory(defaultPath);
    toast.success("Output directory reset to default");
  } catch (error) {
    toast.error("Failed to reset output directory");
  }
};

const uniqueId = Math.random().toString(36).slice(2);
</script>

<template>
  <div class="w-full max-w-4xl mx-auto space-y-8">
    <BrandingSection :theme="currentTheme" />

    <div
      class="border-2 rounded-3xl p-6 md:p-8 shadow-[-4px_8px_16px_0_rgba(255,255,255,0.16)] relative overflow-hidden"
      :style="{ 
        borderColor: currentTheme.borderColor,
        backgroundColor: currentTheme.housingColor,
      }"
    >
      <div class="absolute inset-0 flex flex-col justify-between opacity-20">
        <div
          v-for="i in 25"
          :key="i"
          class="w-full h-[3%]"
          :style="{ backgroundColor: currentTheme.lineColor }"
        ></div>
      </div>

      <div class="absolute top-3 left-3">
        <CassetteScrew :theme="currentTheme" :gradient-id="`settings-${uniqueId}-1`" />
      </div>
      <div class="absolute top-3 right-3">
        <CassetteScrew :theme="currentTheme" :gradient-id="`settings-${uniqueId}-2`" />
      </div>
      <div class="absolute bottom-3 left-3">
        <CassetteScrew :theme="currentTheme" :gradient-id="`settings-${uniqueId}-3`" />
      </div>
      <div class="absolute bottom-3 right-3">
        <CassetteScrew :theme="currentTheme" :gradient-id="`settings-${uniqueId}-4`" />
      </div>

      <div class="relative z-10 space-y-8">
        <div class="text-center">
          <h2 
            class="text-2xl font-bold font-mono uppercase tracking-widest mb-2"
            :style="{ color: currentTheme.tapeAccent }"
          >
            CONTROL PANEL
          </h2>
          <div 
            class="h-px mx-auto max-w-xs"
            :style="{ backgroundColor: `${currentTheme.borderColor}40` }"
          ></div>
        </div>

        <ThemeSelector
          :theme="currentTheme"
          :available-themes="availableThemes"
          :current-theme-route="themeRoute"
          @theme-change="handleThemeChange"
        />

        <BehaviorControls
          :theme="currentTheme"
          :animations-enabled="animationsEnabled"
          :sound-enabled="soundEnabled"
          @animations-toggle="handleAnimationsToggle"
          @sound-toggle="handleSoundToggle"
        />

        <OutputDirectoryPanel
          :theme="currentTheme"
          :output-directory="outputDirectory"
          :has-problematic-path="hasProblematicPath"
          @select-directory="selectOutputDirectory"
          @reset-directory="handleResetOutputDirectory"
        />
      </div>
    </div>
  </div>
</template>

