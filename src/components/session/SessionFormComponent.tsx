import type { Observable } from "@legendapp/state";
import { View } from "react-native";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { Session } from "~/lib/session/Session";

export default function SessionForm({
	state,
}: {
	state: Observable<Pick<Session, "name">>;
}) {
	return (
		<View>
			<Label>Session Name</Label>
			<Input
				className="border border-gray-300 rounded px-2 py-1 mb-4"
				defaultValue={state.name.get()}
				onChangeText={state.name.set}
			/>
		</View>
	);
}
