import { ref } from "vue";
import { retroCassetteThemes, getThemeById } from "@/constants/retro/cassete";
import type { CassetteTheme } from "@/types/retro/cassete.interface";

const STORAGE_KEY = "retro-cassette-theme";

export function useRetroCassetteTheme() {
  const savedThemeId = localStorage.getItem(STORAGE_KEY) || "purple-dream";
  const currentThemeId = ref(savedThemeId);
  const currentTheme = ref<CassetteTheme>(getThemeById(currentThemeId.value));

  function selectTheme(themeId: string) {
    currentThemeId.value = themeId;
    currentTheme.value = getThemeById(themeId);
    localStorage.setItem(STORAGE_KEY, themeId);
  }

  return {
    currentThemeId,
    currentTheme,
    retroCassetteThemes,
    selectTheme,
  };
}
