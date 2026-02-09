<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :default-href="`/committee/${cid}/session/${sid}`" />
        </ion-buttons>
        <ion-title>{{ pageTitle }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Caucus Menubar -->
      <CaucusMenubar
        :caucuses="session?.caucuses ?? {}"
        :current-caucus-id="caid"
        :committee-id="cid"
        :session-id="sid"
      />

      <div class="ion-padding">
        <template v-if="caucus && committee">
          <GSL
            v-if="caucus.type === CaucusType.GSL"
            :caucus="caucus"
            :committee="committee"
            :committee-id="cid"
            :session-id="sid"
            :caucus-id="caid"
          />
          <Moderated
            v-else-if="caucus.type === CaucusType.MODERATED"
            :caucus="caucus"
            :committee="committee"
            :committee-id="cid"
            :session-id="sid"
            :caucus-id="caid"
          />
          <Unmoderated
            v-else-if="caucus.type === CaucusType.UNMODERATED"
            :caucus="caucus"
            :committee-id="cid"
            :session-id="sid"
            :caucus-id="caid"
          />
        </template>

        <div v-else class="ion-text-center ion-padding-top">
          <p>Could not find a caucus with the given ID.</p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import CaucusMenubar from "@/components/caucus/CaucusMenubar.vue";
import GSL from "@/components/caucus/GSL.vue";
import Moderated from "@/components/caucus/Moderated.vue";
import Unmoderated from "@/components/caucus/Unmoderated.vue";
import { CaucusType } from "@/models/Caucus";
import { useCommitteeStore } from "@/stores/committees";
import {
	IonBackButton,
	IonButtons,
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
const sid = route.params.sid as string;
const caid = route.params.caid as string;
const store = useCommitteeStore();

const committee = computed(() => store.getCommittee(cid));
const session = computed(() => store.getSession(cid, sid));
const caucus = computed(() => store.getCaucus(cid, sid, caid));

const pageTitle = computed(() => {
	if (!caucus.value) return "Caucuses";
	switch (caucus.value.type) {
		case CaucusType.GSL:
			return "General Speakers List";
		case CaucusType.MODERATED:
			return `Moderated: ${caucus.value.topic}`;
		case CaucusType.UNMODERATED:
			return "Unmoderated Caucus";
		default:
			return "Caucuses";
	}
});
</script>
