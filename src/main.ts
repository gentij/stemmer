import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./assets/main.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

import { useThemeStore } from "@/stores/theme";
useThemeStore();

app.mount("#app");
