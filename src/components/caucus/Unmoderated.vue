<template>
  <ion-card>
    <ion-card-header style="text-align: center;">
      <ion-card-title>Unmoderated Caucus</ion-card-title>
      <ion-card-subtitle>{{ caucus.topic }}</ion-card-subtitle>
    </ion-card-header>

    <ion-card-content>
      <div style="text-align: center; margin: 32px 0;">
        <h1 :style="{ fontSize: '3rem', fontWeight: 700, color: timeColor(caucusCountdown.remaining.value), margin: 0 }">
          {{ secondsToTimeString(caucusCountdown.remaining.value) }}
          <span style="color: var(--ion-color-medium); font-weight: 400;">
            / {{ secondsToTimeString(caucus.initialCaucusTime ?? 600) }}
          </span>
        </h1>
      </div>

      <div style="display: flex; gap: 8px; justify-content: center;">
        <ion-button style="flex: 1" @click="caucusCountdown.toggle()">
          {{ caucusCountdown.isRunning.value ? 'Pause' : 'Resume' }}
        </ion-button>
        <ion-button style="flex: 1" @click="caucusCountdown.reset(caucus.initialCaucusTime ?? 600)">
          Reset
        </ion-button>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { useCountdown } from "@/composables/useCountdown";
import { secondsToTimeString, timeColor } from "@/lib/utils";
import type { Caucus } from "@/models/Caucus";
import {
	IonButton,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardSubtitle,
	IonCardTitle,
} from "@ionic/vue";

const props = defineProps<{
	caucus: Caucus;
	committeeId: string;
	sessionId: string;
	caucusId: string;
}>();

const caucusCountdown = useCountdown(props.caucus.currentCaucusTime ?? 600);
</script>
