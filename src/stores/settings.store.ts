import { defineStore } from "pinia";
import { documentDir, join } from "@tauri-apps/api/path";

interface SettingsState {
  outputDirectory: string;
  isInitialized: boolean;
}

const SETTINGS_STORAGE_KEY = "stemmer-settings";

export const useSettingsStore = defineStore("settings", {
  state: (): SettingsState => ({
    outputDirectory: "",
    isInitialized: false,
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
      };
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(data));
    },

    async reset() {
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
      this.outputDirectory = "";
      this.isInitialized = false;
      
      await this.initialize();
    },
  },
});

