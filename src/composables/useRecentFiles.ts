import { ref, computed } from "vue";

export interface RecentFile {
  path: string;
  name: string;
  outputPath: string;
  processedAt: number;
}

const STORAGE_KEY = "stemmer-recent-files";
const MAX_RECENT_FILES = 5;

function loadRecentFiles(): RecentFile[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load recent files:", error);
  }
  return [];
}

function saveRecentFiles(files: RecentFile[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  } catch (error) {
    console.error("Failed to save recent files:", error);
  }
}

export function useRecentFiles() {
  const recentFiles = ref<RecentFile[]>(loadRecentFiles());

  const recentFilesList = computed(() => recentFiles.value.slice(0, MAX_RECENT_FILES));

  function addRecentFile(path: string, name: string, outputPath: string) {
    const newFile: RecentFile = {
      path,
      name,
      outputPath,
      processedAt: Date.now(),
    };

    const existingIndex = recentFiles.value.findIndex(
      (file) => file.path === path
    );

    if (existingIndex >= 0) {
      recentFiles.value.splice(existingIndex, 1);
    }

    recentFiles.value.unshift(newFile);

    if (recentFiles.value.length > MAX_RECENT_FILES) {
      recentFiles.value = recentFiles.value.slice(0, MAX_RECENT_FILES);
    }

    saveRecentFiles(recentFiles.value);
  }

  function removeRecentFile(path: string) {
    recentFiles.value = recentFiles.value.filter((file) => file.path !== path);
    saveRecentFiles(recentFiles.value);
  }

  function clearRecentFiles() {
    recentFiles.value = [];
    saveRecentFiles(recentFiles.value);
  }

  return {
    recentFiles: recentFilesList,
    addRecentFile,
    removeRecentFile,
    clearRecentFiles,
  };
}

