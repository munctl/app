import type { Observable, ObservablePrimitive } from "@legendapp/state";
import { use$ } from "@legendapp/state/react";
import * as Sentry from "@sentry/react-native";
import { useGlobalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { ActiveSpeakerComponent } from "~/components/caucus/ActiveSpeakerComponent";
import { UpcomingSpeakersTable } from "~/components/caucus/UpcomingSpeakersTable";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import type { Caucus } from "~/lib/caucus/Caucus";
import { SecondsToTimeString } from "~/lib/caucus/CountdownTime";
import useCountdown from "~/lib/caucus/useCountdown";
import useTimeColors from "~/lib/caucus/useTimeColors";
import type { Committee } from "~/lib/committee/Committee";
import type { DelegationReduced } from "~/lib/delegation/Delegation";
import { moveItem } from "~/lib/moveItem";
import { MainState$ } from "~/lib/state/CommitteeState";
import { SettingsState$ } from "~/lib/state/SettingsState";

export default function GSLCaucus({
	state,
	committeeState,
}: { state: Observable<Caucus>; committeeState: Observable<Committee> }) {
	const params = useGlobalSearchParams();

	const speakerCountdown = useCountdown(
		state.currentSpeakerTime as ObservablePrimitive<number>,
	);
	const caucusCountdown = useCountdown(
		state.currentCaucusTime as ObservablePrimitive<number>,
		SettingsState$.linkCountdowns.get() ? speakerCountdown.active : undefined,
	);

	const navigation = useNavigation();
	useEffect(() => {
		navigation.setOptions({
			headerTitle: `Moderated Caucus: ${state.topic.get()}`,
		});
	});

	const moveSpeaker = (index: number, direction: "up" | "down") => {
		state.queue.set(moveItem(state.queue.peek(), index, direction));
	};
	const removeSpeaker = (index: number) => {
		state.queue.set(state.queue.peek().filter((_, i) => i !== index));
	};

	const initialSpeakerTimeString = use$(() =>
		SecondsToTimeString(state.initialCaucusTime.get() as number),
	);
	const speakerTimeRemainingString = use$(() =>
		SecondsToTimeString(state.currentCaucusTime.get() as number),
	);

	return (
		<ScrollView>
			<View className="p-4">
				<Card>
					<CardHeader>
						<Sentry.Unmask>
							<CardTitle className="leading-tight">
								Moderated Caucus{"\n"}
								<Text
									className={`font-bold ${useTimeColors(state.currentCaucusTime as ObservablePrimitive<number>)}`}
								>
									{speakerTimeRemainingString}
								</Text>
								<Text className="text-muted-foreground">
									{" "}
									/ {initialSpeakerTimeString}
								</Text>
							</CardTitle>
							<CardDescription>{state.topic.get()}</CardDescription>
						</Sentry.Unmask>
					</CardHeader>
					<CardContent className="lg:grid grid-cols-3 gap-8">
						<ActiveSpeakerComponent
							state={state}
							speakerCountdown={speakerCountdown}
							caucusCountdown={caucusCountdown}
						/>
						<View className="order-1 col-span-2">
							<UpcomingSpeakersTable
								removeSpeaker={removeSpeaker}
								state={state}
								additionalCountries={committeeState.delegations}
								moveSpeaker={moveSpeaker}
								potentialSpeakers={
									MainState$.committees[params.cid as string]
										.delegations as Observable<DelegationReduced[]>
								}
							/>
						</View>
					</CardContent>
				</Card>
			</View>
		</ScrollView>
	);
}
