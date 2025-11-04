import { ref } from "vue";
import { retroCassetteThemes, getThemeById } from "@/constants/retro/cassete";
import type { CassetteTheme } from "@/types/retro/cassete.interface";

export function useRetroCassetteTheme() {
  const currentThemeId = ref("purple-dream");
  const currentTheme = ref<CassetteTheme>(getThemeById(currentThemeId.value));

  function selectTheme(themeId: string) {
    currentThemeId.value = themeId;
    currentTheme.value = getThemeById(themeId);
  }

  return {
    currentThemeId,
    currentTheme,
    retroCassetteThemes,
    selectTheme,
  };
}
