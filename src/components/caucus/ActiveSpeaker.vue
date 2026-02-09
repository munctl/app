<template>
  <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px;" :style="{ opacity: hasSpeaker ? 1 : 0.4, pointerEvents: hasSpeaker ? 'auto' : 'none' }">
    <div style="text-align: center; width: 100%;">
      <img
        v-if="speaker?.code"
        :src="flagUrl(speaker.code)"
        :alt="speaker.name"
        style="height: 80px; max-width: 240px; object-fit: contain; margin: 0 auto; display: block;"
      />
      <h4 style="font-weight: 600; margin-top: 8px;">
        {{ hasSpeaker ? speaker?.name : 'No Speaker' }}
      </h4>
      <p>
        <span :style="{ fontWeight: 600, color: timeColor(speakerCountdown.remaining.value) }">
          {{ secondsToTimeString(speakerCountdown.remaining.value) }}
        </span>
        <span style="color: var(--ion-color-medium)">
          / {{ secondsToTimeString(initialSpeakerTime) }}
        </span>
      </p>
    </div>

    <div style="display: flex; gap: 6px;">
      <ion-button size="small" :disabled="!hasSpeaker" @click="handleToggle">
        {{ speakerCountdown.isRunning.value ? 'Pause' : 'Resume' }}
      </ion-button>
      <ion-button size="small" :disabled="!hasSpeaker" @click="handleReset">
        Reset
      </ion-button>
      <ion-button size="small" :disabled="!hasSpeaker" @click="handleNext">
        Next
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Countdown } from "@/composables/useCountdown";
import { flagUrl, secondsToTimeString, timeColor } from "@/lib/utils";
import type { QueueEntry } from "@/models/Caucus";
import { IonButton } from "@ionic/vue";
import { computed } from "vue";

const props = defineProps<{
	queue: QueueEntry[];
	initialSpeakerTime: number;
	speakerCountdown: Countdown;
	caucusCountdown?: Countdown;
}>();

const emit = defineEmits<{
	next: [];
}>();

const hasSpeaker = computed(() => props.queue.length > 0);
const speaker = computed(() =>
	props.queue.length > 0 ? props.queue[0] : undefined,
);

function handleToggle() {
	props.speakerCountdown.toggle();
	if (props.speakerCountdown.isRunning.value && props.caucusCountdown) {
		props.caucusCountdown.start();
	}
}

function handleReset() {
	if (props.caucusCountdown) {
		const elapsed =
			props.initialSpeakerTime - props.speakerCountdown.remaining.value;
		const compensated = props.caucusCountdown.remaining.value + elapsed;
		props.caucusCountdown.reset(compensated, true);
	}
	props.speakerCountdown.reset(props.initialSpeakerTime, true);
}

function handleNext() {
	emit("next");
	props.speakerCountdown.reset(props.initialSpeakerTime, true);
}
</script>
