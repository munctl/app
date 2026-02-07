import { mergeIntoObservable } from "@legendapp/state";
import { use$ } from "@legendapp/state/react";
import * as DocumentPicker from "expo-document-picker";
import { useNavigation } from "expo-router";
import { Link } from "expo-router";
import * as Sharing from "expo-sharing";
import { AlertTriangleIcon } from "lucide-react-native";
import { useColorScheme as useNativewindColorScheme } from "nativewind/dist/stylesheet";
import { useEffect, useRef, useState } from "react";
import { Platform, ScrollView, View } from "react-native";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Text } from "~/components/ui/text";
import { H1, H4, Muted, P } from "~/components/ui/typography";
import type { Committee } from "~/lib/committee/Committee";
import { DEFAULT_SERVER_URL } from "~/lib/constants";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import runSeed from "~/lib/seed";
import { AccountState$ } from "~/lib/state/AccountState";
import { MainState$ } from "~/lib/state/CommitteeState";
import { SettingsState$ } from "~/lib/state/SettingsState";

export default function HomeScreen() {
	const navigation = useNavigation();
	const { colorScheme, toggleColorScheme } = useNativewindColorScheme();
	useEffect(() => {
		navigation.setOptions({
			headerTitle: "Settings",
		});
	}, [navigation]);

	const hToggleColorScheme = () => {
		toggleColorScheme();
	};

	// Track mount state so we don't write app state for a component that has
	// started unmounting. This avoids warnings when toggleColorScheme leads to
	// async updates that may race with component lifecycle.
	const isMountedRef = useRef(true);
	useEffect(() => {
		return () => {
			isMountedRef.current = false;
		};
	}, []);

	useEffect(() => {
		if (!isMountedRef.current) return;
		SettingsState$.theme.set(colorScheme);
	}, [colorScheme]);

	const [serverUrlDialogOpen, setServerUrlDialogOpen] = useState(false);

	async function importData() {
		try {
			const res = await DocumentPicker.getDocumentAsync({
				type: "application/json",
				copyToCacheDirectory: true,
				multiple: false,
			});
			if (!res.canceled) {
				const successResult = res as DocumentPicker.DocumentPickerSuccessResult;
				let data: ReadableStream;
				if (Platform.OS === "web") {
					console.log(successResult);
				} else {
					const ExpoFile = (await import("expo-file-system/next")).File;
					const file = new ExpoFile(successResult.assets[0].uri);
					data = file?.readableStream();
				}

				// TODO: Add file size limit
				// @ts-ignore
				if (!data) {
					alert("No file selected. Please try again.");
					return;
				}
				const decodedData = new TextDecoder().decode(
					(await data.getReader().read()).value,
				);
				const parsedData = JSON.parse(decodedData) as {
					compatibility: number;
					committees: [string, Committee][];
				};
				if (parsedData?.compatibility !== MainState$.compatibility.peek()) {
					alert(
						"This document is not compatible with the current app version and cannot be imported.",
					);
					return;
				}
				mergeIntoObservable(MainState$, {
					committees: new Map<string, Committee>(parsedData.committees),
				});
				alert("Successfully imported data!");
			}
		} catch (e) {
			console.error("Error picking document:", e);
			alert("Failed to import document. Please try again.");
		}
	}
	async function exportData() {
		try {
			const committees = [...MainState$.committees.peek()];
			const data = JSON.stringify({
				compatibility: MainState$.compatibility.peek(),
				committees: committees,
			});

			if (Platform.OS === "web") {
				const file = new File([data], "export.json", {
					type: "application/json",
				});
				const url = URL.createObjectURL(file);
				window.location.assign(url);
				URL.revokeObjectURL(url);
			} else {
				const File = (await import("expo-file-system/next")).File;
				const Paths = (await import("expo-file-system/next")).Paths;

				const file = new File(Paths.cache, "export.json");
				file.write(data);
				await Sharing.shareAsync(file.uri);
			}
		} catch (e) {
			console.error("Error exporting data:", e);
			alert("Failed to export data. Please try again.");
		}
	}
	return (
		<ScrollView>
			<View className="p-4">
				<View className="flex gap-y-8">
					{/* Your Account Section */}
					<Link
						href={AccountState$.loggedIn.get() ? "/account" : "/login"}
						push
						disabled
					>
						<Card className="w-full">
							<CardContent className="flex flex-col justify-center align-middle py-4">
								<View>
									{AccountState$.loggedIn.get() ? (
										<View className="flex flex-row items-center gap-x-4">
											<Avatar alt="John Doe">
												{AccountState$.avatar.get() && (
													<AvatarImage
														source={{
															uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
														}}
													/>
												)}
												<AvatarFallback className="bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
													<Text>
														{(
															AccountState$.fullName.get() ??
															AccountState$.username.get() ??
															"?"
														)
															.split(" ")
															.slice(0, 2)
															.map((i) => i[0])}
													</Text>
												</AvatarFallback>
											</Avatar>
											<View>
												<H4>
													{AccountState$.fullName.get() ??
														AccountState$.username.get() ??
														"Unknown User"}{" "}
													{AccountState$.fullName.get() &&
														AccountState$.username.get() &&
														`(${AccountState$.username.get()})`}
												</H4>
												<P className="text-muted-foreground">
													{AccountState$.email.get() ?? "No email provided"}
												</P>
											</View>
											<View className="flex-1 items-end">
												<ChevronRight
													className="text-muted-foreground"
													size={24}
												/>
											</View>
										</View>
									) : (
										<View className="flex flex-row items-center gap-x-4">
											<View className="flex flex-row items-center gap-x-4 flex-wrap">
												<Avatar alt="Guest User">
													<AvatarFallback className="bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
														<Text>GU</Text>
													</AvatarFallback>
												</Avatar>
												<View>
													<H4>Guest User</H4>
													<P className="text-muted-foreground">
														Sign in is not available during testing.
													</P>
													<P className="text-muted">
														Your changes will not be synced until you log in.
													</P>
												</View>
											</View>
											<View className="flex-1 items-end">
												<ChevronRight
													className="bg-muted-foreground hidden"
													size={24}
												/>
											</View>
										</View>
									)}
								</View>
							</CardContent>
							{AccountState$.loggedIn.get() && (
								<CardFooter className="mt-2">
									<Button variant="destructive" size="sm" className="w-full">
										<Text>Log Out</Text>
									</Button>
								</CardFooter>
							)}
						</Card>
					</Link>
					<View>
						<H1>Settings</H1>
						<View className="flex gap-y-4">
							<View className="mt-2 flex-row items-center gap-2">
								<Switch
									checked={colorScheme === "dark"}
									onCheckedChange={() => hToggleColorScheme()}
									nativeID="dark-mode"
								/>
								<Label nativeID="dark-mode">Dark Mode</Label>
							</View>
							<View className="flex-row items-center gap-2">
								<Switch
									checked={use$(SettingsState$.linkCountdowns)}
									onCheckedChange={() =>
										SettingsState$.linkCountdowns.set(
											!SettingsState$.linkCountdowns.peek(),
										)
									}
									nativeID="link-countdowns"
								/>
								<View className="flex-1">
									<Label nativeID="link-countdowns">
										Link Caucus and Speaker countdown
									</Label>
									<Muted>
										If this is on, pausing the speaker countdown in moderated
										caucus will also pause the caucus countdown.
									</Muted>
								</View>
							</View>
							<View>
								<View className="my-8 flex flex-row gap-x-2">
									<Button onPress={() => importData()} className="grow">
										<Text>Import Data</Text>
									</Button>
									<Button onPress={() => exportData()} className="grow">
										<Text>Export Data</Text>
									</Button>
								</View>
								<Button
									size="sm"
									variant="destructive"
									onPress={() => {
										MainState$.committees.clear();
										runSeed();
									}}
								>
									<Text>Reset Data</Text>
								</Button>
							</View>
							<Dialog
								className="hidden"
								open={serverUrlDialogOpen}
								onOpenChange={setServerUrlDialogOpen}
							>
								<DialogTrigger asChild>
									<Button variant="outline" size="sm">
										<Text>Change Server URL</Text>
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-[425px]">
									<DialogHeader>
										<DialogTitle>Change Server URL</DialogTitle>
									</DialogHeader>
									<Alert icon={AlertTriangleIcon} variant="destructive">
										<AlertTitle>Advanced Users only</AlertTitle>
										<AlertDescription>
											Changing the server URL will connect to a different
											backend service.{"\n\n"}Please ensure you know what you
											are doing. The entered server will have full access to
											your data and login credentials.
										</AlertDescription>
									</Alert>
									<Label nativeID="server-url">Server URL</Label>
									<Input
										nativeID="server-url"
										autoCorrect={false}
										autoCapitalize="none"
										defaultValue={SettingsState$.serverUrl.get()}
										onChangeText={SettingsState$.serverUrl.set}
									/>
									<DialogFooter className="flex flex-row justify-between gap-x-2">
										<Button
											className="w-1/2"
											variant="outline"
											onPress={() => {
												SettingsState$.serverUrl.set(DEFAULT_SERVER_URL);
												setServerUrlDialogOpen(false);
											}}
										>
											<Text>Reset</Text>
										</Button>
										<DialogClose asChild>
											<Button className="w-1/2" variant="destructive">
												<Text>Save</Text>
											</Button>
										</DialogClose>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</View>
					</View>
				</View>
			</View>
		</ScrollView>
	);
}
