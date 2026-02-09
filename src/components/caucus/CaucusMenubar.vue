<template>
  <div style="padding: 8px 16px;">
    <div style="display: flex; gap: 8px;">
      <ion-button expand="block" fill="outline" style="flex: 1" @click="selectDrawerOpen = true">
        {{ currentCaucus?.topic ?? 'Select Caucus' }}
        <ion-icon :icon="chevronDown" slot="end" />
      </ion-button>
      <ion-button fill="outline" @click="createDrawerOpen = true">
        <ion-icon :icon="addOutline" slot="icon-only" />
      </ion-button>
    </div>

    <!-- Select Caucus Sheet -->
    <ion-modal
      :is-open="selectDrawerOpen"
      :initial-breakpoint="0.5"
      :breakpoints="[0, 0.5, 0.75]"
      @did-dismiss="selectDrawerOpen = false"
    >
      <ion-header>
        <ion-toolbar>
          <ion-title>Select Activity</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-list>
          <ion-item-sliding v-for="c in caucusArray" :key="c.id">
            <ion-item-options side="start">
              <ion-item-option color="primary" @click="openEditDialog(c)">
                <ion-icon slot="icon-only" :icon="createOutline" />
              </ion-item-option>
            </ion-item-options>

            <ion-item
              button
              @click="navigateToCaucus(c.id)"
              :color="c.id === currentCaucusId ? 'primary' : undefined"
            >
              <ion-icon
                slot="start"
                :icon="c.type === CaucusType.GSL ? listOutline : c.type === CaucusType.MODERATED ? micOutline : peopleOutline"
              />
              <ion-label>{{ c.topic }}</ion-label>
            </ion-item>

            <ion-item-options v-if="c.type !== CaucusType.GSL" side="end">
              <ion-item-option color="danger" @click="handleDeleteCaucus(c.id)">
                <ion-icon slot="icon-only" :icon="trashOutline" />
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        </ion-list>
      </ion-content>
    </ion-modal>

    <!-- Create Caucus Sheet -->
    <ion-modal
      :is-open="createDrawerOpen"
      :initial-breakpoint="0.35"
      :breakpoints="[0, 0.35, 0.5]"
      @did-dismiss="createDrawerOpen = false"
    >
      <ion-header>
        <ion-toolbar>
          <ion-title>Create</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <ion-button expand="block" @click="handleAddCaucus(CaucusType.MODERATED)">
            <ion-icon :icon="micOutline" slot="start" />
            New Moderated
          </ion-button>
          <ion-button expand="block" @click="handleAddCaucus(CaucusType.UNMODERATED)">
            <ion-icon :icon="peopleOutline" slot="start" />
            New Unmoderated
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>

    <!-- Edit Caucus Modal -->
    <ion-modal :is-open="editOpen" @did-dismiss="editOpen = false">
      <ion-header>
        <ion-toolbar>
          <ion-title>Edit Caucus</ion-title>
          <ion-buttons slot="start">
            <ion-button @click="editOpen = false">Cancel</ion-button>
          </ion-buttons>
          <ion-buttons slot="end">
            <ion-button :strong="true" @click="handleEditSubmit">Save</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <CaucusForm
          v-model:topic="editTopic"
          v-model:initial-speaker-time="editSpeakerTime"
          v-model:initial-caucus-time="editCaucusTime"
          :caucus-type="editType"
        />
      </ion-content>
    </ion-modal>
  </div>
</template>

<script setup lang="ts">
import CaucusForm from "@/components/caucus/CaucusForm.vue";
import { generateId } from "@/lib/utils";
import { type Caucus, CaucusType } from "@/models/Caucus";
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
import {
	addOutline,
	chevronDown,
	createOutline,
	listOutline,
	micOutline,
	peopleOutline,
	trashOutline,
} from "ionicons/icons";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{
	caucuses: Record<string, Caucus>;
	currentCaucusId: string;
	committeeId: string;
	sessionId: string;
}>();

const router = useRouter();
const store = useCommitteeStore();

const caucusArray = computed(() => Object.values(props.caucuses));
const currentCaucus = computed(() => props.caucuses[props.currentCaucusId]);

const selectDrawerOpen = ref(false);
const createDrawerOpen = ref(false);
const editOpen = ref(false);

const editId = ref("");
const editTopic = ref("");
const editSpeakerTime = ref(60);
const editCaucusTime = ref(600);
const editType = ref<CaucusType>(CaucusType.GSL);

function navigateToCaucus(caucusId: string) {
	selectDrawerOpen.value = false;
	if (caucusId !== props.currentCaucusId) {
		router.replace(
			`/committee/${props.committeeId}/session/${props.sessionId}/caucus/${caucusId}`,
		);
	}
}

function handleAddCaucus(type: CaucusType) {
	const id = generateId();
	const now = new Date().toISOString();
	store.addCaucus(props.committeeId, props.sessionId, {
		id,
		type,
		topic: "Undefined Topic",
		initialCaucusTime: 600,
		currentCaucusTime: 600,
		initialSpeakerTime: type !== CaucusType.UNMODERATED ? 60 : undefined,
		currentSpeakerTime: type !== CaucusType.UNMODERATED ? 60 : undefined,
		queue: [],
		createdAt: now,
		updatedAt: now,
	});
	createDrawerOpen.value = false;
	router.replace(
		`/committee/${props.committeeId}/session/${props.sessionId}/caucus/${id}`,
	);
}

function openEditDialog(caucus: Caucus) {
	editId.value = caucus.id;
	editTopic.value = caucus.topic;
	editSpeakerTime.value = caucus.initialSpeakerTime ?? 60;
	editCaucusTime.value = caucus.initialCaucusTime ?? 600;
	editType.value = caucus.type;
	selectDrawerOpen.value = false;
	editOpen.value = true;
}

function handleEditSubmit() {
	const prev = props.caucuses[editId.value];
	if (!prev) return;

	store.updateCaucus(props.committeeId, props.sessionId, editId.value, {
		topic: editTopic.value,
		initialCaucusTime: editCaucusTime.value,
		currentCaucusTime:
			editCaucusTime.value !== prev.initialCaucusTime
				? editCaucusTime.value
				: prev.currentCaucusTime,
		initialSpeakerTime: editSpeakerTime.value,
		currentSpeakerTime:
			editSpeakerTime.value !== prev.initialSpeakerTime
				? editSpeakerTime.value
				: prev.currentSpeakerTime,
	});
	editOpen.value = false;
}

function handleDeleteCaucus(id: string) {
	store.deleteCaucus(props.committeeId, props.sessionId, id);
	if (id === props.currentCaucusId) {
		// Navigate to first remaining caucus
		const remaining = Object.keys(props.caucuses).filter((k) => k !== id);
		if (remaining.length > 0) {
			router.replace(
				`/committee/${props.committeeId}/session/${props.sessionId}/caucus/${remaining[0]}`,
			);
		}
	}
	selectDrawerOpen.value = false;
}
</script>
