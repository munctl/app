import { type Observable, observe } from "@legendapp/state";
import { Show, useObservable, useObserve } from "@legendapp/state/react";
import { useGlobalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import AttendanceComponent from "~/components/session/AttendanceComponent";
import RollCallComponent from "~/components/session/RollCallComponent";
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
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { Small } from "~/components/ui/typography";
import { AttendanceType } from "~/lib/SharedTypes";
import type { Committee } from "~/lib/committee/Committee";
import type { DelegationReduced } from "~/lib/delegation/Delegation";
import type { Session } from "~/lib/session/Session";
import { MainState$ } from "~/lib/state/CommitteeState";

export default function SessionScreen() {
	const params = useGlobalSearchParams();
	const router = useRouter();

	const state =
		MainState$.committees[params.cid as string].sessions[params.sid as string];
	const committeeState = MainState$.committees[params.cid as string];

	const navigation = useNavigation();

	const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
	useEffect(() => {
		navigation.setOptions({
			headerTitle: state?.name.get() ?? "Unknown Session",
		});
	});

	if (!state.get()) {
		return (
			<View className="flex-1 items-center justify-center">
				<Small>Could not find a session with the given ID.</Small>
			</View>
		);
	}

	function launchSession() {
		router.push({
			pathname: "/committee/[cid]/session/[sid]/caucus/[caid]",
			params: {
				cid: params.cid as string,
				sid: params.sid as string,
				caid: params.sid as string,
			},
		});
	}

	const attendanceGroups = useObservable({
		presentVoting: [] as DelegationReduced[],
		present: [] as DelegationReduced[],
		absent: [] as DelegationReduced[],
		reset: () => {
			attendanceGroups.presentVoting.set([]);
			attendanceGroups.present.set([]);
			attendanceGroups.absent.set([]);
		},
	});

	useObserve(() => {
		if (
			typeof committeeState.get() === "undefined" ||
			committeeState.delegations.length < 1 ||
			typeof committeeState.delegations.get() === "undefined"
		) {
			return;
		}
		attendanceGroups.reset();

		for (const delegation of committeeState.delegations.get() as DelegationReduced[]) {
			if (typeof delegation === "undefined") return;

			const attendance = state.attendance.get(delegation)?.get();
			if (attendance === AttendanceType.PRESENT_VOTING) {
				attendanceGroups.presentVoting.push(delegation);
			} else if (attendance === AttendanceType.PRESENT) {
				attendanceGroups.present.push(delegation);
			} else {
				attendanceGroups.absent.push(delegation);
			}
		}
	});

	return (
		<>
			<Dialog
				open={attendanceDialogOpen}
				onOpenChange={setAttendanceDialogOpen}
			>
				<DialogContent className="w-screen">
					<ScrollView className="mt-6">
						<DialogHeader className="mb-4">
							<DialogTitle>Roll Call</DialogTitle>
							<DialogDescription>{state.name.get()}</DialogDescription>
						</DialogHeader>
						<RollCallComponent
							onSubmit={() => setAttendanceDialogOpen(false)}
							onCancel={() => setAttendanceDialogOpen(false)}
							attendance={state.attendance as Observable<Session["attendance"]>}
							delegations={
								committeeState.delegations as Observable<
									Committee["delegations"]
								>
							}
						/>
					</ScrollView>
				</DialogContent>
			</Dialog>
			<ScrollView>
				<View className="p-4">
					<Card>
						<CardHeader>
							<CardTitle>{state.name.get()}</CardTitle>
							<CardDescription>
								Committee: {committeeState.name.get()}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<AttendanceComponent
								className="mb-4"
								attendance={state.attendance}
								attendanceGroups={attendanceGroups}
							/>
							<View className="mb-8">
								<Button
									className="mt-2"
									size="sm"
									variant={
										state.attendance.size < committeeState.delegations.length
											? "default"
											: "outline"
									}
									onPress={() => setAttendanceDialogOpen(true)}
								>
									<Text className="mx-auto">
										{state.attendance.size < committeeState.delete.length
											? "Roll Call"
											: "Repeat Roll Call"}
									</Text>
								</Button>
							</View>
							<Show ifReady={state.attendance}>
								<Button onPress={launchSession}>
									<Text>Launch Session</Text>
								</Button>
							</Show>
						</CardContent>
					</Card>
				</View>
			</ScrollView>
		</>
	);
}
