import type { dbBase } from "~/lib/SharedTypes";
import type { CountryReduced, NGOReduced } from "~/lib/delegation/Participant";

/***
 @name CaucusType
 @description Represents the type of caucus in a committee.
 @enum {string}
 @property {string} MODERATED - A moderated caucus.
 @property {string} UNMODERATED - An unmoderated caucus.
 @property {string} GSL - A General Speakers List caucus.
 ***/
export enum CaucusType {
	MODERATED = "mod",
	UNMODERATED = "unmod",
	GSL = "gsl",
}

/***
 @name Caucus
 @description Represents a caucus in a committee. A caucus is the smallest subunit of a committee.
 @description Parent: Session
 @property {CaucusType} type - The type of caucus.
 @property {Country[]} queue - The queue of countries that will speak in the caucus, where 0 is the current speaker.
 @property {number | null} initialSpeakerTime - The initial time allocated for each speaker in the caucus.
 @property {number | null} currentSpeakerTime - The time remaining for the current speaker in the caucus.
 @property {number} initialCaucusTime - The initial total time allocated for the caucus.
 @property {number} currentCaucusTime - The current time remaining in the caucus.

 @extends {dbBase}
 ***/
export interface Caucus extends dbBase {
	type: CaucusType;
	topic: string;
	queue: { name: string; code: string; image?: string }[];

	initialSpeakerTime?: number;
	currentSpeakerTime?: number;

	initialCaucusTime?: number;
	currentCaucusTime?: number;
}
