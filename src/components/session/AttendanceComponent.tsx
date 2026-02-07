import type { Observable } from "@legendapp/state";
import { For, Show } from "@legendapp/state/react";
import type { ComponentProps } from "react";
import { View } from "react-native";
import PillComponent from "~/components/PillComponent";
import { H3, H4, Muted } from "~/components/ui/typography";
import type { AttendanceType } from "~/lib/SharedTypes";
import type { DelegationReduced } from "~/lib/delegation/Delegation";

export default function AttendanceComponent({
	attendance,
	attendanceGroups,
	...props
}: ComponentProps<typeof View> & {
	attendance: Observable<Map<DelegationReduced, AttendanceType>>;
	attendanceGroups: Observable<{
		presentVoting: DelegationReduced[];
		present: DelegationReduced[];
		absent: DelegationReduced[];
	}>;
}) {
	return (
		<View {...props} className={`flex flex-col gap-y-4 ${props.className}`}>
			<H3>Attendance</H3>
			<Show
				ifReady={attendance}
				else={() => <Muted>You haven't performed a roll call yet.</Muted>}
			>
				<View>
					<H4>Present and Voting</H4>
					<View className="flex flex-row flex-wrap gap-2">
						<Show
							ifReady={attendanceGroups.presentVoting}
							else={() => <Muted>None</Muted>}
						>
							<For each={attendanceGroups.presentVoting}>
								{(delegation) => (
									<PillComponent
										imageSource={
											delegation.isCustom.get()
												? undefined
												: delegation.entity.code.get().toLowerCase()
										}
										key={delegation.id.peek()}
										text={delegation.entity.name.get()}
									/>
								)}
							</For>
						</Show>
					</View>
				</View>
				<View>
					<H4>Present</H4>
					<View className="flex flex-row flex-wrap gap-2">
						<Show
							ifReady={attendanceGroups.present}
							else={() => <Muted>None</Muted>}
						>
							<For each={attendanceGroups.present}>
								{(delegation) => (
									<PillComponent
										imageSource={
											delegation.isCustom.get()
												? undefined
												: delegation.entity.code.get().toLowerCase()
										}
										key={delegation.id.peek()}
										text={delegation.entity.name.get()}
									/>
								)}
							</For>
						</Show>
					</View>
				</View>
				<View>
					<H4 className="mb-1">Absent</H4>
					<View className="flex flex-row flex-wrap gap-2">
						<Show
							ifReady={attendanceGroups.absent}
							else={() => <Muted>None</Muted>}
						>
							<For each={attendanceGroups.absent}>
								{(delegation) => (
									<PillComponent
										imageSource={
											delegation.isCustom.get()
												? undefined
												: delegation.entity.code.get().toLowerCase()
										}
										key={delegation.id.peek()}
										text={delegation.entity.name.get()}
									/>
								)}
							</For>
						</Show>
					</View>
				</View>
			</Show>
		</View>
	);
}
