import { AttendanceType } from "~/lib/SharedTypes";
import { type Caucus, CaucusType } from "~/lib/caucus/Caucus";
import type { Committee } from "~/lib/committee/Committee";
import {
	type DelegationReduced,
	VotingPower,
} from "~/lib/delegation/Delegation";
import type { Session } from "~/lib/session/Session";
import { MainState$ } from "~/lib/state/CommitteeState";

const ru = {
	id: "ru",
	entity: {
		id: "ru",
		code: "ru",
		name: "Russia",
	},
	votingPower: VotingPower.REGULAR,
} as DelegationReduced;
const fr = {
	id: "fr",
	entity: {
		id: "fr",
		code: "fr",
		name: "France",
	},
	votingPower: VotingPower.REGULAR,
} as DelegationReduced;
const cn = {
	id: "cn",
	entity: {
		id: "cn",
		code: "cn",
		name: "China",
	},
	votingPower: VotingPower.REGULAR,
} as DelegationReduced;
const ind = {
	id: "in",
	entity: {
		id: "in",
		code: "in",
		name: "India",
	},
	votingPower: VotingPower.REGULAR,
} as DelegationReduced;
const gb = {
	id: "gb",
	entity: {
		id: "gb",
		code: "gb",
		name: "United Kingdom",
	},
	votingPower: VotingPower.REGULAR,
} as DelegationReduced;
const us = {
	id: "us",
	entity: {
		id: "us",
		code: "us",
		name: "United States",
	},
	votingPower: VotingPower.REGULAR,
} as DelegationReduced;

export default function runSeed() {
	MainState$.committees.delete("DEMO-COMMITTEE");
	MainState$.committees.delete("ef80287f-49cb-427e-86b4-c8b278567bbe");
	MainState$.committees.set("ef80287f-49cb-427e-86b4-c8b278567bbe", {
		name: "Demo Committee",
		delegations: [],
		id: "ef80287f-49cb-427e-86b4-c8b278567bbe",
		createdAt: new Date("1970-01-01T00:00:00.000Z"),
		updatedAt: new Date("1970-01-01T00:00:00.000Z"),
		sessions: new Map<string, Session>(),
		admins: [],
		users: [],
	} as Committee);

	MainState$.committees[
		"ef80287f-49cb-427e-86b4-c8b278567bbe"
	].delegations.push(us, gb, ind, cn, fr, ru);

	MainState$.committees["ef80287f-49cb-427e-86b4-c8b278567bbe"].sessions.set(
		"ef80287f-49cb-427e-86b4-c8b278567bbf",
		{
			name: "Demo Session 1",
			id: "ef80287f-49cb-427e-86b4-c8b278567bbf",
			attendance: new Map<DelegationReduced, AttendanceType>([
				[us, AttendanceType.PRESENT_VOTING],
				[gb, AttendanceType.PRESENT_VOTING],
				[ind, AttendanceType.PRESENT_VOTING],
				[cn, AttendanceType.PRESENT_VOTING],
				[fr, AttendanceType.PRESENT],
				[ru, AttendanceType.ABSENT],
			]),
			caucuses: new Map<string, Caucus>([
				[
					"ef80287f-49cb-427e-86b4-c8b278567bbf",
					{
						id: "ef80287f-49cb-427e-86b4-c8b278567bbf",
						topic: "Demo Caucus 1",
						queue: [us, gb, ind, cn, fr, ru].map((d) => ({
							code: d.entity.code,
							name: d.entity.name,
							id: d.id,
						})),
						initialSpeakerTime: 60,
						currentSpeakerTime: 60,
						type: CaucusType.GSL,
						createdAt: new Date("1970-01-01T00:00:00.000Z"),
						updatedAt: new Date("1970-01-01T00:00:00.000Z"),
					},
				],
			]),
		} as Session,
	);
	MainState$.committees["ef80287f-49cb-427e-86b4-c8b278567bbe"].sessions.set(
		"ef80287f-49cb-427e-86b4-c8b278567bbg",
		{
			name: "Demo Session 2",
			id: "ef80287f-49cb-427e-86b4-c8b278567bbg",
			attendance: new Map<DelegationReduced, AttendanceType>(),
			caucuses: new Map<string, Caucus>([
				[
					"ef80287f-49cb-427e-86b4-c8b278567bbg",
					{
						id: "ef80287f-49cb-427e-86b4-c8b278567bbg",
						topic: "Demo Caucus 1",
						queue: [us, gb, ind, cn, fr, ru].map((d) => ({
							code: d.entity.code,
							name: d.entity.name,
							id: d.id,
						})),
						initialSpeakerTime: 60,
						currentSpeakerTime: 60,
						type: CaucusType.GSL,
						createdAt: new Date("1970-01-01T00:00:00.000Z"),
						updatedAt: new Date("1970-01-01T00:00:00.000Z"),
					},
				],
			]),
		} as Session,
	);

	/*MainState$.committees.set("DEMO-COMMITTEE", {
		id: "DEMO-COMMITTEE",
		name: "Demo Committee",
		createdAt: new Date(),
		updatedAt: new Date(),
		sessions: new Map<string, Session>([
			[
				"DEMO-SESSION-1",
				{
					id: "DEMO-SESSION-1",
					name: "Demo Session 1",
					startDate: dayjs().add(1, "day").toDate(),
					endDate: dayjs().add(2, "day").toDate(),
					createdAt: new Date(),
					updatedAt: new Date(),
					attendance: new Map<DelegationReduced, AttendanceType>(),
					caucuses: new Map<string, Caucus>([
						[
							"DEMO-SESSION-1",
							{
								id: "DEMO-SESSION-1",
								topic: "Demo Caucus 1",
								createdAt: new Date(),
								updatedAt: new Date(),
								queue: [
									{
										code: "us",
										name: "United States of America",
									},
									{
										name: "Switzerland",
										code: "ch",
									},
									{
										name: "Sweden",
										code: "se",
									},
								],
								initialSpeakerTime: 60,
								currentSpeakerTime: 60,
								type: CaucusType.GSL,
							},
						],
					]),
				},
			],
		]),
		delegations: [
			{
				id: "us",
				entity: {
					id: "us",
					code: "us",
					name: "United States of America",
				},
				votingPower: VotingPower.REGULAR,
			},
			{
				id: "ch",
				entity: {
					id: "ch",
					code: "ch",
					name: "Switzerland",
				},
				votingPower: VotingPower.REGULAR,
			},
			{
				id: "se",
				entity: {
					id: "se",
					code: "se",
					name: "Sweden",
				},
				votingPower: VotingPower.REGULAR,
			},
		],
		admins: [],
		users: [],
	});*/
}
