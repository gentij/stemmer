import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import "./assets/main.css";
import { TOAST_CONFIG } from "./constants/toast";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(Toast, TOAST_CONFIG);

import { useThemeStore } from "@/stores/theme";
import { useSettingsStore } from "@/stores/settings.store";
useThemeStore();

// Initialize settings before mounting
const settingsStore = useSettingsStore();
settingsStore.initialize().then(() => {
  app.mount("#app");
});
