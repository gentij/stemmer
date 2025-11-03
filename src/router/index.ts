import { createRouter, createWebHistory } from "vue-router";
import RetroCassetteView from "@/views/retro-cassette/RetroCassetteView.vue";
import SettingsView from "@/views/SettingsView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/retro-cassette",
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

export default router;

