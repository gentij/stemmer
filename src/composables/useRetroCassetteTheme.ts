import { ref, computed } from "vue";
import { retroCassetteThemes, getThemeById } from "@/constants/retro/cassete";
import type { CassetteTheme } from "@/types/retro/cassete.interface";

export function useRetroCassetteTheme() {
  const currentThemeId = ref("purple-dream");
  const currentTheme = ref<CassetteTheme>(getThemeById(currentThemeId.value));

  const backgroundStyle = computed(() => ({
    background: `
      linear-gradient(135deg, ${currentTheme.value.tapeAccent}F0 0%, ${currentTheme.value.tapeColor}F5 100%),
      url('/retro/retro-bg.png')
    `,
    backgroundSize: 'cover, 120%',
    backgroundPosition: 'center center, 35% center',
    backgroundRepeat: 'no-repeat, no-repeat',
    backgroundAttachment: 'fixed, fixed',
    backgroundBlendMode: 'multiply'
  }));

  function selectTheme(themeId: string) {
    currentThemeId.value = themeId;
    currentTheme.value = getThemeById(themeId);
  }

  return {
    currentThemeId,
    currentTheme,
    retroCassetteThemes,
    backgroundStyle,
    selectTheme
  };
}

