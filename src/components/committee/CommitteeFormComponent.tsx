import type { Observable } from "@legendapp/state";
import { For, Show, use$ } from "@legendapp/state/react";
import CountryPicker, { type Country } from "@munctl/rn-speaker-picker/dist";
import { randomUUID } from "expo-crypto";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Text } from "~/components/ui/text";
import { Muted, P } from "~/components/ui/typography";
import type { Committee } from "~/lib/committee/Committee";
import {
	type DelegationReduced,
	VotingPower,
} from "~/lib/delegation/Delegation";
import PillComponent from "../PillComponent";
import { StyledMaterialIcon } from "../StyledMaterialIcon";

export default function CommitteeForm({
	state,
}: {
	state: Observable<Pick<Committee, "name" | "delegations">>;
}) {
	const { colorScheme } = useColorScheme();
	const [countryPickerOpen, setCountryPickerOpen] = useState(false);
	const [customDelegationDialogOpen, setCustomDelegationDialogOpen] =
		useState(false);

	const handleAddDelegation = (item: Country | DelegationReduced) => {
		if ("name" in item) {
			state.delegations.push({
				id: item.cca2,
				entity: {
					name: item.name.toString(),
					code: item.cca2,
				},
				votingPower: VotingPower.REGULAR,
			} as DelegationReduced);
		} else {
			// If item is a DelegationReduced, we assume it has already been validated
			state.delegations.push(item);
		}
		setCountryPickerOpen(false);
		setCustomDelegationDialogOpen(false);
	};

	const handleRemoveDelegation = (ct: string) => {
		state.delegations.set(
			state.delegations.peek().filter((d) => d.entity.name !== ct),
		);
	};

	const excludedCountries = use$(() =>
		state.delegations.get().map((d) => d.id),
	);

	return (
		<>
			<View>
				<Label>Committee Name</Label>
				<Input
					className="border border-gray-300 rounded px-2 py-1 mb-4"
					defaultValue={state.name.get()}
					onChangeText={state.name.set}
				/>
				<Label>Delegations</Label>
				<View className="flex flex-row flex-wrap gap-2 mb-2">
					<Show
						ifReady={state.delegations}
						else={() => <Muted>No delegations added yet.</Muted>}
					>
						<For each={state.delegations}>
							{(delegation) => (
								<PillComponent
									imageSource={
										delegation.isCustom.get()
											? undefined
											: delegation.entity.code.get().toLowerCase()
									}
									key={delegation.id.get()}
									text={delegation.entity.name.get()}
									onRemove={handleRemoveDelegation}
								/>
							)}
						</For>
					</Show>
				</View>
				<View className="mt-2 mb-4 flex flex-row gap-2 flex-wrap">
					<Button
						size="sm"
						className="flex flex-row grow"
						onPress={() => setCountryPickerOpen(true)}
					>
						<StyledMaterialIcon className="text-white" name="add" size={24} />
						<Text className="text-white ml-2">Add Country</Text>
					</Button>
					<Button
						size="sm"
						className="flex flex-row grow"
						onPress={() => setCustomDelegationDialogOpen(true)}
					>
						<StyledMaterialIcon
							className="text-white"
							name="settings"
							size={24}
						/>
						<Text className="text-white ml-2">Add Custom</Text>
					</Button>
				</View>
				<CountryPicker
					visible={countryPickerOpen}
					trigger={{
						render: () => null,
					}}
					countries={{
						excluded: excludedCountries,
					}}
					onSelect={handleAddDelegation}
				/>
			</View>
			<Dialog
				open={customDelegationDialogOpen}
				onOpenChange={setCustomDelegationDialogOpen}
			>
				<DialogContent className="w-screen">
					<DialogHeader>
						<DialogTitle>Add Custom Delegation</DialogTitle>
					</DialogHeader>
					<CustomDelegationForm
						onSubmit={handleAddDelegation}
						onCancel={() => setCustomDelegationDialogOpen(false)}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
}

type CustomDelegationFormValues = {
	name: string;
	votingPower: { value: string; label: string };
};

function CustomDelegationForm({
	onSubmit,
	onCancel,
}: {
	onSubmit: (delegation: DelegationReduced) => void;
	onCancel?: () => void;
}) {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<CustomDelegationFormValues>({
		defaultValues: {
			name: "",
			votingPower: { value: "regular", label: "Regular" },
		},
	});

	const submit = (data: CustomDelegationFormValues) => {
		onSubmit({
			id: data.name.toLowerCase(),
			isCustom: true,
			entity: {
				name: data.name,
				code: randomUUID(),
			},
			votingPower: data.votingPower.value as VotingPower,
		} as DelegationReduced);
	};

	return (
		<>
			<Controller
				rules={{ required: true }}
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<>
						<Label>Name</Label>
						<Input value={value} onChangeText={onChange} onBlur={onBlur} />
					</>
				)}
				name="name"
			/>
			{errors.name && (
				<Muted className="text-destructive">
					Please enter a delegation name.
				</Muted>
			)}

			<Controller
				rules={{ required: true }}
				control={control}
				render={({ field: { onChange, value } }) => (
					<>
						<Label>Voting Power</Label>
						<Select value={value} onValueChange={onChange}>
							<SelectTrigger>
								<SelectValue
									placeholder="Select Voting Power"
									className="text-black dark:text-white"
								/>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="regular" label="Regular" />
								<SelectItem value="veto" label="Veto" />
								<SelectItem value="none" label="None" />
							</SelectContent>
						</Select>
					</>
				)}
				name="votingPower"
			/>
			{errors.votingPower && (
				<Muted className="text-destructive">
					Please select a voting power.
				</Muted>
			)}

			<View className="spacing-submit flex flex-row gap-2 flex-wrap">
				<Button variant="outline" className="grow" onPress={onCancel}>
					<Text>Cancel</Text>
				</Button>
				<Button className="grow" onPress={handleSubmit(submit)}>
					<Text>Add</Text>
				</Button>
			</View>
		</>
	);
}
