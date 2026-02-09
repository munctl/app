<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="router.push('/committee/create')">
            <ion-icon slot="icon-only" :icon="addOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list v-if="committeeList.length > 0">
        <ion-item-sliding v-for="committee in committeeList" :key="committee.id">
          <ion-item-options side="start">
            <ion-item-option color="primary" @click="openEditDialog(committee)">
              <ion-icon slot="icon-only" :icon="createOutline" />
            </ion-item-option>
          </ion-item-options>

          <ion-item button @click="router.push(`/committee/${committee.id}`)">
            <ion-label>
              <h2>{{ committee.name }}</h2>
              <p>{{ committee.delegations.length }} Delegation{{ committee.delegations.length !== 1 ? 's' : '' }}</p>
              <p>
                Created {{ formatDate(committee.createdAt) }} · Modified {{ formatDate(committee.updatedAt) }}
              </p>
            </ion-label>
          </ion-item>

          <ion-item-options side="end">
            <ion-item-option color="danger" @click="handleDelete(committee.id)">
              <ion-icon slot="icon-only" :icon="trashOutline" />
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <div v-else class="ion-text-center ion-padding-top">
        <p style="color: var(--ion-color-medium)">You are not a member of any committees.</p>
      </div>

      <!-- Edit Dialog -->
      <ion-modal :is-open="editDialogOpen" @did-dismiss="editDialogOpen = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>Edit Committee</ion-title>
            <ion-buttons slot="start">
              <ion-button @click="editDialogOpen = false">Cancel</ion-button>
            </ion-buttons>
            <ion-buttons slot="end">
              <ion-button :strong="true" @click="handleEditSubmit">Save</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <CommitteeForm v-model:name="editName" v-model:delegations="editDelegations" />
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import CommitteeForm from "@/components/committee/CommitteeForm.vue";
import type { Committee } from "@/models/Committee";
import type { DelegationReduced } from "@/models/Delegation";
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
	IonPage,
	IonTitle,
	IonToolbar,
	alertController,
} from "@ionic/vue";
import dayjs from "dayjs";
import { addOutline, createOutline, trashOutline } from "ionicons/icons";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useCommitteeStore();

const committeeList = computed(() => store.committeeList);

const editDialogOpen = ref(false);
const editId = ref("");
const editName = ref("");
const editDelegations = ref<DelegationReduced[]>([]);

function formatDate(dateStr: string): string {
	return dayjs(dateStr).format("MMM D YYYY HH:mm");
}

function openEditDialog(committee: Committee) {
	editId.value = committee.id;
	editName.value = committee.name;
	editDelegations.value = [...committee.delegations];
	editDialogOpen.value = true;
}

function handleEditSubmit() {
	if (!editName.value.trim()) {
		alert("Please enter a name for the committee.");
		return;
	}
	if (editDelegations.value.length < 1) {
		alert("Please add at least one delegation.");
		return;
	}
	store.updateCommittee({
		id: editId.value,
		name: editName.value,
		delegations: editDelegations.value,
	});
	editDialogOpen.value = false;
}

async function handleDelete(id: string) {
	const alert = await alertController.create({
		header: "Delete Committee",
		message: "Are you sure you want to delete this committee?",
		buttons: [
			{ text: "Cancel", role: "cancel" },
			{
				text: "Delete",
				role: "destructive",
				handler: () => {
					store.deleteCommittee(id);
				},
			},
		],
	});
	await alert.present();
}
</script>
