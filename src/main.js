import "./assets/styles.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import { VueQueryPlugin } from "@tanstack/vue-query";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi", // This is already the default value - only for display purposes
  },
});

app.use(pinia).use(router).use(vuetify).use(VueQueryPlugin).mount("#app");

router.isReady().then(() => {});
