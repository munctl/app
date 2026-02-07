import { useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, Text, View } from "react-native";

import { Form } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { H2 } from "~/components/ui/typography";
import { AccountState$ } from "~/lib/state/AccountState";

export default function Login() {
	const state = AccountState$.get();
	const navigation = useNavigation();
	useEffect(() => {
		navigation.setOptions({
			headerTitle: "Login",
			headerShown: false,
		});
	});

	if (state.loggedIn) {
		useRouter().push("/");
		return null;
	}

	return (
		<View className="bg-zinc-100 dark:bg-zinc-900 min-h-screen">
			<View className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
				<View className="sm:mx-auto sm:w-full sm:max-w-md">
					{/*<Image
						alt="MUNctl"
						source={require("~/assets/images/favicon-256px.png")}
						className="mx-auto h-10 w-auto"
					/>*/}
					<H2 className="mt-6 mx-auto text-center text-2xl border-0">
						Sign in to MUNctl
					</H2>
				</View>

				<View className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
					<View className="mx-2 bg-white dark:bg-zinc-950 px-6 py-12 shadow-sm rounded-lg sm:px-12">
						<View className="space-y-6">
							<View>
								<Label nativeID="email" className="block text-sm/6 font-medium">
									Email
								</Label>
								<View className="mt-2">
									<Input id="email" nativeID="email" autoComplete="email" />
								</View>
							</View>

							<View>
								<Label
									nativeID="password"
									className="block text-sm/6 font-medium"
								>
									Password
								</Label>
								<View className="mt-2">
									<Input
										id="password"
										nativeID="password"
										secureTextEntry
										autoComplete="current-password"
									/>
								</View>
							</View>

							<View className="flex items-center justify-between">
								<View className="flex gap-3">
									<View className="flex h-6 shrink-0 items-center">
										<View className="group grid size-4 grid-cols-1">
											<Checkbox
												id="remember-me"
												nativeID="remember-me"
												checked={false}
												onCheckedChange={() => {}}
												className="col-start-1 row-start-1 appearance-none rounded-sm border border-zinc-300"
											/>
										</View>
									</View>
									<Label htmlFor="remember-me" className="block text-sm/6">
										Remember me
									</Label>
								</View>

								<View className="text-sm/6">
									<Text>Forgot password?</Text>
								</View>
							</View>

							<View>
								<Button className="flex w-full justify-center bg-primary hover:bg-indigo-500">
									<Text className="text-white">Sign in</Text>
								</Button>
							</View>
						</View>

						<View>
							<View className="relative mt-10">
								<View className="absolute inset-0 flex items-center">
									<View className="w-full border-t border-zinc-200 dark:border-zinc-700" />
								</View>
								<View className="relative flex justify-center text-sm/6 font-medium">
									<Text className="px-6">or continue with</Text>
								</View>
							</View>

							<View className="mt-6 grid grid-cols-2 gap-4">
								<Button className="bg-zinc-100 text-gray-900">
									<Text className="text-sm/6 font-semibold">(Google)</Text>
								</Button>

								<Button className="bg-zinc-100 px-3 py-2 text-gray-900">
									<Text className="text-sm/6 font-semibold">(Apple)</Text>
								</Button>
							</View>
						</View>
					</View>

					<Text className="mt-10 text-center text-sm/6 text-gray-500">
						Not a member?{" "}
						<Text className="font-semibold text-primary hover:text-primary">
							Register
						</Text>
					</Text>
				</View>
			</View>
		</View>
	);
}
