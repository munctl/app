import type { dbBase } from "~/lib/SharedTypes";
import type { VotingPower } from "~/lib/delegation/Delegation";

/***
 @name ParticipantBase
 @property {string} name - The short name of the participant.
 @property {string} image - The URL to the participant's logo or flag.

 @extends {dbBase}
 ***/
interface ParticipantBase extends dbBase {
	name: string;
	image?: string;
}

/***
 @name Country
 @description Represents a country in the global database. Country objects are shared across all committee sand sessions. This includes both UN member states and non-member states.
 @property {string} code - The ISO 3166-1 alpha-2 code of the country. (e.g., "DE" for Germany)
 @property {VotingPower} [votingPowerSuggestion] - Optional voting power suggestion for the country. This can be overridden on the Delegation object.

 @extends {ParticipantBase}
 ***/
export interface Country extends ParticipantBase {
	code: string;
	votingPowerSuggestion?: VotingPower;
}
/***
 @name CountryReduced
 @description Represents a reduced version of a country object for use in contexts where full details are not required, such as the speaker queue.
 @extends {Country}
 ***/
export type CountryReduced = Omit<
	Country,
	"votingPowerSuggestion" | "createdAt" | "updatedAt"
>;
/***
 @name NGO
 @description Represents a non-governmental organization (NGO) in the global database. NGO objects are shared across all committees and sessions.
 @property {string} name - The short name of the NGO.
 @property {string} image - The URL to the NGO's logo.

 @extends {ParticipantBase}
 ***/
export interface NGO extends ParticipantBase {
	code: string;
}
export type NGOReduced = Omit<NGO, "createdAt" | "updatedAt">;
