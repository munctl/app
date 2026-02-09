<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :default-href="`/committee/${cid}`" />
        </ion-buttons>
        <ion-title>{{ delegation?.entity.name ?? 'Delegation' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <template v-if="delegation">
        <ion-card>
          <ion-card-header>
            <ion-card-title>{{ delegation.entity.name }}</ion-card-title>
            <ion-card-subtitle>
              (placeholder: 2) Delegates assigned | Voting Power: {{ delegation.votingPower }}
            </ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            <ion-card>
              <ion-card-header>
                <ion-card-title>John Doe</ion-card-title>
                <ion-card-subtitle>john@doe.com | Login disabled</ion-card-subtitle>
              </ion-card-header>
            </ion-card>

            <ion-card>
              <ion-card-header>
                <ion-card-title>Jane Doe</ion-card-title>
                <ion-card-subtitle>jane@doe.com | Login enabled</ion-card-subtitle>
              </ion-card-header>
            </ion-card>
          </ion-card-content>
        </ion-card>
      </template>

      <div v-else class="ion-text-center ion-padding-top">
        <p>Could not find a delegation with the given ID.</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useCommitteeStore } from "@/stores/committees";
import {
	IonBackButton,
	IonButtons,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardSubtitle,
	IonCardTitle,
	IonContent,
	IonHeader,
	IonPage,
	IonTitle,
	IonToolbar,
} from "@ionic/vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const cid = route.params.cid as string;
const did = route.params.did as string;
const store = useCommitteeStore();

const committee = computed(() => store.getCommittee(cid));
const delegation = computed(() =>
	committee.value?.delegations.find((d) => d.id === did),
);
</script>
