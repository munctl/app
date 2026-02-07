/***
 @name dbBase
 @description Base interface for all database objects. Contains common properties like the UUID, createdAt, and updatedAt.
 @property {string} id - The UUID for the database object.
 @property {Date} createdAt - The date when the object was created.
 @property {Date} updatedAt - The date when the object was last updated.
 ***/
export interface dbBase {
	id: string;
	createdAt: Date;
	updatedAt: Date;
}

export enum AttendanceType {
	PRESENT_VOTING = "presentVoting",
	PRESENT = "present",
	ABSENT = "absent",
}
