import "./assets/styles.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
const app = createApp(App);

app.use(router);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(router).use(pinia);

app.mount("#app");
