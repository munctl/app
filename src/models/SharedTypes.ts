/**
 * Base interface for all database objects.
 */
export interface DbBase {
	id: string;
	createdAt: string;
	updatedAt: string;
}

export enum AttendanceType {
	PRESENT_VOTING = "presentVoting",
	PRESENT = "present",
	ABSENT = "absent",
}
