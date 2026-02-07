// Utility to move an item in an array up or down

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
