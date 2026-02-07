import type { Observable } from "@legendapp/state";
import { For, Show, useObservable } from "@legendapp/state/react";
import dayjs from "dayjs";
import type { Router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/src/components/ReanimatedSwipeable";
import { StyledMaterialIcon } from "~/components/StyledMaterialIcon";
import { StyledPressable } from "~/components/StyledPressable";
import SessionForm from "~/components/session/SessionFormComponent";
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
import { Muted, P, Small } from "~/components/ui/typography";
import type { AttendanceType } from "~/lib/SharedTypes";
import type { Caucus } from "~/lib/caucus/Caucus";
import type { DelegationReduced } from "~/lib/delegation/Delegation";
import type { Session } from "~/lib/session/Session";
import { MainState$ } from "~/lib/state/CommitteeState";

export default function SessionListComponent({
	router,
	committeeId,
	state,
}: {
	router: Router;
	committeeId: string;
	state: Observable<Map<string, Session>>;
}) {
	// TODO: Calculate attendance data for each session
	const attendance = useObservable(
		new Map<
			string,
			{
				presentVoting: number;
				present: number;
				absent: number;
			}
		>(),
	);

	/*observe(() => {
		for (const session of state.values()) {
			const data = { presentVoting: 0, present: 0, absent: 0 };
			for (const state of session.attendance.values()) {
				switch (state) {
					case AttendanceType.PRESENT_VOTING:
						data.presentVoting++;
						break;
					case AttendanceType.PRESENT:
						data.present++;
						break;
					case AttendanceType.ABSENT:
						data.absent++;
						break;
				}
			}
			attendance.set(session.id, data);
		}
	});*/

	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const selectedData = useObservable<
		Pick<Session, "name" | "id"> & Partial<Session>
	>({
		id: "",
		name: "",
	});

	function handleSubmit() {
		if (!selectedData.id.peek() || selectedData.id.peek().length < 1) return;
		if (!selectedData.name.peek() || selectedData.name.peek().length < 1) {
			alert("Please enter a name for the session.");
			return;
		}

		MainState$.committees[committeeId].sessions.set(selectedData.id.peek(), {
			...selectedData.peek(),
			startDate: new Date(),
			endDate: new Date(),
			createdAt: new Date(),
			updatedAt: new Date(),
			caucuses: new Map<string, Caucus>(),
			attendance: new Map<DelegationReduced, AttendanceType>(),
		});
		setEditDialogOpen(false);
	}

	return (
		<>
			<Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
				<DialogContent className="w-screen">
					<DialogHeader>
						<DialogTitle>Edit Session</DialogTitle>
					</DialogHeader>
					<SessionForm state={selectedData} />
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

			<Show
				ifReady={state}
				else={() => (
					<Muted>This committee does not have any associated sessions.</Muted>
				)}
			>
				<View className="flex flex-col gap-y-2">
					<For each={state}>
						{(session) => (
							<ReanimatedSwipeable
								key={session.id.peek()}
								enableTrackpadTwoFingerGesture
								renderLeftActions={() => (
									<StyledPressable
										className="flex items-center justify-center bg-primary w-20 rounded-md"
										onPress={() => {
											selectedData.set({
												id: session.id.peek(),
												name: session.name.peek(),
											});
											setEditDialogOpen(true);
										}}
									>
										<StyledMaterialIcon name="edit" size={32} color="#fff" />
									</StyledPressable>
								)}
								renderRightActions={() => (
									<StyledPressable
										className="flex items-center justify-center bg-destructive w-20 rounded-md"
										onPress={() => state.delete(session.id.peek())}
									>
										<StyledMaterialIcon name="delete" size={32} color="#fff" />
									</StyledPressable>
								)}
							>
								<StyledPressable
									onPress={() =>
										router.navigate(
											`/committee/${committeeId}/session/${session.id.peek()}`,
										)
									}
								>
									<Card className="w-full">
										<CardHeader>
											<CardTitle>{session.name.get()}</CardTitle>
											<CardDescription className="flex flex-wrap items-center">
												<StyledMaterialIcon
													className="text-muted-foreground"
													name="create"
													size={12}
												/>{" "}
												{dayjs(session.createdAt.get()).format(
													"MMM D YYYY HH:mm",
												)}{" "}
												|{" "}
												<StyledMaterialIcon
													className="text-muted-foreground"
													name="save"
												/>{" "}
												{dayjs(session.updatedAt.get()).format(
													"MMM D YYYY HH:mm",
												)}
											</CardDescription>
										</CardHeader>
										<CardContent className="hidden">
											<P>
												<StyledMaterialIcon name="timer" />{" "}
												{dayjs(session.startDate.get()).format(
													"MMM D YYYY HH:mm",
												)}
												{"\n"}
												to{" "}
												{dayjs(session.endDate.get()).format(
													"MMM D YYYY HH:mm",
												)}
												{"\n\n"}
												{attendance[session.id.peek()].presentVoting.get()}{" "}
												Voting | {attendance[session.id.peek()].present.get()}{" "}
												Present | {attendance[session.id.peek()].absent.get()}{" "}
												Absent
											</P>
										</CardContent>
									</Card>
								</StyledPressable>
							</ReanimatedSwipeable>
						)}
					</For>
				</View>
			</Show>
		</>
	);
}
