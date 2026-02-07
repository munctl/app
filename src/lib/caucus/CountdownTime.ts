export class CountdownTime extends Number {
	get hoursComponent(): number {
		return Math.floor(this.valueOf() / 3600);
	}

	get minutesComponent(): number {
		return Math.floor((this.valueOf() % 3600) / 60);
	}

	get secondsComponent(): number {
		return this.valueOf() % 60;
	}

	toString(): string {
		const h = this.hoursComponent.toString().padStart(2, "0");
		const m = this.minutesComponent.toString().padStart(2, "0");
		const s = this.secondsComponent.toString().padStart(2, "0");
		return `${h}:${m}:${s}`;
	}
}

export function SecondsToTimeString(seconds: number): string {
	if (seconds < 0) {
		return "00:00";
	}
	const h = Math.floor(seconds / 3600)
		.toString()
		.padStart(2, "0");
	const m = Math.floor((seconds % 3600) / 60)
		.toString()
		.padStart(2, "0");
	const s = (seconds % 60).toString().padStart(2, "0");
	return seconds >= 3600 ? `${h}:${m}:${s}` : `${m}:${s}`;
}
