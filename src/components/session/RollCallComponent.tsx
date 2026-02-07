import { MaterialIcons } from "@expo/vector-icons";
import type { Observable } from "@legendapp/state";
import {
	Computed,
	For,
	Show,
	use$,
	useObservable,
} from "@legendapp/state/react";
import { ScrollView, View } from "react-native";
import { StyledExpoImage } from "~/components/StyledExpoImage";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Lead, Muted } from "~/components/ui/typography";
import { AttendanceType } from "~/lib/SharedTypes";
import type { Committee } from "~/lib/committee/Committee";
import type { DelegationReduced } from "~/lib/delegation/Delegation";
import type { Session } from "~/lib/session/Session";

export default function RollCallComponent({
	delegations,
	attendance,
	onSubmit,
	onCancel,
}: {
	delegations: Observable<Committee["delegations"]>;
	attendance: Observable<Session["attendance"]>;
	onSubmit?: () => void;
	onCancel?: () => void;
}) {
	const workingAttendance = useObservable(
		new Map<DelegationReduced, AttendanceType>(),
	);

	const openedAccordion = useObservable(delegations.peek().at(0)?.id ?? "");

	function mark(
		delegation: Committee["delegations"][number],
		type: AttendanceType,
	) {
		workingAttendance.set(delegation, type);
		openedAccordion.set(
			delegations
				.peek()
				.at(
					delegations.findIndex((p) => p.id.peek() === openedAccordion.peek()) +
						1,
				)?.id ?? "",
		);
	}

	function colorCoding(delegation: Committee["delegations"][number]) {
		const att = use$(workingAttendance.get(delegation));
		switch (att) {
			case AttendanceType.PRESENT_VOTING:
				return "bg-green-500";
			case AttendanceType.PRESENT:
				return "bg-primary";
			case AttendanceType.ABSENT:
				return "bg-destructive";
			default:
				return "bg-card";
		}
	}

	return (
		<Show
			ifReady={delegations}
			else={() => <Muted>No delegations found.</Muted>}
		>
			<Accordion
				collapsible={false}
				type="single"
				className="gap-y-2"
				value={use$(openedAccordion)}
				onValueChange={(v: string | undefined) => openedAccordion.set(v ?? "")}
			>
				<For each={delegations}>
					{(d) => (
						<AccordionItem
							key={d.id.peek()}
							value={d.id.peek()}
							className={"border-b rounded-md overflow-hidden"}
						>
							<AccordionTrigger
								className={`flex justify-between items-center ${colorCoding(d.peek())} px-2 border border-border`}
							>
								<StyledExpoImage
									contentFit="contain"
									className="h-8 w-8 mr-2"
									source={{
										uri: d.entity.code
											.get()
											.replace("do", "flag_do")
											.toLowerCase(),
									}}
								/>
								<Text className="grow">{d.entity.name.get()}</Text>
								<Lead>
									{workingAttendance.get(d.peek()).get() ===
									AttendanceType.PRESENT_VOTING ? (
										<>
											<MaterialIcons name="how-to-vote" size={24} />
											<MaterialIcons name="check" size={24} />
										</>
									) : workingAttendance.get(d.peek()).get() ===
										AttendanceType.PRESENT ? (
										<MaterialIcons name="check" size={24} />
									) : workingAttendance.get(d.peek()).get() ===
										AttendanceType.ABSENT ? (
										<MaterialIcons name="close" size={24} />
									) : (
										<MaterialIcons name="question-mark" size={24} />
									)}
								</Lead>
							</AccordionTrigger>
							<AccordionContent className={"p-4 px-1 bg-card rounded-b-md"}>
								<View className="flex flex-row flex-wrap gap-x-2 mx-auto">
									<Button
										className="bg-green-500"
										onPress={() =>
											mark(d.peek(), AttendanceType.PRESENT_VOTING)
										}
									>
										<Text>Present, Voting</Text>
									</Button>
									<Button
										className="bg-primary"
										onPress={() => mark(d.peek(), AttendanceType.PRESENT)}
									>
										<Text>Present</Text>
									</Button>
									<Button
										className="bg-red-500"
										onPress={() => mark(d.peek(), AttendanceType.ABSENT)}
									>
										<Text>Absent</Text>
									</Button>
								</View>
							</AccordionContent>
						</AccordionItem>
					)}
				</For>
			</Accordion>
			<View className="flex flex-row spacing-submit gap-x-2">
				<Button
					className="w-1/2"
					variant="outline"
					onPress={() => {
						onCancel?.();
					}}
				>
					<Text>Cancel</Text>
				</Button>
				<Button
					disabled={
						workingAttendance.size < delegations.length ||
						![...workingAttendance.get()].some(
							(d) => d[1] === AttendanceType.PRESENT_VOTING,
						)
					}
					className="w-1/2"
					onPress={() => {
						attendance.set(workingAttendance.peek());
						onSubmit?.();
					}}
				>
					<Text>Done</Text>
				</Button>
			</View>
		</Show>
	);
}
