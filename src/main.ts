import { IonicVue } from "@ionic/vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/* Ionic Dark Mode */
import "@ionic/vue/css/palettes/dark.class.css";

/* Theme variables */
import "./theme/variables.css";

import { runSeed } from "./composables/useSeed";
import { applyTheme } from "./stores/settings";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

app.use(IonicVue, {
	mode: "ios", // Consistent iOS-style look across platforms
});

app.use(router);

router.isReady().then(() => {
	// Apply persisted theme
	const settingsRaw = localStorage.getItem("settings");
	if (settingsRaw) {
		try {
			const parsed = JSON.parse(settingsRaw);
			applyTheme(parsed.theme ?? "system");
		} catch {
			applyTheme("system");
		}
	}

	// Run seed data
	runSeed();

	app.mount("#app");
});
