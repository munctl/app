import type { Caucus } from "@/models/Caucus";
import { CaucusType } from "@/models/Caucus";
import type { Committee } from "@/models/Committee";
import type { DelegationReduced } from "@/models/Delegation";
import type { Session } from "@/models/Session";
import type { AttendanceType } from "@/models/SharedTypes";
import { defineStore } from "pinia";

interface CommitteeState {
	compatibility: number;
	committees: Record<string, Committee>;
}

export const useCommitteeStore = defineStore("committees", {
	state: (): CommitteeState => ({
		compatibility: 1,
		committees: {},
	}),

	getters: {
		committeeList(state): Committee[] {
			return Object.values(state.committees);
		},
		getCommittee(state) {
			return (id: string): Committee | undefined => state.committees[id];
		},
		getSession(state) {
			return (committeeId: string, sessionId: string): Session | undefined =>
				state.committees[committeeId]?.sessions[sessionId];
		},
		getCaucus(state) {
			return (
				committeeId: string,
				sessionId: string,
				caucusId: string,
			): Caucus | undefined =>
				state.committees[committeeId]?.sessions[sessionId]?.caucuses[caucusId];
		},
	},

	actions: {
		addCommittee(committee: Committee) {
			this.committees[committee.id] = committee;
		},

		updateCommittee(partial: Partial<Committee> & Pick<Committee, "id">) {
			const prev = this.committees[partial.id];
			if (!prev) return;
			this.committees[partial.id] = {
				...prev,
				...partial,
				updatedAt: new Date().toISOString(),
			};
		},

		deleteCommittee(id: string) {
			delete this.committees[id];
		},

		// Session CRUD
		addSession(committeeId: string, session: Session) {
			const committee = this.committees[committeeId];
			if (!committee) return;
			committee.sessions[session.id] = session;
		},

		updateSession(
			committeeId: string,
			sessionId: string,
			partial: Partial<Session>,
		) {
			const session = this.committees[committeeId]?.sessions[sessionId];
			if (!session) return;
			Object.assign(session, partial, { updatedAt: new Date().toISOString() });
		},

		deleteSession(committeeId: string, sessionId: string) {
			const committee = this.committees[committeeId];
			if (!committee) return;
			delete committee.sessions[sessionId];
		},

		// Caucus CRUD
		addCaucus(committeeId: string, sessionId: string, caucus: Caucus) {
			const session = this.committees[committeeId]?.sessions[sessionId];
			if (!session) return;
			session.caucuses[caucus.id] = caucus;
		},

		updateCaucus(
			committeeId: string,
			sessionId: string,
			caucusId: string,
			partial: Partial<Caucus>,
		) {
			const caucus =
				this.committees[committeeId]?.sessions[sessionId]?.caucuses[caucusId];
			if (!caucus) return;
			Object.assign(caucus, partial, { updatedAt: new Date().toISOString() });
		},

		deleteCaucus(committeeId: string, sessionId: string, caucusId: string) {
			const session = this.committees[committeeId]?.sessions[sessionId];
			if (!session) return;
			delete session.caucuses[caucusId];
		},

		// Attendance
		setAttendance(
			committeeId: string,
			sessionId: string,
			delegationId: string,
			type: AttendanceType,
		) {
			const session = this.committees[committeeId]?.sessions[sessionId];
			if (!session) return;
			session.attendance[delegationId] = type;
		},

		setAllAttendance(
			committeeId: string,
			sessionId: string,
			attendance: Record<string, AttendanceType>,
		) {
			const session = this.committees[committeeId]?.sessions[sessionId];
			if (!session) return;
			session.attendance = attendance;
		},

		// Speaker queue
		addSpeaker(
			committeeId: string,
			sessionId: string,
			caucusId: string,
			speaker: { name: string; code: string },
		) {
			const caucus =
				this.committees[committeeId]?.sessions[sessionId]?.caucuses[caucusId];
			if (!caucus) return;
			caucus.queue.push(speaker);
		},

		removeSpeaker(
			committeeId: string,
			sessionId: string,
			caucusId: string,
			index: number,
		) {
			const caucus =
				this.committees[committeeId]?.sessions[sessionId]?.caucuses[caucusId];
			if (!caucus) return;
			caucus.queue.splice(index, 1);
		},

		advanceSpeaker(committeeId: string, sessionId: string, caucusId: string) {
			const caucus =
				this.committees[committeeId]?.sessions[sessionId]?.caucuses[caucusId];
			if (!caucus || caucus.queue.length === 0) return;
			caucus.queue.shift();
		},

		moveSpeaker(
			committeeId: string,
			sessionId: string,
			caucusId: string,
			index: number,
			direction: "up" | "down",
		) {
			const caucus =
				this.committees[committeeId]?.sessions[sessionId]?.caucuses[caucusId];
			if (!caucus) return;
			const arr = caucus.queue;
			if (direction === "up" && index > 0) {
				[arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
			} else if (direction === "down" && index < arr.length - 1) {
				[arr[index + 1], arr[index]] = [arr[index], arr[index + 1]];
			}
		},

		// Clear all data
		clearAll() {
			this.committees = {};
		},
	},

	persist: true,
});
