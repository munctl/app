import type { AttendanceType, dbBase } from "~/lib/SharedTypes";
import type { Caucus } from "~/lib/caucus/Caucus";
import type { DelegationReduced } from "~/lib/delegation/Delegation";

/***
 @name Session
 @description Represents a session in a committee.
 @description Parent: Committee
 @description Child: Caucus
 @property {string} name - The name of the session.
 @property {Date | null} startDate - The date when the session starts.
 @property {Date | null} endDate - The date when the session ends.

 @extends {dbBase}
 ***/
export interface Session extends dbBase {
	name: string;
	startDate: Date | null;
	endDate: Date | null;
	caucuses: Map<string, Caucus>;

	attendance: Map<DelegationReduced, AttendanceType>;
}
