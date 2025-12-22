import { basename, join } from "@tauri-apps/api/path";
import { readFile } from "@tauri-apps/plugin-fs";
import { useAudioCoreStore } from "@/stores/audio-core.store";
import { useSplitterToolStore } from "@/stores/splitter-tool.store";
import { useStemsAudioStore } from "@/stores/stems-audio.store";
import { useSettingsStore } from "@/stores/settings.store";
import { useRecentFiles } from "./useRecentFiles";
import { useToast } from "./useToast";

export function useRecentFileLoader() {
  const audioStore = useAudioCoreStore();
  const splitterStore = useSplitterToolStore();
  const stemsAudioStore = useStemsAudioStore();
  const settingsStore = useSettingsStore();
  const { removeRecentFile } = useRecentFiles();
  const toast = useToast();

  async function loadRecentFile(recentFile: { path: string; outputPath?: string }): Promise<boolean> {
    try {
      const inputFileName = await basename(recentFile.path);
      const inputFileStem = inputFileName.replace(/\.[^/.]+$/, "");
      
      let expectedOutputPath: string;
      if (recentFile.outputPath) {
        expectedOutputPath = recentFile.outputPath;
      } else {
        const baseOutputDir = settingsStore.outputDirectory;
        expectedOutputPath = await join(baseOutputDir, inputFileStem);
      }
      
      const testStemPath = await join(expectedOutputPath, `${inputFileStem}_vocals.wav`);
      
      try {
        await readFile(testStemPath);
        
        splitterStore.resetProgress();
        splitterStore.outputPath = expectedOutputPath;
        await audioStore.loadFileFromPath(recentFile.path);
        
        await stemsAudioStore.loadStems();
        
        splitterStore.status = "finished";
        
        return true;
      } catch {
        removeRecentFile(recentFile.path);
        return false;
      }
    } catch (error) {
      toast.error('Failed to load recent file. It may have been moved or deleted.');
      removeRecentFile(recentFile.path);
      return false;
    }
  }

  return {
    loadRecentFile,
  };
}

