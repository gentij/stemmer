import { defineStore } from "pinia";
import { ref, watch } from "vue";

export type Theme = "light" | "dark";

export const useThemeStore = defineStore("theme", () => {
  const getInitialTheme = (): Theme => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark") {
        return stored;
      }

      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  };

  const currentTheme = ref<Theme>(getInitialTheme());

  const applyTheme = (theme: Theme) => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;

      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === "light" ? "dark" : "light";
  };

  const setTheme = (theme: Theme) => {
    currentTheme.value = theme;
  };

  watch(
    currentTheme,
    (newTheme) => {
      applyTheme(newTheme);
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newTheme);
      }
    },
    { immediate: true }
  );

  if (typeof window !== "undefined") {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        currentTheme.value = e.matches ? "dark" : "light";
      }
    });
  }

  return {
    currentTheme,
    toggleTheme,
    setTheme,
  };
});
