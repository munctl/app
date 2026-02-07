import type { Observable } from "@legendapp/state";
import { View } from "react-native";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Muted } from "~/components/ui/typography";
import { type Caucus, CaucusType } from "~/lib/caucus/Caucus";

export default function CaucusForm({
	state,
}: {
	state: Observable<
		Pick<Caucus, "topic" | "initialSpeakerTime" | "initialCaucusTime" | "type">
	>;
}) {
	return (
		<View className="flex gap-y-4">
			<View>
				<Label>Caucus Topic</Label>
				<Input
					defaultValue={state.topic.get()}
					onChangeText={state.topic.set}
				/>
			</View>
			{state.type.get() !== CaucusType.GSL && (
				<View>
					<Label>Caucus Time (seconds)</Label>
					<Muted className="mb-2">
						This will reset the remaining caucus time to this value.
					</Muted>
					<Input
						keyboardType="numeric"
						defaultValue={state.initialCaucusTime.get()?.toString()}
						onChangeText={(v) =>
							state.initialCaucusTime.set(Number.parseInt(v))
						}
					/>
				</View>
			)}
			{state.type.get() !== CaucusType.UNMODERATED && (
				<View>
					<Label>Speaker Time (seconds)</Label>
					<Input
						keyboardType="numeric"
						defaultValue={state.initialSpeakerTime.get()?.toString()}
						onChangeText={(v) =>
							state.initialSpeakerTime.set(Number.parseInt(v))
						}
					/>
				</View>
			)}
		</View>
	);
}
