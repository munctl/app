import { observable, syncState, when } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { Platform } from "react-native";
import type { Committee } from "~/lib/committee/Committee";
import { SettingsState$ } from "~/lib/state/SettingsState";
import { persistOptions, webPersistOptions } from "~/lib/state/_Shared";

interface MainStore {
	compatibility: number;
	committees: Map<string, Committee>;
}

export function addCommittee(committee: Committee) {
	MainState$.committees.set(committee.id, committee);
}
export function updateCommittee(
	committee: Partial<Committee> & Pick<Committee, "id">,
) {
	const prev = MainState$.committees.peek();
	MainState$.committees.set(committee.id, {
		...prev.get(committee.id),
		...committee,
		updatedAt: new Date(),
	} as Committee);
}

export const MainState$ = observable<MainStore>({
	compatibility: 1,
	committees: new Map<string, Committee>(),
});
Platform.OS !== "web" &&
	syncObservable(
		MainState$,
		persistOptions({
			persist: {
				name: "main",
			},
		}),
	);
Platform.OS === "web" &&
	(async () => {
		syncObservable(
			SettingsState$,
			webPersistOptions({
				persist: {
					name: "main",
				},
			}),
		);
		const syncState$ = syncState(MainState$);
		await when(syncState$.isPersistLoaded);
	})();
