import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function Account() {
	const navigation = useNavigation();
	useEffect(() => {
		navigation.setOptions({
			headerTitle: "Your Account",
		});
	});

	return (
		<View className="flex-1 items-center justify-center p-4">
			<Text className="text-zinc-700 dark:text-zinc-200 text-lg font-semibold">
				Account Page
			</Text>
			<Text className="text-zinc-500 dark:text-zinc-400 mt-2">
				This is where account details will be displayed.
			</Text>
		</View>
	);
}
