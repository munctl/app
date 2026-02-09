import { CaucusType } from "@/models/Caucus";
import type { Committee } from "@/models/Committee";
import { type DelegationReduced, VotingPower } from "@/models/Delegation";
import { AttendanceType } from "@/models/SharedTypes";
import { useCommitteeStore } from "@/stores/committees";
import { useSettingsStore } from "@/stores/settings";

const delegations: DelegationReduced[] = [
	{
		id: "us",
		entity: { id: "us", code: "us", name: "United States" },
		votingPower: VotingPower.REGULAR,
	},
	{
		id: "gb",
		entity: { id: "gb", code: "gb", name: "United Kingdom" },
		votingPower: VotingPower.REGULAR,
	},
	{
		id: "in",
		entity: { id: "in", code: "in", name: "India" },
		votingPower: VotingPower.REGULAR,
	},
	{
		id: "cn",
		entity: { id: "cn", code: "cn", name: "China" },
		votingPower: VotingPower.REGULAR,
	},
	{
		id: "fr",
		entity: { id: "fr", code: "fr", name: "France" },
		votingPower: VotingPower.REGULAR,
	},
	{
		id: "ru",
		entity: { id: "ru", code: "ru", name: "Russia" },
		votingPower: VotingPower.REGULAR,
	},
];

const DEMO_COMMITTEE_ID = "ef80287f-49cb-427e-86b4-c8b278567bbe";
const DEMO_SESSION_1_ID = "ef80287f-49cb-427e-86b4-c8b278567bbf";
const DEMO_SESSION_2_ID = "ef80287f-49cb-427e-86b4-c8b278567bbg";

export function runSeed() {
	const store = useCommitteeStore();
	const settings = useSettingsStore();

	if (!settings.runSeed) return;
	if (Object.keys(store.committees).length > 0) return;

	const committee: Committee = {
		id: DEMO_COMMITTEE_ID,
		name: "Demo Committee",
		createdAt: "1970-01-01T00:00:00.000Z",
		updatedAt: "1970-01-01T00:00:00.000Z",
		admins: [],
		users: [],
		delegations: [...delegations],
		sessions: {
			[DEMO_SESSION_1_ID]: {
				id: DEMO_SESSION_1_ID,
				name: "Demo Session 1",
				createdAt: "1970-01-01T00:00:00.000Z",
				updatedAt: "1970-01-01T00:00:00.000Z",
				startDate: null,
				endDate: null,
				attendance: {
					us: AttendanceType.PRESENT_VOTING,
					gb: AttendanceType.PRESENT_VOTING,
					in: AttendanceType.PRESENT_VOTING,
					cn: AttendanceType.PRESENT_VOTING,
					fr: AttendanceType.PRESENT,
					ru: AttendanceType.ABSENT,
				},
				caucuses: {
					[DEMO_SESSION_1_ID]: {
						id: DEMO_SESSION_1_ID,
						topic: "Demo Caucus 1",
						type: CaucusType.GSL,
						createdAt: "1970-01-01T00:00:00.000Z",
						updatedAt: "1970-01-01T00:00:00.000Z",
						queue: delegations.map((d) => ({
							code: d.entity.code,
							name: d.entity.name,
						})),
						initialSpeakerTime: 60,
						currentSpeakerTime: 60,
					},
				},
			},
			[DEMO_SESSION_2_ID]: {
				id: DEMO_SESSION_2_ID,
				name: "Demo Session 2",
				createdAt: "1970-01-01T00:00:00.000Z",
				updatedAt: "1970-01-01T00:00:00.000Z",
				startDate: null,
				endDate: null,
				attendance: {},
				caucuses: {
					[DEMO_SESSION_2_ID]: {
						id: DEMO_SESSION_2_ID,
						topic: "Demo Caucus 1",
						type: CaucusType.GSL,
						createdAt: "1970-01-01T00:00:00.000Z",
						updatedAt: "1970-01-01T00:00:00.000Z",
						queue: delegations.map((d) => ({
							code: d.entity.code,
							name: d.entity.name,
						})),
						initialSpeakerTime: 60,
						currentSpeakerTime: 60,
					},
				},
			},
		},
	};

	store.addCommittee(committee);
}
