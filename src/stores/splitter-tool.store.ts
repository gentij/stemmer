import { defineStore } from "pinia";
import { useAudioCoreStore } from "./audio-core.store";
import { splitStems } from "@/services/splitter.service";

export const useSplitterToolStore = defineStore("splitterTool", {
  actions: {
    async split() {
      const { audioPath: input } = useAudioCoreStore();
      if (!input) {
        console.warn("No audioPath set; split requires a filesystem path.");
        return;
      }
      await splitStems({ input: input, output: "output" });
    },
  },
});
