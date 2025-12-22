import { createRouter, createWebHistory } from "vue-router";
import RetroCassetteView from "@/views/retro-cassette/RetroCassetteView.vue";
import SettingsView from "@/views/SettingsView.vue";
import { useSettingsStore } from "@/stores/settings.store";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: () => {
        const settingsStore = useSettingsStore();
        const route = settingsStore.themeRoute || "retro-cassette";
        return `/${route}`;
      },
    },
    {
      path: "/retro-cassette",
      name: "retro-cassette",
      component: RetroCassetteView,
      meta: {
        title: "Retro Cassette",
      },
    },
    {
      path: "/settings",
      name: "settings",
      component: SettingsView,
      meta: {
        title: "Settings",
      },
    },
  ],
});

router.beforeEach(async (_to, _from, next) => {
  const settingsStore = useSettingsStore();
  if (!settingsStore.isInitialized) {
    await settingsStore.initialize();
  }
  next();
});

export default router;

