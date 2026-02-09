import { defineStore } from "pinia";

interface SettingsState {
	serverUrl: string;
	theme: "light" | "dark" | "system";
	runSeed: boolean;
	currentVersion: number;
	lastSeededVersion: number;
	linkCountdowns: boolean;
}

export const useSettingsStore = defineStore("settings", {
	state: (): SettingsState => ({
		serverUrl: "https://cloud.munctl.app",
		theme: "system",
		runSeed: true,
		currentVersion: 1,
		lastSeededVersion: 0,
		linkCountdowns: true,
	}),

	getters: {
		isDark(state): boolean {
			if (state.theme === "system") {
				return window.matchMedia("(prefers-color-scheme: dark)").matches;
			}
			return state.theme === "dark";
		},
	},

	actions: {
		setTheme(theme: "light" | "dark" | "system") {
			this.theme = theme;
			applyTheme(theme);
		},

		toggleTheme() {
			if (this.theme === "dark") {
				this.setTheme("light");
			} else {
				this.setTheme("dark");
			}
		},
	},

	persist: true,
});

export function applyTheme(theme: "light" | "dark" | "system") {
	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	const shouldBeDark = theme === "dark" || (theme === "system" && prefersDark);

	document.body.classList.toggle("dark", shouldBeDark);
	document.documentElement.classList.toggle("ion-palette-dark", shouldBeDark);
}
