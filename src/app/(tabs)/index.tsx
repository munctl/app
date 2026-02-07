import { MaterialIcons } from "@expo/vector-icons";
import { useObservable } from "@legendapp/state/react";
import { randomUUID } from "expo-crypto";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import CommitteeForm from "~/components/committee/CommitteeFormComponent";
import CommitteeListComponent from "~/components/home/CommitteeListComponent";
import { Button } from "~/components/ui/button";
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
import { H1 } from "~/components/ui/typography";
import type { Committee } from "~/lib/committee/Committee";
import type { Session } from "~/lib/session/Session";
import { MainState$, addCommittee } from "~/lib/state/CommitteeState";

export default function HomeScreen() {
	const router = useRouter();
	const navigation = useNavigation();
	useEffect(() => {
		navigation.setOptions({
			headerTitle: "Home",
		});
	}, [navigation.setOptions]);

	return (
		<ScrollView>
			<View className="p-4">
				<View className="mb-4 flex flex-row items-center gap-x-2">
					<H1>Your Committees</H1>
					<MaterialIcons
						size={32}
						name="add"
						className="bg-primary rounded-full"
						onPress={() => router.push("/committee/create")}
					/>
				</View>
				<CommitteeListComponent router={router} state={MainState$.committees} />
			</View>
		</ScrollView>
	);
}
