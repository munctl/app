import { MaterialIcons } from "@expo/vector-icons";
import { For, useObservable } from "@legendapp/state/react";
import { randomUUID } from "expo-crypto";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReanimatedSwipeable from "react-native-gesture-handler/src/components/ReanimatedSwipeable";
import { StyledMaterialIcon } from "~/components/StyledMaterialIcon";
import { StyledPressable } from "~/components/StyledPressable";
import CaucusForm from "~/components/caucus/CaucusFormComponent";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { type Caucus, CaucusType } from "~/lib/caucus/Caucus";
import { MainState$ } from "~/lib/state/CommitteeState";

export default function CaucusDrawer() {
	const params = useGlobalSearchParams();
	const router = useRouter();
	const state =
		MainState$.committees[params.cid as string].sessions[params.sid as string]
			.caucuses;

	const [drawerType, setDrawerType] = useState<"select" | "create">("select");
	const [drawerOpen, setDrawerOpen] = useState(false);

	const handleAddCaucus = (type: CaucusType) => {
		// TODO: PROTOTYPING-CODE-MARKER
		const uuid = randomUUID();
		state.set(uuid, {
			id: uuid,
			type: type,
			topic: "Undefined Topic",
			initialCaucusTime: 600,
			currentCaucusTime: 600,
			initialSpeakerTime: type !== CaucusType.UNMODERATED ? 60 : undefined,
			currentSpeakerTime: type !== CaucusType.UNMODERATED ? 60 : undefined,
			queue: [],
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		setDrawerOpen(false);
		router.replace(
			`/committee/${params.cid as string}/session/${params.sid as string}/caucus/${uuid}`,
		);
	};

	const handleAddVote = () => {};

	const handleDelete = (id: string) => {
		state?.delete(id);
		if (params.caid === id) {
			useRouter().push(
				`/committee/${params.cid as string}/session/${params.sid as string}/caucus/${params.sid as string}`,
			);
		}
	};

	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const selectedData = useObservable<
		Pick<
			Caucus,
			"topic" | "initialCaucusTime" | "initialSpeakerTime" | "type"
		> &
			Partial<Caucus>
	>({
		id: "",
		topic: "",
		initialSpeakerTime: 60,
		initialCaucusTime: 600,
		type: CaucusType.GSL,
	});

	function handleSubmit() {
		if (!selectedData.id) return;
		const caucus = state.get(selectedData.id.peek() ?? "").peek();
		if (!caucus) return;

		state.set(selectedData.id.peek() as string, {
			...caucus,
			...selectedData.peek(),
			initialCaucusTime: selectedData.initialCaucusTime.peek(),
			currentCaucusTime:
				selectedData.initialCaucusTime.peek() !== caucus.initialCaucusTime
					? selectedData.initialCaucusTime.peek()
					: caucus.initialCaucusTime,
			initialSpeakerTime: selectedData.initialSpeakerTime.peek(),
			currentSpeakerTime:
				selectedData.initialSpeakerTime.peek() !== caucus.initialSpeakerTime
					? selectedData.initialSpeakerTime.peek()
					: caucus.initialSpeakerTime,
			updatedAt: new Date(),
		});
		setEditDialogOpen(false);
	}

	return (
		<>
			<Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
				<DialogContent className="w-screen">
					<DialogHeader>
						<DialogTitle>Edit Caucus</DialogTitle>
					</DialogHeader>
					<CaucusForm state={selectedData} />
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
			<View className="w-full px-4 mt-2">
				<View className="flex flex-row flex-wrap gap-x-2">
					<Button
						className="flex grow flex-row items-center justify-between bg-card border border-border"
						onPress={() => {
							setDrawerOpen(true);
							setDrawerType("select");
						}}
					>
						<Text className="text-base font-semibold text-muted-foreground">
							{state.get()?.get(params.caid as string)?.topic ||
								"Select Caucus"}
						</Text>
						<StyledMaterialIcon
							size={24}
							name="arrow-drop-down"
							className="text-muted-foreground"
						/>
					</Button>
					<Button
						className="flex flex-row items-center bg-card justify-center border border-border"
						onPress={() => {
							setDrawerOpen(true);
							setDrawerType("create");
						}}
					>
						<StyledMaterialIcon
							size={24}
							name="add"
							className="text-muted-foreground"
						/>
					</Button>
				</View>
				<Modal
					visible={drawerOpen}
					animationType="slide"
					transparent
					onRequestClose={() => setDrawerOpen(false)}
				>
					<Pressable
						className="flex-1 bg-black/40"
						onPress={() => setDrawerOpen(false)}
					/>
					<View className="absolute left-0 right-0 bottom-0 bg-popover rounded-t-2xl p-5 shadow-lg pb-8 max-h-[70%]">
						<GestureHandlerRootView>
							<View className={drawerType === "select" ? "block" : "hidden"}>
								<Text className="text-lg font-bold mb-2 text-foreground">
									Select Activity
								</Text>
								<View className="flex flex-col gap-y-2">
									<For each={state}>
										{(caucus) => (
											<ReanimatedSwipeable
												key={caucus.id.peek()}
												renderLeftActions={() => (
													<StyledPressable
														className="flex items-center justify-center bg-primary w-20 h-12 rounded-md p-0"
														onPress={() => {
															setDrawerOpen(false);
															selectedData.set({
																...caucus.peek(),
															});
															setEditDialogOpen(true);
														}}
													>
														<MaterialIcons name="edit" size={22} color="#fff" />
													</StyledPressable>
												)}
												renderRightActions={() =>
													caucus.type.peek() === CaucusType.GSL ? undefined : (
														<StyledPressable
															className="flex items-center justify-center bg-destructive w-20 h-12 rounded-md p-0"
															onPress={() => handleDelete(caucus.id.peek())}
														>
															<MaterialIcons
																name="delete"
																size={22}
																color="#fff"
															/>
														</StyledPressable>
													)
												}
											>
												<StyledPressable
													onPress={() => {
														if (params.caid === caucus.id.peek()) {
															setDrawerOpen(false);
															return;
														}
														router.replace(
															`/committee/${params.cid as string}/session/${params.sid as string}/caucus/${caucus.id.peek()}`,
														);
														setDrawerOpen(false);
													}}
												>
													<Button
														className={`grow flex items-center justify-center flex-row gap-x-1 ${params.caid === caucus.id.peek() ? "bg-primary" : " bg-muted"}`}
													>
														<MaterialIcons
															color="#fff"
															size={18}
															name={
																caucus.type.get() === CaucusType.GSL
																	? "dehaze"
																	: caucus.type.get() === CaucusType.MODERATED
																		? "mic"
																		: "group"
															}
														/>
														<Text className="text-primary-foreground">
															{caucus.topic.get()}
														</Text>
													</Button>
												</StyledPressable>
											</ReanimatedSwipeable>
										)}
									</For>
								</View>
							</View>
							<View className={drawerType === "create" ? "block" : "hidden"}>
								<Text className="text-lg font-bold text-foreground mb-2">
									Create
								</Text>
								<View className="flex flex-col flex-wrap gap-y-2">
									<Button
										onPress={() => handleAddCaucus(CaucusType.MODERATED)}
										className="flex flex-row gap-x-1 w-full bg-secondary"
									>
										<StyledMaterialIcon
											name="mic"
											size={18}
											className="text-background"
										/>
										<Text className="text-background">New Moderated</Text>
									</Button>
									<Button
										onPress={() => handleAddCaucus(CaucusType.UNMODERATED)}
										className="flex flex-row gap-x-2 w-full bg-secondary"
									>
										<StyledMaterialIcon
											name="group"
											size={18}
											className="text-background"
										/>
										<Text className="text-background">New Unmoderated</Text>
									</Button>
									<Button
										onPress={() => handleAddVote()}
										className="flex flex-row gap-x-2 w-full bg-secondary hidden"
									>
										<StyledMaterialIcon
											name="how-to-vote"
											size={18}
											className="text-background"
										/>
										<Text className="text-background">New Vote</Text>
									</Button>
								</View>
							</View>
						</GestureHandlerRootView>
					</View>
				</Modal>
			</View>
		</>
	);
}
