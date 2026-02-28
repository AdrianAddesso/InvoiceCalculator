import { createApp } from "vue";
import { createPinia } from "pinia";
import "./assets/base.css";
import "virtual:uno.css";
import App from "./App.vue";

const app = createApp(App);
app.use(createPinia());
app.mount("#app");
