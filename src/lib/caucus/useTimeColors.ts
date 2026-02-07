import type { ObservablePrimitive } from "@legendapp/state";
import { use$ } from "@legendapp/state/react";

export default function useTimeColors(
	currentSpeakerTime: ObservablePrimitive<number>,
) {
	return use$(() => {
		const currentTime = currentSpeakerTime.get();
		if (currentTime < 5) return "text-red-500";
		if (currentTime < 10) return "text-yellow-500";
		return "";
	});
}
