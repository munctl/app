<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>
        Moderated Caucus
        <br />
        <span :style="{ fontWeight: 700, color: timeColor(caucusCountdown.remaining.value) }">
          {{ secondsToTimeString(caucusCountdown.remaining.value) }}
        </span>
        <span style="color: var(--ion-color-medium); font-weight: 400;">
          / {{ secondsToTimeString(caucus.initialCaucusTime ?? 600) }}
        </span>
      </ion-card-title>
      <ion-card-subtitle>{{ caucus.topic }}</ion-card-subtitle>
    </ion-card-header>

    <ion-card-content>
      <div style="display: grid; grid-template-columns: 1fr; gap: 24px;">
        <ActiveSpeaker
          :queue="caucus.queue"
          :initial-speaker-time="caucus.initialSpeakerTime ?? 60"
          :speaker-countdown="speakerCountdown"
          :caucus-countdown="caucusCountdown"
          @next="handleNext"
        />

        <UpcomingSpeakersTable
          :queue="caucus.queue"
          :delegations="committee.delegations"
          @add="handleAddSpeaker"
          @remove="handleRemoveSpeaker"
          @move="handleMoveSpeaker"
        />
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { useCountdown } from "@/composables/useCountdown";
import { secondsToTimeString, timeColor } from "@/lib/utils";
import type { Caucus } from "@/models/Caucus";
import type { Committee } from "@/models/Committee";
import { useCommitteeStore } from "@/stores/committees";
import { useSettingsStore } from "@/stores/settings";
import {
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardSubtitle,
	IonCardTitle,
} from "@ionic/vue";
import { ref } from "vue";
import ActiveSpeaker from "./ActiveSpeaker.vue";
import UpcomingSpeakersTable from "./UpcomingSpeakersTable.vue";

const props = defineProps<{
	caucus: Caucus;
	committee: Committee;
	committeeId: string;
	sessionId: string;
	caucusId: string;
}>();

const store = useCommitteeStore();
const settings = useSettingsStore();

const speakerCountdown = useCountdown(props.caucus.currentSpeakerTime ?? 60);
const caucusCountdown = useCountdown(
	props.caucus.currentCaucusTime ?? 600,
	settings.linkCountdowns ? speakerCountdown.isRunning : undefined,
);

function handleNext() {
	store.advanceSpeaker(props.committeeId, props.sessionId, props.caucusId);
	speakerCountdown.reset(props.caucus.initialSpeakerTime ?? 60, true);
}

function handleAddSpeaker(speaker: { name: string; code: string }) {
	store.addSpeaker(props.committeeId, props.sessionId, props.caucusId, speaker);
}

function handleRemoveSpeaker(index: number) {
	store.removeSpeaker(
		props.committeeId,
		props.sessionId,
		props.caucusId,
		index,
	);
}

function handleMoveSpeaker(index: number, direction: "up" | "down") {
	store.moveSpeaker(
		props.committeeId,
		props.sessionId,
		props.caucusId,
		index,
		direction,
	);
}
</script>
