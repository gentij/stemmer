import { basename, join } from "@tauri-apps/api/path";
import { readFile } from "@tauri-apps/plugin-fs";
import { useAudioCoreStore } from "@/stores/audio-core.store";
import { useSplitterToolStore } from "@/stores/splitter-tool.store";
import { useStemsAudioStore } from "@/stores/stems-audio.store";
import { useSettingsStore } from "@/stores/settings.store";
import { useRecentFiles } from "./useRecentFiles";

export function useRecentFileLoader() {
  const audioStore = useAudioCoreStore();
  const splitterStore = useSplitterToolStore();
  const stemsAudioStore = useStemsAudioStore();
  const settingsStore = useSettingsStore();
  const { removeRecentFile } = useRecentFiles();

  async function loadRecentFile(path: string): Promise<boolean> {
    try {
      const inputFileName = await basename(path);
      const inputFileStem = inputFileName.replace(/\.[^/.]+$/, "");
      const baseOutputDir = settingsStore.outputDirectory;
      const expectedOutputPath = await join(baseOutputDir, inputFileStem);
      
      const testStemPath = await join(expectedOutputPath, `${inputFileStem}_vocals.wav`);
      
      try {
        await readFile(testStemPath);
        
        splitterStore.resetProgress();
        splitterStore.outputPath = expectedOutputPath;
        await audioStore.loadFileFromPath(path);
        
        await stemsAudioStore.loadStems();
        
        splitterStore.status = "finished";
        
        return true;
      } catch {
        removeRecentFile(path);
        return false;
      }
    } catch (error) {
      console.error('Failed to load recent file:', error);
      removeRecentFile(path);
      return false;
    }
  }

  return {
    loadRecentFile,
  };
}

