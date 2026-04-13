import { defineStore } from "pinia";
import { documentDir, join } from "@tauri-apps/api/path";

export type AccelerationMode = "auto" | "cpu" | "provider";
export type PreferredProvider = "cuda" | "coreml" | "directml" | "onednn" | "xnnpack";

interface SettingsState {
  outputDirectory: string;
  isInitialized: boolean;
  themeRoute: string;
  animationsEnabled: boolean;
  soundEnabled: boolean;
  accelerationMode: AccelerationMode;
  preferredProvider: PreferredProvider;
}

const SETTINGS_STORAGE_KEY = "stemmer-settings";

export const useSettingsStore = defineStore("settings", {
  state: (): SettingsState => ({
    outputDirectory: "",
    isInitialized: false,
    themeRoute: "retro-cassette",
    animationsEnabled: true,
    soundEnabled: true,
    accelerationMode: "auto",
    preferredProvider: "cuda",
  }),

  getters: {
    hasValidOutputDirectory(): boolean {
      return this.outputDirectory.length > 0;
    },
  },

  actions: {
    async initialize() {
      if (this.isInitialized) return;

      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          this.outputDirectory = parsed.outputDirectory || "";
          this.themeRoute = parsed.themeRoute || "retro-cassette";
          this.animationsEnabled = parsed.animationsEnabled !== undefined ? parsed.animationsEnabled : true;
          this.soundEnabled = parsed.soundEnabled !== undefined ? parsed.soundEnabled : true;
          this.accelerationMode = isAccelerationMode(parsed.accelerationMode)
            ? parsed.accelerationMode
            : "auto";
          this.preferredProvider = isPreferredProvider(parsed.preferredProvider)
            ? parsed.preferredProvider
            : "cuda";
        } catch (error) {
          console.error("Failed to parse stored settings:", error);
        }
      }

      if (!this.outputDirectory) {
        try {
          const documentsPath = await documentDir();
          this.outputDirectory = await join(documentsPath, "Stemmer");
          console.log("📁 Default output directory:", this.outputDirectory);
        } catch (error) {
          console.error("Failed to get documents directory:", error);
          this.outputDirectory = "";
        }
      }

      this.isInitialized = true;
      this.persist();
    },

    setOutputDirectory(path: string) {
      this.outputDirectory = path;
      this.persist();
    },

    persist() {
      const data = {
        outputDirectory: this.outputDirectory,
        themeRoute: this.themeRoute,
        animationsEnabled: this.animationsEnabled,
        soundEnabled: this.soundEnabled,
        accelerationMode: this.accelerationMode,
        preferredProvider: this.preferredProvider,
      };
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(data));
    },

    setThemeRoute(route: string) {
      this.themeRoute = route;
      this.persist();
    },

    setAnimationsEnabled(enabled: boolean) {
      this.animationsEnabled = enabled;
      this.persist();
    },

    setSoundEnabled(enabled: boolean) {
      this.soundEnabled = enabled;
      this.persist();
    },

    setAccelerationMode(mode: AccelerationMode) {
      this.accelerationMode = mode;
      this.persist();
    },

    setPreferredProvider(provider: PreferredProvider) {
      this.preferredProvider = provider;
      this.persist();
    },

    async reset() {
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
      this.outputDirectory = "";
      this.isInitialized = false;
      
      await this.initialize();
    },
  },
});

function isAccelerationMode(value: unknown): value is AccelerationMode {
  return value === "auto" || value === "cpu" || value === "provider";
}

function isPreferredProvider(value: unknown): value is PreferredProvider {
  return (
    value === "cuda" ||
    value === "coreml" ||
    value === "directml" ||
    value === "onednn" ||
    value === "xnnpack"
  );
}
