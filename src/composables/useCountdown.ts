import { type Ref, onUnmounted, ref, watch } from "vue";

export interface Countdown {
	remaining: Ref<number>;
	isRunning: Ref<boolean>;
	start: () => void;
	pause: () => void;
	toggle: () => void;
	reset: (to: number, shouldPause?: boolean) => void;
}

/**
 * Countdown timer composable.
 * @param initial - Initial time in seconds.
 * @param linkedRunning - Optional external ref that controls running state (master/slave linking).
 */
export function useCountdown(
	initial: number,
	linkedRunning?: Ref<boolean>,
): Countdown {
	const remaining = ref(initial);
	const isRunning = linkedRunning ?? ref(false);
	let intervalId: ReturnType<typeof setInterval> | null = null;

	function clearTimer() {
		if (intervalId !== null) {
			clearInterval(intervalId);
			intervalId = null;
		}
	}

	function startTimer() {
		clearTimer();
		intervalId = setInterval(() => {
			if (remaining.value > 0) {
				remaining.value--;
			} else {
				isRunning.value = false;
			}
		}, 1000);
	}

	function start() {
		isRunning.value = true;
	}

	function pause() {
		isRunning.value = false;
	}

	function toggle() {
		isRunning.value = !isRunning.value;
	}

	function reset(to: number, shouldPause = true) {
		if (shouldPause) {
			isRunning.value = false;
		}
		remaining.value = to;
	}

	watch(
		isRunning,
		(running) => {
			if (running) {
				startTimer();
			} else {
				clearTimer();
			}
		},
		{ immediate: true },
	);

	onUnmounted(() => {
		clearTimer();
	});

	return {
		remaining,
		isRunning,
		start,
		pause,
		toggle,
		reset,
	};
}
