import type { dbBase } from "~/lib/SharedTypes";
import type { CountryReduced, NGOReduced } from "~/lib/delegation/Participant";

export enum VotingPower {
	VETO = "VETO",
	REGULAR = 1,
	NONE = 0,
}

export interface Delegation extends dbBase {
	entity: CountryReduced | NGOReduced;
	votingPower: VotingPower;
}

export type DelegationReduced = Omit<Delegation, "createdAt" | "updatedAt"> & {
	isCustom?: boolean;
};
