import { MaterialIcons } from "@expo/vector-icons";
import type { Observable } from "@legendapp/state";
import { For, Show, useObservable } from "@legendapp/state/react";
import dayjs from "dayjs";
import { randomUUID } from "expo-crypto";
import {
	Link,
	useGlobalSearchParams,
	useNavigation,
	useRouter,
} from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { StyledExpoImage } from "~/components/StyledExpoImage";
import SessionListComponent from "~/components/committee/SessionListComponent";
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
	DialogTrigger,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { H4, Muted, Small } from "~/components/ui/typography";
import type { AttendanceType } from "~/lib/SharedTypes";
import { type Caucus, CaucusType } from "~/lib/caucus/Caucus";
import type { DelegationReduced } from "~/lib/delegation/Delegation";
import type { Session } from "~/lib/session/Session";
import { MainState$ } from "~/lib/state/CommitteeState";

export default function CommitteeScreen() {
	const params = useGlobalSearchParams();
	const navigation = useNavigation();
	const router = useRouter();
	const state = MainState$.committees[params.cid as string];

	useEffect(() => {
		navigation.setOptions({
			headerTitle: state.name.get() ?? "Unknown Committee",
		});
	});

	if (!state) {
		return (
			<View className="flex-1 items-center justify-center">
				<Small>Could not find a committee with the given ID.</Small>
			</View>
		);
	}

	const createState = useObservable<
		Pick<Session, "name"> &
			Partial<Session> & {
				clear: () => void;
			}
	>({
		name: "",
		clear: () => {
			createState.name.set("");
		},
	});

	const [createModalOpen, setCreateModalOpen] = useState(false);

	function handleSubmit() {
		if (!createState.name.get()) {
			alert("Please enter a session name.");
			return;
		}

		const uuid = randomUUID();
		state.sessions.set(uuid, {
			id: uuid,
			name: createState.name.get(),
			createdAt: new Date(),
			updatedAt: new Date(),
			startDate: new Date(),
			endDate: new Date(),
			caucuses: new Map<string, Caucus>([
				[
					uuid,
					{
						id: uuid,
						topic: "General Speakers List",
						type: CaucusType.GSL,
						createdAt: new Date(),
						updatedAt: new Date(),
						queue: [],
						initialSpeakerTime: 60,
						currentSpeakerTime: 60,
					},
				],
			]),
			attendance: new Map<DelegationReduced, AttendanceType>(),
		});
		setCreateModalOpen(false);
		createState.clear();
	}

	return (
		<ScrollView>
			<View className="p-4">
				<Card>
					<CardHeader>
						<CardTitle>{state.name.get()}</CardTitle>
						<CardDescription>
							Created {dayjs(state.createdAt.get()).format("YYYY-MM-DD HH:mm")}
							{"\n"}Modified{" "}
							{dayjs(state.updatedAt.get()).format("YYYY-MM-DD HH:mm")}
						</CardDescription>
					</CardHeader>
					<CardContent className="flex gap-y-8">
						<View>
							<View className="mb-2 flex flex-row items-center gap-x-2">
								<H4>Sessions</H4>
								<Dialog
									open={createModalOpen}
									onOpenChange={(e) => {
										setCreateModalOpen(e);
										if (!e) createState.clear();
									}}
								>
									<DialogTrigger>
										<MaterialIcons
											size={24}
											name="add"
											className="bg-primary rounded-full"
										/>
									</DialogTrigger>
									<DialogContent className="w-screen">
										<DialogHeader>
											<DialogTitle>Create Session</DialogTitle>
										</DialogHeader>
										<SessionForm state={createState} />
										<DialogFooter className="flex flex-row flex-wrap justify-between gap-x-2">
											<DialogClose asChild>
												<Button className="bg-muted grow">
													<Text>Cancel</Text>
												</Button>
											</DialogClose>
											<Button onPress={handleSubmit} className="grow">
												<Text>Create</Text>
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							</View>
							<SessionListComponent
								router={router}
								committeeId={params.cid as string}
								state={state.sessions}
							/>
						</View>
						<View>
							<H4 className="mb-2">Delegations</H4>
							<View className="flex flex-wrap flex-col gap-y-2">
								<Show
									ifReady={state.delegations}
									else={() => <Muted>No delegations yet.</Muted>}
								>
									{() => (
										<For
											each={
												state.delegations as Observable<DelegationReduced[]>
											}
										>
											{(delegation) => (
												<Link
													href={{
														pathname: "/(app)/committee/[cid]/delegation/[did]",
														params: {
															cid: params.cid as string,
															did: delegation.id.peek(),
														},
													}}
													className="w-full"
												>
													<Card className="w-full">
														<CardContent className="py-2 flex-row justify-between text-foreground">
															<View className="flex-row gap-x-2 items-center">
																<StyledExpoImage
																	className="size-6"
																	contentFit="contain"
																	source={{
																		uri: (delegation.isCustom.get()
																			? undefined
																			: delegation.entity.code
																					.get()
																					.toLowerCase()
																		)?.replace("do", "flag_do"),
																	}}
																/>
																<Text>{delegation.entity.name.get()}</Text>
															</View>
															<ChevronRight className="text-muted-foreground" />
														</CardContent>
													</Card>
												</Link>
											)}
										</For>
									)}
								</Show>
							</View>
						</View>
					</CardContent>
				</Card>
			</View>
		</ScrollView>
	);
}
