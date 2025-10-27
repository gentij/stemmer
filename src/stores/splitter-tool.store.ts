import { defineStore } from "pinia";
import { useAudioCoreStore } from "./audio-core.store";
import { splitStems } from "@/services/splitter.service";
import { listen } from "@tauri-apps/api/event";

export const useSplitterToolStore = defineStore("splitterTool", {
  state: () => ({
    isLoading: false,
  }),

  getters: {
    canProcess(): boolean {
      const audio = useAudioCoreStore();
      return !!audio.audioPath && audio.isReady;
    },
  },
  actions: {
    async split() {
      const store = useAudioCoreStore();
      const input = store.audioPath;
      if (!input) {
        console.warn("No audioPath set; split requires a filesystem path.");
        return;
      }

      this.isLoading = true;

      const unlisten = await listen("split-progress", (evt) => {
        const p = evt.payload as any;

        console.log("Split status: ", p);
      });

      try {
        await splitStems({ input, output: "output" });
      } finally {
        unlisten();
        this.isLoading = false;
      }
    },
  },
});
