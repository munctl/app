<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/home" />
        </ion-buttons>
        <ion-title>Create Committee</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h2 style="margin-bottom: 16px;">Create Committee</h2>
      <CommitteeForm v-model:name="name" v-model:delegations="delegations" />
      <div style="display: flex; gap: 8px; margin-top: 24px;">
        <ion-button expand="block" fill="outline" style="flex: 1" @click="router.back()">
          Cancel
        </ion-button>
        <ion-button expand="block" style="flex: 1" @click="onSubmit">
          Create
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import CommitteeForm from "@/components/committee/CommitteeForm.vue";
import { generateId } from "@/lib/utils";
import type { Committee } from "@/models/Committee";
import type { DelegationReduced } from "@/models/Delegation";
import { useCommitteeStore } from "@/stores/committees";
import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonPage,
	IonTitle,
	IonToolbar,
} from "@ionic/vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useCommitteeStore();

const name = ref("");
const delegations = ref<DelegationReduced[]>([]);

function onSubmit() {
	if (!name.value.trim()) {
		alert("Please enter a name for the committee.");
		return;
	}
	if (delegations.value.length < 1) {
		alert("Please add at least one delegation to the committee.");
		return;
	}

	const now = new Date().toISOString();
	const committee: Committee = {
		id: generateId(),
		name: name.value,
		createdAt: now,
		updatedAt: now,
		sessions: {},
		admins: [],
		users: [],
		delegations: delegations.value,
	};

	store.addCommittee(committee);
	router.back();
}
</script>
