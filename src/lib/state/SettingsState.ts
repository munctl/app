import { observable, syncState, when } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { Platform } from "react-native";
import { persistOptions, webPersistOptions } from "~/lib/state/_Shared";

interface SettingsStore {
	serverUrl: string;
	theme: "light" | "dark" | undefined;
	runSeed: boolean;
	currentVersion: number;
	lastSeededVersion: number;
	linkCountdowns: boolean;
}

export const SettingsState$ = observable<SettingsStore>({
	serverUrl: "https://cloud.munctl.app",
	theme: undefined,
	runSeed: true,
	currentVersion: 1,
	lastSeededVersion: 0,
	linkCountdowns: true,
});

Platform.OS !== "web" &&
	(() => {
		syncObservable(
			SettingsState$,
			persistOptions({
				persist: {
					name: "settings",
				},
			}),
		);
	})();
Platform.OS === "web" &&
	(async () => {
		syncObservable(
			SettingsState$,
			webPersistOptions({
				persist: {
					name: "settings",
				},
			}),
		);
		const syncState$ = syncState(SettingsState$);
		await when(syncState$.isPersistLoaded);
	})();
