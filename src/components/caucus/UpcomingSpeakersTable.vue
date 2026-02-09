<template>
  <div>
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
      <h4 style="font-weight: 600; margin: 0;">Upcoming Speakers</h4>
      <ion-button size="small" fill="clear" @click="pickerOpen = true">
        <ion-icon :icon="addOutline" slot="icon-only" />
      </ion-button>
    </div>

    <ion-list v-if="upcomingSpeakers.length > 0">
      <ion-item-sliding v-for="(speaker, idx) in upcomingSpeakers" :key="idx">
        <ion-item>
          <ion-avatar slot="start" style="width: 32px; height: 24px; --border-radius: 2px;">
            <img :src="flagUrl(speaker.code)" :alt="speaker.name" style="object-fit: contain; width: 100%; height: 100%;" />
          </ion-avatar>
          <ion-label>{{ speaker.name }}</ion-label>
          <div slot="end" style="display: flex; gap: 4px;">
            <ion-button size="small" fill="outline" @click="$emit('move', realIndex(idx), 'up')" :disabled="idx === 0">
              <ion-icon :icon="arrowUp" slot="icon-only" />
            </ion-button>
            <ion-button size="small" fill="outline" @click="$emit('move', realIndex(idx), 'down')" :disabled="idx === upcomingSpeakers.length - 1">
              <ion-icon :icon="arrowDown" slot="icon-only" />
            </ion-button>
          </div>
        </ion-item>

        <ion-item-options side="end">
          <ion-item-option color="danger" @click="$emit('remove', realIndex(idx))">
            <ion-icon slot="icon-only" :icon="trashOutline" />
          </ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
    </ion-list>

    <p v-else style="color: var(--ion-color-medium); padding: 8px 0;">No upcoming speakers.</p>

    <!-- Country Picker Modal -->
    <ion-modal :is-open="pickerOpen" @did-dismiss="pickerOpen = false">
      <ion-header>
        <ion-toolbar>
          <ion-title>Add Speaker</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="pickerOpen = false">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
        <ion-toolbar>
          <ion-searchbar v-model="searchQuery" placeholder="Search delegations..." />
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list>
          <ion-item v-for="d in filteredDelegations" :key="d.id" button @click="handleAddSpeaker(d)">
            <ion-avatar slot="start" style="width: 32px; height: 24px; --border-radius: 2px;">
              <img
                v-if="!d.isCustom"
                :src="flagUrl(d.entity.code)"
                :alt="d.entity.name"
                style="object-fit: contain; width: 100%; height: 100%;"
              />
            </ion-avatar>
            <ion-label>{{ d.entity.name }}</ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-modal>
  </div>
</template>

<script setup lang="ts">
import { flagUrl } from "@/lib/utils";
import type { QueueEntry } from "@/models/Caucus";
import type { DelegationReduced } from "@/models/Delegation";
import {
	IonAvatar,
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonItem,
	IonItemOption,
	IonItemOptions,
	IonItemSliding,
	IonLabel,
	IonList,
	IonModal,
	IonSearchbar,
	IonTitle,
	IonToolbar,
} from "@ionic/vue";
import { addOutline, arrowDown, arrowUp, trashOutline } from "ionicons/icons";
import { computed, ref } from "vue";

const props = defineProps<{
	queue: QueueEntry[];
	delegations: DelegationReduced[];
}>();

const emit = defineEmits<{
	add: [speaker: { name: string; code: string }];
	remove: [index: number];
	move: [index: number, direction: "up" | "down"];
}>();

const pickerOpen = ref(false);
const searchQuery = ref("");

// Upcoming speakers (skip first which is the active speaker)
const upcomingSpeakers = computed(() =>
	props.queue.length > 1 ? props.queue.slice(1) : [],
);

// Translate visual index to actual queue index (offset by 1 for active speaker)
function realIndex(visualIndex: number): number {
	return visualIndex + 1;
}

const filteredDelegations = computed(() => {
	const q = searchQuery.value.toLowerCase().trim();
	return props.delegations.filter(
		(d) =>
			q === "" ||
			d.entity.name.toLowerCase().includes(q) ||
			d.entity.code.toLowerCase().includes(q),
	);
});

function handleAddSpeaker(delegation: DelegationReduced) {
	emit("add", { name: delegation.entity.name, code: delegation.entity.code });
	pickerOpen.value = false;
	searchQuery.value = "";
}
</script>
