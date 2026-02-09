<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/home" />
        </ion-buttons>
        <ion-title>{{ committee?.name ?? 'Committee' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <template v-if="committee">
        <ion-card>
          <ion-card-header>
            <ion-card-title>{{ committee.name }}</ion-card-title>
            <ion-card-subtitle>
              Created {{ formatDate(committee.createdAt) }} · Modified {{ formatDate(committee.updatedAt) }}
            </ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            <!-- Sessions -->
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <h3 style="margin: 0; font-weight: 600;">Sessions</h3>
              <ion-button size="small" fill="clear" @click="createSessionOpen = true">
                <ion-icon :icon="addOutline" slot="icon-only" />
              </ion-button>
            </div>

            <SessionList
              :sessions="committee.sessions"
              :committee-id="cid"
            />

            <!-- Delegations -->
            <h3 style="font-weight: 600; margin-top: 24px; margin-bottom: 8px;">Delegations</h3>
            <ion-list v-if="committee.delegations.length > 0">
              <ion-item
                v-for="d in committee.delegations"
                :key="d.id"
                button
                :router-link="`/committee/${cid}/delegation/${d.id}`"
                :detail="true"
              >
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
            <p v-else style="color: var(--ion-color-medium)">No delegations yet.</p>
          </ion-card-content>
        </ion-card>
      </template>

      <div v-else class="ion-text-center ion-padding-top">
        <p>Could not find a committee with the given ID.</p>
      </div>

      <!-- Create Session Modal -->
      <ion-modal :is-open="createSessionOpen" @did-dismiss="createSessionOpen = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>Create Session</ion-title>
            <ion-buttons slot="start">
              <ion-button @click="createSessionOpen = false">Cancel</ion-button>
            </ion-buttons>
            <ion-buttons slot="end">
              <ion-button :strong="true" @click="handleCreateSession">Create</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <SessionForm v-model:name="newSessionName" />
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import SessionList from "@/components/committee/SessionList.vue";
import SessionForm from "@/components/session/SessionForm.vue";
import { flagUrl, generateId } from "@/lib/utils";
import { CaucusType } from "@/models/Caucus";
import type { Session } from "@/models/Session";
import { useCommitteeStore } from "@/stores/committees";
import {
	IonAvatar,
	IonBackButton,
	IonButton,
	IonButtons,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardSubtitle,
	IonCardTitle,
	IonContent,
	IonHeader,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonModal,
	IonPage,
	IonTitle,
	IonToolbar,
} from "@ionic/vue";
import dayjs from "dayjs";
import { addOutline } from "ionicons/icons";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const cid = route.params.cid as string;
const store = useCommitteeStore();

const committee = computed(() => store.getCommittee(cid));

const createSessionOpen = ref(false);
const newSessionName = ref("");

function formatDate(dateStr: string): string {
	return dayjs(dateStr).format("YYYY-MM-DD HH:mm");
}

function handleCreateSession() {
	if (!newSessionName.value.trim()) {
		alert("Please enter a session name.");
		return;
	}

	const sessionId = generateId();
	const now = new Date().toISOString();
	const gslId = sessionId; // GSL shares the session ID as convention

	const session: Session = {
		id: sessionId,
		name: newSessionName.value,
		createdAt: now,
		updatedAt: now,
		startDate: now,
		endDate: now,
		attendance: {},
		caucuses: {
			[gslId]: {
				id: gslId,
				topic: "General Speakers List",
				type: CaucusType.GSL,
				createdAt: now,
				updatedAt: now,
				queue: [],
				initialSpeakerTime: 60,
				currentSpeakerTime: 60,
			},
		},
	};

	store.addSession(cid, session);
	createSessionOpen.value = false;
	newSessionName.value = "";
}
</script>
