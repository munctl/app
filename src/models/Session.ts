import type { Caucus } from "./Caucus";
import type { DelegationReduced } from "./Delegation";
import type { AttendanceType, DbBase } from "./SharedTypes";

export interface AttendanceEntry {
	delegation: DelegationReduced;
	status: AttendanceType;
}

export interface Session extends DbBase {
	name: string;
	startDate: string | null;
	endDate: string | null;
	/** Keyed by caucus id */
	caucuses: Record<string, Caucus>;
	/** Keyed by delegation id */
	attendance: Record<string, AttendanceType>;
}
