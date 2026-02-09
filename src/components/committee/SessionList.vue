<template>
  <div>
    <ion-list v-if="sessionArray.length > 0">
      <ion-item-sliding v-for="session in sessionArray" :key="session.id">
        <ion-item-options side="start">
          <ion-item-option color="primary" @click="openEditDialog(session)">
            <ion-icon slot="icon-only" :icon="createOutline" />
          </ion-item-option>
        </ion-item-options>

        <ion-item button :router-link="`/committee/${committeeId}/session/${session.id}`">
          <ion-label>
            <h2>{{ session.name }}</h2>
            <p>Created {{ formatDate(session.createdAt) }} · Modified {{ formatDate(session.updatedAt) }}</p>
          </ion-label>
        </ion-item>

        <ion-item-options side="end">
          <ion-item-option color="danger" @click="handleDelete(session.id)">
            <ion-icon slot="icon-only" :icon="trashOutline" />
          </ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
    </ion-list>

    <p v-else style="color: var(--ion-color-medium)">
      This committee does not have any associated sessions.
    </p>

    <!-- Edit Session Modal -->
    <ion-modal :is-open="editOpen" @did-dismiss="editOpen = false">
      <ion-header>
        <ion-toolbar>
          <ion-title>Edit Session</ion-title>
          <ion-buttons slot="start">
            <ion-button @click="editOpen = false">Cancel</ion-button>
          </ion-buttons>
          <ion-buttons slot="end">
            <ion-button :strong="true" @click="handleEditSubmit">Save</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <SessionForm v-model:name="editName" />
      </ion-content>
    </ion-modal>
  </div>
</template>

<script setup lang="ts">
import SessionForm from "@/components/session/SessionForm.vue";
import type { Session } from "@/models/Session";
import { useCommitteeStore } from "@/stores/committees";
import {
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
	IonTitle,
	IonToolbar,
} from "@ionic/vue";
import dayjs from "dayjs";
import { createOutline, trashOutline } from "ionicons/icons";
import { computed, ref } from "vue";

const props = defineProps<{
	sessions: Record<string, Session>;
	committeeId: string;
}>();

const store = useCommitteeStore();

const sessionArray = computed(() => Object.values(props.sessions));

const editOpen = ref(false);
const editId = ref("");
const editName = ref("");

function formatDate(dateStr: string): string {
	return dayjs(dateStr).format("MMM D YYYY HH:mm");
}

function openEditDialog(session: Session) {
	editId.value = session.id;
	editName.value = session.name;
	editOpen.value = true;
}

function handleEditSubmit() {
	if (!editName.value.trim()) {
		alert("Please enter a name for the session.");
		return;
	}
	store.updateSession(props.committeeId, editId.value, {
		name: editName.value,
	});
	editOpen.value = false;
}

function handleDelete(sessionId: string) {
	store.deleteSession(props.committeeId, sessionId);
}
</script>
