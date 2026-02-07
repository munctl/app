import type { Observable } from "@legendapp/state";
import { Show, Switch } from "@legendapp/state/react";
import { useKeepAwake } from "expo-keep-awake";
import { useGlobalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import CaucusDrawer from "~/components/caucus/CaucusMenubar";
import GSLCaucus from "~/components/caucus/gsl";
import ModeratedCaucus from "~/components/caucus/moderated";
import UnmoderatedCaucus from "~/components/caucus/unmoderated";
import { Small } from "~/components/ui/typography";
import { type Caucus, CaucusType } from "~/lib/caucus/Caucus";
import type { Committee } from "~/lib/committee/Committee";
import { MainState$ } from "~/lib/state/CommitteeState";

export default function CaucusPage() {
	const params = useGlobalSearchParams();
	const committeeState = MainState$.committees[params.cid as string];
	const state =
		committeeState.sessions[params.sid as string].caucuses[
			params.caid as string
		];

	const navigation = useNavigation();
	useEffect(() => {
		navigation.setOptions({
			headerTitle: "Caucuses",
		});
	});

	useKeepAwake();
	return (
		<Show
			ifReady={state && committeeState}
			else={() => (
				<>
					<CaucusDrawer />
					<View className="min-h-screen flex-1 items-center justify-center">
						<CaucusDrawer />
						<View className="flex-1 items-center justify-center">
							<Small>Could not find a caucus with the given ID.</Small>
						</View>
					</View>
				</>
			)}
		>
			<View className="flex-1">
				<CaucusDrawer />
				<View className="flex-1">
					<Switch value={state.type}>
						{{
							[CaucusType.GSL]: () => (
								<GSLCaucus
									state={state as Observable<Caucus>}
									committeeState={committeeState as Observable<Committee>}
								/>
							),
							[CaucusType.MODERATED]: () => (
								<ModeratedCaucus
									state={state as Observable<Caucus>}
									committeeState={committeeState as Observable<Committee>}
								/>
							),
							[CaucusType.UNMODERATED]: () => (
								<UnmoderatedCaucus state={state as Observable<Caucus>} />
							),
						}}
					</Switch>
				</View>
			</View>
		</Show>
	);
}
