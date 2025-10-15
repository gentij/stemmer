import { defineStore } from "pinia";
import { useAudioCoreStore } from "./audio-core.store";
import { splitStems } from "@/services/splitter.service";

export const useSplitterToolStore = defineStore("splitterTool", {
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
      await splitStems({ input: input, output: "output" });
    },
  },
});
