import type { DbBase } from "./SharedTypes";

export enum CaucusType {
	MODERATED = "mod",
	UNMODERATED = "unmod",
	GSL = "gsl",
}

export interface QueueEntry {
	name: string;
	code: string;
	image?: string;
}

export interface Caucus extends DbBase {
	type: CaucusType;
	topic: string;
	queue: QueueEntry[];

	initialSpeakerTime?: number;
	currentSpeakerTime?: number;

	initialCaucusTime?: number;
	currentCaucusTime?: number;
}
