import { MaterialIcons } from "@expo/vector-icons";
import type { Observable } from "@legendapp/state";
import { For, Show, useObservable } from "@legendapp/state/react";
import dayjs from "dayjs";
import type { Router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/src/components/ReanimatedSwipeable";
import { StyledPressable } from "~/components/StyledPressable";
import CommitteeForm from "~/components/committee/CommitteeFormComponent";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { Muted, P } from "~/components/ui/typography";
import type { Committee } from "~/lib/committee/Committee";
import { updateCommittee } from "~/lib/state/CommitteeState";

export default function CommitteeListComponent({
	router,
	state,
}: { router: Router; state: Observable<Map<string, Committee>> }) {
	const [editDialogOpen, setEditDialogOpen] = useState(false);

	const selectedData = useObservable<
		Pick<Committee, "name" | "id" | "delegations"> & Partial<Committee>
	>({
		id: "",
		name: "",
		delegations: [],
	});

	function handleSubmit() {
		if (selectedData.id.peek().length < 1) return;
		if (selectedData.name.peek().length < 1) {
			alert("Please enter a name for the committee.");
			return;
		}
		if (selectedData.delegations.peek().length < 1) {
			alert("Please add at least one delegation to the committee.");
			return;
		}

		updateCommittee(selectedData.peek());
		setEditDialogOpen(false);
	}
	return (
		<>
			<Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
				<DialogContent className="w-screen">
					<DialogHeader>
						<DialogTitle>Edit Committee</DialogTitle>
					</DialogHeader>
					<CommitteeForm state={selectedData} />
					<DialogFooter className="flex flex-row flex-wrap spacing-submit">
						<DialogClose asChild className="grow">
							<Button variant="outline">
								<Text>Cancel</Text>
							</Button>
						</DialogClose>
						<Button className="grow" onPress={handleSubmit}>
							<Text>Save</Text>
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<View className="flex flex-col gap-y-2">
				<Show
					ifReady={state}
					else={() => <Muted>You are not a member of any committees.</Muted>}
				>
					<For each={state}>
						{(committee) => (
							<ReanimatedSwipeable
								key={committee.id.peek()}
								enableTrackpadTwoFingerGesture
								renderLeftActions={() => (
									<StyledPressable
										className="flex items-center justify-center bg-primary w-20 rounded-md"
										onPress={() => {
											selectedData.set({
												id: committee.id.peek(),
												name: committee.name.peek(),
												delegations: committee.delegations.peek(),
											});
											setEditDialogOpen(true);
										}}
									>
										<MaterialIcons name="edit" size={32} color="#fff" />
									</StyledPressable>
								)}
								renderRightActions={() => (
									<StyledPressable
										className="flex items-center justify-center bg-destructive w-20 rounded-md"
										onPress={() => state.delete(committee.id.peek())}
									>
										<MaterialIcons name="delete" size={32} color="#fff" />
									</StyledPressable>
								)}
							>
								<StyledPressable
									onPress={() =>
										router.navigate(`/committee/${committee.id.peek()}`)
									}
								>
									<Card className="w-full">
										<CardHeader>
											<CardTitle>{committee.name.get()}</CardTitle>
											<CardDescription>
												<View className="flex flex-row gap-x-2">
													<Text className="border-r pr-1 border-muted">
														<MaterialIcons name="add" />{" "}
														{dayjs(committee.createdAt.get()).format(
															"MMM D YYYY HH:mm",
														)}{" "}
													</Text>
													<Text>
														<MaterialIcons name="save" />{" "}
														{dayjs(committee.updatedAt.get()).format(
															"MMM D YYYY HH:mm",
														)}
													</Text>
												</View>
												<View className="flex-row gap-x-2 hidden">
													<Text>
														{committee.admins.length}{" "}
														<MaterialIcons name="manage-accounts" />
													</Text>
													<Text>
														{committee.users.length}{" "}
														<MaterialIcons name="person" />
													</Text>
												</View>
											</CardDescription>
										</CardHeader>
										<CardContent>
											<P>
												{committee.delegations.length} Delegation
												{committee.delegations.length !== 1 && "s"}
											</P>
										</CardContent>
									</Card>
								</StyledPressable>
							</ReanimatedSwipeable>
						)}
					</For>
				</Show>
			</View>
		</>
	);
}
