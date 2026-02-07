import { type ObservablePrimitive, linked, observe } from "@legendapp/state";
import { useObservable, useObserve } from "@legendapp/state/react";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

export type Countdown = {
	active: ObservablePrimitive<boolean>;
	start: () => void;
	pause: () => void;
	toggle: () => void;
	reset: (to: number, pause?: boolean) => void;
};

/***
 @name useCountdown
 @desc A custom usable to handle countdown functionality.
 @param duration - An observable that holds the current countdown time in seconds.
 @param linkedState - An optional observable that can be used to link the countdown's active state to another countdown. The linked state will be the master, this will be the slave.
 ***/
export default function useCountdown(
	duration: ObservablePrimitive<number>,
	linkedState?: ObservablePrimitive<boolean>,
): Countdown {
	const active = useObservable(() => {
		if (linkedState) return linkedState.get();
		return false;
	});
	const intervalId = useObservable<number | undefined>();

	function start() {
		if (linkedState) linkedState.set(true);
		else active.set(true);
	}
	function pause() {
		if (linkedState) linkedState.set(false);
		else active.set(false);
	}
	function toggle() {
		if (linkedState) linkedState.set(!linkedState.peek());
		else active.set(!active.peek());
	}
	function reset(to: number, pause = true) {
		if (pause) {
			active.set(false);
			if (linkedState) linkedState.set(false);
		}
		duration.set(to);
	}

	useFocusEffect(
		useCallback(() => {
			return () => {
				if (linkedState) linkedState.set(false);
				else active.set(false);
			};
		}, [linkedState, active]),
	);

	useObserve(() => {
		if (intervalId.peek()) clearInterval(intervalId.peek());

		if (active.get()) {
			intervalId.set(
				setInterval(() => {
					if (duration.peek() > 0) duration.set(duration.peek() - 1);
					else {
						if (linkedState) linkedState.set(false);
						else active.set(false);
					}
				}, 1000),
			);
		}
	});

	return {
		active,
		start,
		pause,
		toggle,
		reset,
	};
}
