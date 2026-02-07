import { MaterialIcons } from "@expo/vector-icons";
import type { Observable } from "@legendapp/state";
import { For, Show, useObservable } from "@legendapp/state/react";
import CountryPicker, { type Country } from "@munctl/rn-speaker-picker/dist";
import * as Sentry from "@sentry/react-native";
import { useState } from "react";
import { View } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/src/components/ReanimatedSwipeable";
import { StyledExpoImage } from "~/components/StyledExpoImage";
import { StyledMaterialIcon } from "~/components/StyledMaterialIcon";
import { StyledPressable } from "~/components/StyledPressable";
import { Button } from "~/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { Text } from "~/components/ui/text";
import { H4, P, Small } from "~/components/ui/typography";
import type { Caucus } from "~/lib/caucus/Caucus";
import type { DelegationReduced } from "~/lib/delegation/Delegation";

export function UpcomingSpeakersTable({
	state,
	additionalCountries,
	removeSpeaker,
	moveSpeaker,
	potentialSpeakers,
}: {
	state: Observable<Caucus>;
	additionalCountries?: Observable<DelegationReduced[]>;
	removeSpeaker: (index: number) => void;
	moveSpeaker: (index: number, direction: "up" | "down") => void;
	potentialSpeakers: Observable<DelegationReduced[]>;
}) {
	const [showCountryPicker, setShowCountryPicker] = useState(false);
	const upcomingSpeakers = useObservable(() =>
		state.queue.get().length > 1 ? state.queue.get().slice(1) : [],
	);

	function addSpeaker(speaker: Country) {
		state.queue.push({
			name: speaker.name.toString(),
			code: speaker.cca2,
		});
	}

	return (
		<>
			<View className="flex flex-row gap-x-2 items-center">
				<Sentry.Unmask>
					<H4>Upcoming Speakers</H4>
				</Sentry.Unmask>
				<Sentry.Unmask>
					<MaterialIcons
						size={32}
						name="add"
						onPress={() => setShowCountryPicker(true)}
						className="bg-primary rounded-full"
					/>
				</Sentry.Unmask>
			</View>
			<Table>
				<TableHeader>
					<TableRow className="flex flex-row justify-between">
						<TableHead>
							<Text>Speaker</Text>
						</TableHead>
						<TableHead>
							<Text>Actions</Text>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{/* TODO: Fix rearranging */}
					<Show
						ifReady={upcomingSpeakers.length > 0}
						else={() => (
							<Small className="p-4 text-muted-foreground font-normal">
								No upcoming speakers.
							</Small>
						)}
					>
						{() => (
							<For each={upcomingSpeakers}>
								{(speaker, index) => (
									<ReanimatedSwipeable
										key={index}
										renderRightActions={() => (
											<StyledPressable
												className="flex items-center justify-center bg-destructive w-20 rounded-md"
												onPress={() =>
													removeSpeaker(
														state.queue.peek().indexOf(speaker.peek()),
													)
												}
											>
												<MaterialIcons name="delete" size={32} color="#fff" />
											</StyledPressable>
										)}
									>
										<TableRow className="flex flex-row gap-x-2">
											<TableCell className="flex flex-row gap-x-2 flex-wrap grow">
												<StyledExpoImage
													className="w-8 h-8"
													contentFit="contain"
													source={speaker.code.get().toLowerCase()}
												/>
												<P className="text-xl">{speaker.name.get()}</P>
											</TableCell>
											<TableCell className="flex flex-row gap-x-1">
												<Button
													size="sm"
													variant="outline"
													className="px-2"
													onPress={() =>
														moveSpeaker(
															state.queue.peek().indexOf(speaker.peek()),
															"up",
														)
													}
												>
													<StyledMaterialIcon
														name="arrow-upward"
														size={18}
														className="text-foreground"
													/>
												</Button>
												<Button
													disabled={
														state.queue.peek().indexOf(speaker.peek()) ===
														state.queue.peek().length - 1
													}
													size="sm"
													variant="outline"
													className="px-2 mr-2"
													onPress={() =>
														moveSpeaker(
															state.queue.peek().indexOf(speaker.peek()),
															"down",
														)
													}
												>
													<StyledMaterialIcon
														name="arrow-downward"
														size={18}
														className="text-foreground"
													/>
												</Button>
											</TableCell>
										</TableRow>
									</ReanimatedSwipeable>
								)}
							</For>
						)}
					</Show>
				</TableBody>
			</Table>
			<CountryPicker
				list={{ withCallingCode: false, withCurrency: false }}
				countries={{
					showOnly: potentialSpeakers.map((d) => d.id.get()),
					additional: additionalCountries?.get().map(
						(d) =>
							({
								name: d.entity.name,
								cca2: d.entity.code,
							}) as Country,
					),
				}}
				visible={showCountryPicker}
				onClose={() => setShowCountryPicker(false)}
				trigger={{
					render: () => null,
				}}
				onSelect={addSpeaker}
			/>
		</>
	);
}
