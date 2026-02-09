import type { DelegationReduced } from "./Delegation";
import type { Session } from "./Session";
import type { DbBase } from "./SharedTypes";

export interface Committee extends DbBase {
	name: string;
	/** Keyed by session id */
	sessions: Record<string, Session>;
	admins: string[];
	users: string[];
	delegations: DelegationReduced[];
}
