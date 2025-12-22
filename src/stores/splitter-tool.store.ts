import { defineStore } from "pinia";
import { useAudioCoreStore } from "./audio-core.store";
import { useSettingsStore } from "./settings.store";
import { splitStems } from "@/services/splitter.service";
import { listen } from "@tauri-apps/api/event";

export type ProcessingStatus = "idle" | "downloading" | "processing" | "writing" | "finished" | "error";

interface ProgressState {
  status: ProcessingStatus;
  
  downloadedBytes: number;
  totalBytes: number;
  
  currentStage: string;
  
  currentStem: string;
  writingPercent: number;
  
  errorMessage: string;
  
  outputPath: string;
  
  unlistenFn: (() => void) | null;
}

export const useSplitterToolStore = defineStore("splitterTool", {
  state: (): ProgressState => ({
    status: "idle",
    downloadedBytes: 0,
    totalBytes: 0,
    currentStage: "",
    currentStem: "",
    writingPercent: 0,
    errorMessage: "",
    outputPath: "",
    unlistenFn: null,
  }),

  getters: {
    canProcess(): boolean {
      const audio = useAudioCoreStore();
      const settings = useSettingsStore();
      return !!audio.audioPath && audio.isReady && settings.hasValidOutputDirectory && this.status === "idle";
    },

    isProcessing(): boolean {
      return this.status !== "idle" && this.status !== "finished" && this.status !== "error";
    },

    downloadProgress(): number {
      if (this.totalBytes === 0) return 0;
      return Math.round((this.downloadedBytes / this.totalBytes) * 100);
    },

    hasError(): boolean {
      return this.status === "error";
    },

    isFinished(): boolean {
      return this.status === "finished";
    },
  },

  actions: {
    resetProgress() {
      if (this.unlistenFn) {
        this.unlistenFn();
        this.unlistenFn = null;
      }
      this.status = "idle";
      this.downloadedBytes = 0;
      this.totalBytes = 0;
      this.currentStage = "";
      this.currentStem = "";
      this.writingPercent = 0;
      this.errorMessage = "";
      this.outputPath = "";
    },

    cancel() {
      if (this.unlistenFn) {
        this.unlistenFn();
        this.unlistenFn = null;
      }
      this.status = "idle";
      this.downloadedBytes = 0;
      this.totalBytes = 0;
      this.currentStage = "";
      this.currentStem = "";
      this.writingPercent = 0;
      this.errorMessage = "";
      // Keep outputPath in case user wants to retry
    },

    async split() {
      const audioStore = useAudioCoreStore();
      const settingsStore = useSettingsStore();
      
      const input = audioStore.audioPath;
      if (!input) {
        console.warn("No audioPath set; split requires a filesystem path.");
        return;
      }

      if (!settingsStore.hasValidOutputDirectory) {
        this.status = "error";
        this.errorMessage = "Please configure an output directory in settings.";
        return;
      }

      this.resetProgress();
      this.status = "downloading";

      const unlisten = await listen("split-progress", (evt) => {
        if (this.status === "idle") {
          return;
        }

        const payload = evt.payload as any;

        switch (payload.kind) {
          case "download":
            this.status = "downloading";
            this.downloadedBytes = payload.downloaded || 0;
            this.totalBytes = payload.total || 0;
            break;

          case "stage":
            this.status = "processing";
            this.currentStage = payload.stage || "";
            break;

          case "writing":
            this.status = "writing";
            this.currentStem = payload.stem || "";
            this.writingPercent = payload.percent || 0;
            break;

          case "finished":
            this.status = "finished";
            this.outputPath = payload.output_path || settingsStore.outputDirectory;
            break;

          default:
            break;
        }
      });

      this.unlistenFn = unlisten;

      try {
        const result = await splitStems({ 
          input, 
          output: settingsStore.outputDirectory 
        });
        
        const isNotTerminalState = !["finished", "error"].includes(this.status as ProcessingStatus);
        if (isNotTerminalState) {
          this.status = "finished";
          this.outputPath = result || settingsStore.outputDirectory;
        }
      } catch (error: any) {
        // Only set error if we're still in a processing state (not cancelled or already finished)
        const isProcessingState = ["downloading", "processing", "writing"].includes(this.status);
        if (isProcessingState) {
          this.status = "error";
          this.errorMessage = error?.message || error?.toString() || "An unknown error occurred";
        }
      } finally {
        if (this.unlistenFn === unlisten) {
          unlisten();
          this.unlistenFn = null;
        }
      }
    },
  },
});
