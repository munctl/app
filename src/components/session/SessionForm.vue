<template>
  <div>
    <ion-item>
      <ion-input
        label="Session Name"
        label-placement="stacked"
        :value="name"
        @ion-input="$emit('update:name', ($event.target as HTMLIonInputElement).value)"
      />
    </ion-item>
  </div>
</template>

<script setup lang="ts">
import { IonInput, IonItem } from "@ionic/vue";

defineProps<{
	name: string;
}>();

defineEmits<{
	"update:name": [value: string];
}>();
</script>
