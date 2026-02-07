import type { dbBase } from "~/lib/SharedTypes";
import type { DelegationReduced } from "~/lib/delegation/Delegation";
import type { Session } from "~/lib/session/Session";

/***
 @name Committee
 @description Represents a committee in the global database. A committee is a collection of session.
 @description Child: Session
 @property {string} name - The name of the committee.
 @property {Session[]} sessions - The session in the committee.

 @extends {dbBase}
 ***/
export interface Committee extends dbBase {
	name: string;
	sessions: Map<string, Session>;

	admins: string[];
	users: string[];

	delegations: DelegationReduced[];
}
