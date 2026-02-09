<template>
  <ion-chip :outline="true">
    <ion-avatar v-if="imageUrl" style="width: 20px; height: 16px; --border-radius: 2px;">
      <img :src="imageUrl" :alt="text" style="object-fit: contain; width: 100%; height: 100%;" />
    </ion-avatar>
    <ion-label>{{ text }}</ion-label>
    <ion-icon v-if="removable" :icon="closeCircle" @click.stop="$emit('remove', text)" />
  </ion-chip>
</template>

<script setup lang="ts">
import { IonAvatar, IonChip, IonIcon, IonLabel } from "@ionic/vue";
import { closeCircle } from "ionicons/icons";

const props = defineProps<{
	text: string;
	imageUrl?: string;
}>();

defineEmits<{
	remove: [text: string];
}>();

const removable = !!props.imageUrl !== undefined;
</script>
