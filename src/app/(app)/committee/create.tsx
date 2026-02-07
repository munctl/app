import { useObservable } from "@legendapp/state/react";
import { randomUUID } from "expo-crypto";
import { useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import CommitteeForm from "~/components/committee/CommitteeFormComponent";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { H2 } from "~/components/ui/typography";
import type { Committee } from "~/lib/committee/Committee";
import type { Session } from "~/lib/session/Session";
import { addCommittee } from "~/lib/state/CommitteeState";

export default function CreateCommitteePage() {
	const router = useRouter();
	const navigation = useNavigation();
	useEffect(() => {
		navigation.setOptions({
			headerTitle: "Create Committee",
		});
	}, [navigation.setOptions]);

	const createState = useObservable<
		Pick<Committee, "name" | "delegations"> &
			Partial<Committee> & {
				clear: () => void;
			}
	>({
		name: "",
		delegations: [],
		clear: () => {
			createState.name.set("");
			createState.delegations.set([]);
		},
	});

	function onSubmit() {
		if (createState.name.peek().length < 1) {
			alert("Please enter a name for the committee.");
			return;
		}
		if (createState.delegations.peek().length < 1) {
			alert("Please add at least one delegation to the committee.");
			return;
		}
		/*
        TODO: This is a temporary implementation. On the production app (if connected to a syncing backend), creating a new committee sends a request to the backend instead of generating the UUID, etc., locally since this is unsafe.
         */
		addCommittee({
			...createState.peek(),
			id: randomUUID(),
			createdAt: new Date(),
			updatedAt: new Date(),
			sessions: new Map<string, Session>(),
			admins: [],
			users: [],
		} as Committee);

		router.back();
	}

	return (
		<View className="p-4">
			<H2 className="mb-4 border-0">Create Committee</H2>
			<CommitteeForm state={createState} />
			<View className="flex flex-row gap-2 spacing-submit">
				<Button className="bg-muted grow" onPress={() => router.back()}>
					<Text>Cancel</Text>
				</Button>
				<Button onPress={onSubmit} className="grow">
					<Text>Create</Text>
				</Button>
			</View>
		</View>
	);
}
