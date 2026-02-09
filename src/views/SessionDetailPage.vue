<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :default-href="`/committee/${cid}`" />
        </ion-buttons>
        <ion-title>{{ session?.name ?? 'Session' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <template v-if="session && committee">
        <ion-card>
          <ion-card-header>
            <ion-card-title>{{ session.name }}</ion-card-title>
            <ion-card-subtitle>Committee: {{ committee.name }}</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            <!-- Attendance Display -->
            <AttendanceDisplay
              :attendance="session.attendance"
              :delegations="committee.delegations"
            />

            <!-- Roll Call Button -->
            <ion-button
              expand="block"
              size="small"
              :fill="attendanceCount < committee.delegations.length ? 'solid' : 'outline'"
              style="margin-top: 12px; margin-bottom: 24px;"
              @click="rollCallOpen = true"
            >
              {{ attendanceCount < committee.delegations.length ? 'Roll Call' : 'Repeat Roll Call' }}
            </ion-button>

            <!-- Launch Session -->
            <ion-button
              v-if="attendanceCount > 0"
              expand="block"
              @click="launchSession"
            >
              Launch Session
            </ion-button>
          </ion-card-content>
        </ion-card>
      </template>

      <div v-else class="ion-text-center ion-padding-top">
        <p>Could not find a session with the given ID.</p>
      </div>

      <!-- Roll Call Modal -->
      <ion-modal :is-open="rollCallOpen" @did-dismiss="rollCallOpen = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>Roll Call</ion-title>
            <ion-buttons slot="start">
              <ion-button @click="rollCallOpen = false">Cancel</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <p style="color: var(--ion-color-medium); margin-bottom: 12px;">{{ session?.name }}</p>
          <RollCall
            v-if="committee"
            :delegations="committee.delegations"
            :current-attendance="session?.attendance ?? {}"
            @submit="handleRollCallSubmit"
            @cancel="rollCallOpen = false"
          />
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import AttendanceDisplay from "@/components/session/AttendanceDisplay.vue";
import RollCall from "@/components/session/RollCall.vue";
import type { AttendanceType } from "@/models/SharedTypes";
import { useCommitteeStore } from "@/stores/committees";
import {
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
	IonModal,
	IonPage,
	IonTitle,
	IonToolbar,
} from "@ionic/vue";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const cid = route.params.cid as string;
const sid = route.params.sid as string;
const store = useCommitteeStore();

const committee = computed(() => store.getCommittee(cid));
const session = computed(() => store.getSession(cid, sid));

const attendanceCount = computed(
	() => Object.keys(session.value?.attendance ?? {}).length,
);

const rollCallOpen = ref(false);

function handleRollCallSubmit(attendance: Record<string, AttendanceType>) {
	store.setAllAttendance(cid, sid, attendance);
	rollCallOpen.value = false;
}

function launchSession() {
	// Navigate to the first caucus (typically the GSL which shares the session ID)
	const caucuses = session.value?.caucuses ?? {};
	const firstCaucusId = Object.keys(caucuses)[0] ?? sid;
	router.push(`/committee/${cid}/session/${sid}/caucus/${firstCaucusId}`);
}
</script>
