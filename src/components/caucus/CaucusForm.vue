<template>
  <div>
    <ion-item>
      <ion-input
        label="Caucus Topic"
        label-placement="stacked"
        :value="topic"
        @ion-input="$emit('update:topic', ($event.target as HTMLIonInputElement).value)"
      />
    </ion-item>

    <ion-item v-if="caucusType !== CaucusType.GSL">
      <ion-input
        label="Caucus Time (seconds)"
        label-placement="stacked"
        type="number"
        :value="initialCaucusTime"
        @ion-input="$emit('update:initialCaucusTime', Number(($event.target as HTMLIonInputElement).value))"
      />
      <p style="color: var(--ion-color-medium); font-size: 0.85em; padding-top: 4px;">
        This will reset the remaining caucus time to this value.
      </p>
    </ion-item>

    <ion-item v-if="caucusType !== CaucusType.UNMODERATED">
      <ion-input
        label="Speaker Time (seconds)"
        label-placement="stacked"
        type="number"
        :value="initialSpeakerTime"
        @ion-input="$emit('update:initialSpeakerTime', Number(($event.target as HTMLIonInputElement).value))"
      />
    </ion-item>
  </div>
</template>

<script setup lang="ts">
import type { CaucusType } from "@/models/Caucus";
import { IonInput, IonItem } from "@ionic/vue";

defineProps<{
	topic: string;
	initialSpeakerTime: number;
	initialCaucusTime: number;
	caucusType: CaucusType;
}>();

defineEmits<{
	"update:topic": [value: string];
	"update:initialSpeakerTime": [value: number];
	"update:initialCaucusTime": [value: number];
}>();
</script>
