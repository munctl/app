import type { Observable, ObservablePrimitive } from "@legendapp/state";
import { Computed } from "@legendapp/state/react";
import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useEffect } from "react";
import { ScrollView, View } from "react-native";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { H2 } from "~/components/ui/typography";
import type { Caucus } from "~/lib/caucus/Caucus";
import { SecondsToTimeString } from "~/lib/caucus/CountdownTime";
import useCountdown from "~/lib/caucus/useCountdown";

import * as Sentry from "@sentry/react-native";
import { Button } from "~/components/ui/button";
import useTimeColors from "~/lib/caucus/useTimeColors";

export default function UnmoderatedCaucus({
	state,
}: { state: Observable<Caucus> }) {
	const caucusCountdown = useCountdown(
		state.currentCaucusTime as ObservablePrimitive<number>,
	);

	const navigation = useNavigation();
	useEffect(() => {
		navigation.setOptions({
			headerTitle: "Unmoderated Caucus",
		});
	});

	return (
		<ScrollView>
			<View className="p-4">
				<Card>
					<CardHeader className="mx-auto">
						<CardTitle className="text-center">Unmoderated Caucus</CardTitle>
						<CardDescription className="text-center">
							{state.topic.get()}
						</CardDescription>
					</CardHeader>
					<CardContent className="lg:grid grid-cols-3 gap-8">
						<Sentry.Unmask>
							<H2
								className={`border-0 mx-auto text-5xl font-bold ${useTimeColors(state.currentSpeakerTime as ObservablePrimitive<number>)}`}
							>
								<Computed>
									{() =>
										SecondsToTimeString(state.currentCaucusTime.get() as number)
									}
								</Computed>{" "}
								<Text className="text-muted-foreground text-5xl font-medium">
									/{" "}
									<Computed>
										{() =>
											SecondsToTimeString(
												state.initialCaucusTime.get() as number,
											)
										}
									</Computed>
								</Text>
							</H2>
						</Sentry.Unmask>
						<Sentry.Unmask>
							<View className="flex flex-row gap-x-2">
								<Button
									className="w-1/2"
									onPress={() => caucusCountdown.toggle()}
								>
									<Text>
										<Computed>
											{() =>
												caucusCountdown.active.get() ? "Pause" : "Resume"
											}
										</Computed>
									</Text>
								</Button>
								<Button
									className="w-1/2"
									onPress={() =>
										caucusCountdown.reset(
											state.initialCaucusTime.get() as number,
										)
									}
								>
									<Text>Reset</Text>
								</Button>
							</View>
						</Sentry.Unmask>
					</CardContent>
				</Card>
			</View>
		</ScrollView>
	);
}
