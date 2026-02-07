import type { Observable, ObservablePrimitive } from "@legendapp/state";
import { Computed, use$, useObserve } from "@legendapp/state/react";
import * as Sentry from "@sentry/react-native";
import { View } from "react-native";
import { StyledExpoImage } from "~/components/StyledExpoImage";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { H4, P } from "~/components/ui/typography";
import type { Caucus } from "~/lib/caucus/Caucus";
import { SecondsToTimeString } from "~/lib/caucus/CountdownTime";
import type { Countdown } from "~/lib/caucus/useCountdown";
import useTimeColors from "~/lib/caucus/useTimeColors";

export function ActiveSpeakerComponent({
	state,
	speakerCountdown,
	caucusCountdown,
}: {
	state: Observable<Caucus>;
	speakerCountdown: Countdown;
	caucusCountdown?: Countdown;
}) {
	const handleReset = () => {
		if (caucusCountdown) {
			const elapsedSpeakerTime =
				(state.initialSpeakerTime.peek() as number) -
				(state.currentSpeakerTime.peek() as number);
			const compensatedCaucusTime =
				(state.currentCaucusTime.peek() as number) + elapsedSpeakerTime;
			caucusCountdown.reset(compensatedCaucusTime, true);
		}
		speakerCountdown.reset(state.initialSpeakerTime.peek() as number, true);
	};
	const handleNext = () => {
		state.queue.set((state.queue.peek() as []).slice(1));
		speakerCountdown.reset(state.initialSpeakerTime.peek() as number, true);
	};

	const computedWrapperClasses = use$(() =>
		state.queue.length === 0 ? "opacity-50 pointer-events-none" : "",
	);

	const speaker = use$(() =>
		state.queue.length > 0 ? state.queue.get().at(0) : undefined,
	);

	const timeRemainingString = use$(() =>
		SecondsToTimeString(state.currentSpeakerTime.get() as number),
	);
	const totalTimeString = use$(() =>
		SecondsToTimeString(state.initialSpeakerTime.get() as number),
	);

	const handleToggle = () => {
		speakerCountdown.toggle();
		if (speakerCountdown.active.peek()) caucusCountdown?.start();
	};

	return (
		<View
			className={`flex gap-y-2 order-2 items-center justify-center rounded-md overflow-hidden p-2 ${computedWrapperClasses}`}
		>
			<View className="items-center w-full">
				<View>
					{speaker?.code && (
						<StyledExpoImage
							className={"h-32 w-96"}
							contentFit="contain"
							source={speaker.code.toLowerCase()}
						/>
					)}
					<Sentry.Unmask>
						<H4 className="text-center">
							<Computed>
								{() => (state.queue.length > 0 ? speaker?.name : "No Speaker")}
							</Computed>
						</H4>
					</Sentry.Unmask>
					<P className="text-center">
						<Text
							className={`font-semibold ${useTimeColors(state.currentSpeakerTime as ObservablePrimitive<number>)}`}
						>
							{timeRemainingString}
						</Text>
						<Text className="text-muted-foreground"> / {totalTimeString}</Text>
					</P>
				</View>
			</View>
			<View className="flex flex-row gap-x-1">
				<Button
					size="sm"
					onPress={handleToggle}
					disabled={state.queue.length === 0}
				>
					<Sentry.Unmask>
						<Text>
							<Computed>
								{() => (speakerCountdown.active.get() ? "Pause" : "Resume")}
							</Computed>
						</Text>
					</Sentry.Unmask>
				</Button>
				<Button
					size="sm"
					onPress={handleReset}
					disabled={state.queue.length === 0}
				>
					<Sentry.Unmask>
						<Text>Reset</Text>
					</Sentry.Unmask>
				</Button>
				<Button
					size="sm"
					onPress={handleNext}
					disabled={state.queue.length === 0}
				>
					<Sentry.Unmask>
						<Text>Next</Text>
					</Sentry.Unmask>
				</Button>
			</View>
		</View>
	);
}
