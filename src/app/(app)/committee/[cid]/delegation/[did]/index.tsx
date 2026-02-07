import { useRoute } from "@react-navigation/core";
import { useGlobalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Small } from "~/components/ui/typography";
import { MainState$ } from "~/lib/state/CommitteeState";

export default function DelegationPage() {
	const navigation = useNavigation();
	const params = useGlobalSearchParams();

	const state = MainState$.committees[params.cid as string].delegations?.find(
		(d) => d.id.peek() === params.did,
	);
	if (!state) {
		return (
			<View className="flex-1 items-center justify-center">
				<Small>Could not find a delegation with the given ID.</Small>
			</View>
		);
	}

	useEffect(() => {
		navigation.setOptions({
			headerTitle: state.entity.name.get(),
		});
	});

	return (
		<ScrollView>
			<View className="p-4">
				<Card>
					<CardHeader>
						<CardTitle>{state.entity.name.get()}</CardTitle>
						<CardDescription>
							(placeholder: 2) Delegates assigned | Voting Power:{" "}
							{state.votingPower.get()}
						</CardDescription>
					</CardHeader>

					<CardContent className="flex flex-col flex-wrap gap-y-2">
						<Card className="w-full">
							<CardHeader>
								<CardTitle>John Doe</CardTitle>
								<CardDescription>john@doe.com | Login disabled</CardDescription>
							</CardHeader>
						</Card>
						<Card className="w-full">
							<CardHeader>
								<CardTitle>Jane Doe</CardTitle>
								<CardDescription>jane@doe.com | Login enabled</CardDescription>
							</CardHeader>
						</Card>
					</CardContent>
				</Card>
			</View>
		</ScrollView>
	);
}
