/**
 * Format seconds to a time string (MM:SS or HH:MM:SS).
 */
export function secondsToTimeString(seconds: number): string {
	if (seconds < 0) return "00:00";
	const h = Math.floor(seconds / 3600)
		.toString()
		.padStart(2, "0");
	const m = Math.floor((seconds % 3600) / 60)
		.toString()
		.padStart(2, "0");
	const s = (seconds % 60).toString().padStart(2, "0");
	return seconds >= 3600 ? `${h}:${m}:${s}` : `${m}:${s}`;
}

/**
 * Returns a CSS color class based on remaining time.
 */
export function timeColorClass(remaining: number): string {
	if (remaining < 5) return "ion-color-danger";
	if (remaining < 10) return "ion-color-warning";
	return "";
}

/**
 * Returns inline style color for countdown.
 */
export function timeColor(remaining: number): string {
	if (remaining < 5) return "var(--ion-color-danger)";
	if (remaining < 10) return "var(--ion-color-warning)";
	return "inherit";
}

/**
 * Move an item in an array up or down.
 */
export function moveItem<T>(
	arr: T[],
	index: number,
	direction: "up" | "down",
): T[] {
	const newArr = [...arr];
	if (direction === "up" && index > 0) {
		[newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
	} else if (direction === "down" && index < newArr.length - 1) {
		[newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
	}
	return newArr;
}

/**
 * Generate a UUID v4.
 */
export function generateId(): string {
	return crypto.randomUUID();
}

/**
 * Get flag image URL for a country code.
 */
export function flagUrl(code: string): string {
	return `https://flagcdn.com/w80/${code.toLowerCase()}.png`;
}
