import type { Observable, ObservablePrimitive } from "@legendapp/state";
import * as Sentry from "@sentry/react-native";
import { useGlobalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { ScrollView, View } from "react-native";
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
import useCountdown from "~/lib/caucus/useCountdown";
import type { Committee } from "~/lib/committee/Committee";
import type { DelegationReduced } from "~/lib/delegation/Delegation";
import { moveItem } from "~/lib/moveItem";
import { MainState$ } from "~/lib/state/CommitteeState";

export default function GSLCaucus({
	state,
	committeeState,
}: { state: Observable<Caucus>; committeeState: Observable<Committee> }) {
	const params = useGlobalSearchParams();

	const speakerCountdown = useCountdown(
		state.currentSpeakerTime as ObservablePrimitive<number>,
	);

	const navigation = useNavigation();
	useEffect(() => {
		navigation.setOptions({
			headerTitle: "General Speakers List",
		});
	});

	const moveSpeaker = (index: number, direction: "up" | "down") => {
		state.queue.set(moveItem(state.queue.peek(), index, direction));
	};
	const removeSpeaker = (index: number) => {
		state.queue.set(state.queue.peek().filter((_, i) => i !== index));
	};

	return (
		<ScrollView>
			<View className="p-4">
				<Card>
					<CardHeader>
						<Sentry.Unmask>
							<CardTitle>General Speakers List</CardTitle>
							<CardDescription>{state.topic.get()}</CardDescription>
						</Sentry.Unmask>
					</CardHeader>
					<CardContent className="lg:grid grid-cols-3 gap-8 min-h-64">
						<ActiveSpeakerComponent
							state={state as Observable<Caucus>}
							speakerCountdown={speakerCountdown}
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
