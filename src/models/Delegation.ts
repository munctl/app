import type { CountryReduced, NGOReduced } from "./Participant";

export enum VotingPower {
	VETO = "VETO",
	REGULAR = "regular",
	NONE = "none",
}

export interface DelegationReduced {
	id: string;
	entity: CountryReduced | NGOReduced;
	votingPower: VotingPower;
	isCustom?: boolean;
}
