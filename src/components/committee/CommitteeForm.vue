<template>
  <div>
    <ion-item>
      <ion-input label="Committee Name" label-placement="stacked" :value="name" @ion-input="$emit('update:name', ($event.target as HTMLIonInputElement).value)" />
    </ion-item>

    <div style="margin-top: 16px">
      <ion-label style="font-weight: 600; padding-left: 16px">Delegations</ion-label>
      <div v-if="delegations.length > 0" style="display: flex; flex-wrap: wrap; gap: 8px; padding: 8px 16px;">
        <PillBadge
          v-for="d in delegations"
          :key="d.id"
          :text="d.entity.name"
          :image-url="d.isCustom ? undefined : flagUrl(d.entity.code)"
          @remove="handleRemoveDelegation(d.entity.name)"
        />
      </div>
      <p v-else style="color: var(--ion-color-medium); padding-left: 16px">No delegations added yet.</p>

      <div style="display: flex; gap: 8px; padding: 8px 16px; flex-wrap: wrap;">
        <ion-button size="small" @click="countryPickerOpen = true">
          <ion-icon :icon="addOutline" slot="start" />
          Add Country
        </ion-button>
        <ion-button size="small" @click="customDialogOpen = true">
          <ion-icon :icon="settingsOutline" slot="start" />
          Add Custom
        </ion-button>
      </div>
    </div>

    <!-- Country Picker Modal -->
    <ion-modal :is-open="countryPickerOpen" @did-dismiss="countryPickerOpen = false">
      <ion-header>
        <ion-toolbar>
          <ion-title>Select Country</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="countryPickerOpen = false">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
        <ion-toolbar>
          <ion-searchbar v-model="countrySearch" placeholder="Search countries..." />
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list>
          <ion-item v-for="country in filteredCountries" :key="country.code" button @click="handleAddCountry(country)">
            <ion-avatar slot="start" style="width: 32px; height: 24px; --border-radius: 2px;">
              <img :src="country.flag" :alt="country.name" style="object-fit: contain; width: 100%; height: 100%;" />
            </ion-avatar>
            <ion-label>{{ country.name }}</ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-modal>

    <!-- Custom Delegation Dialog -->
    <ion-modal :is-open="customDialogOpen" @did-dismiss="customDialogOpen = false">
      <ion-header>
        <ion-toolbar>
          <ion-title>Add Custom Delegation</ion-title>
          <ion-buttons slot="start">
            <ion-button @click="customDialogOpen = false">Cancel</ion-button>
          </ion-buttons>
          <ion-buttons slot="end">
            <ion-button :strong="true" @click="handleAddCustom">Add</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-item>
          <ion-input label="Name" label-placement="stacked" v-model="customName" />
        </ion-item>
        <ion-item>
          <ion-select label="Voting Power" label-placement="stacked" v-model="customVotingPower">
            <ion-select-option value="regular">Regular</ion-select-option>
            <ion-select-option value="VETO">Veto</ion-select-option>
            <ion-select-option value="none">None</ion-select-option>
          </ion-select>
        </ion-item>
      </ion-content>
    </ion-modal>
  </div>
</template>

<script setup lang="ts">
import PillBadge from "@/components/PillBadge.vue";
import { type CountryEntry, searchCountries } from "@/lib/countries";
import { flagUrl, generateId } from "@/lib/utils";
import { type DelegationReduced, VotingPower } from "@/models/Delegation";
import {
	IonAvatar,
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonList,
	IonModal,
	IonSearchbar,
	IonSelect,
	IonSelectOption,
	IonTitle,
	IonToolbar,
} from "@ionic/vue";
import { addOutline, settingsOutline } from "ionicons/icons";
import { computed, ref } from "vue";

const props = defineProps<{
	name: string;
	delegations: DelegationReduced[];
}>();

const emit = defineEmits<{
	"update:name": [value: string];
	"update:delegations": [value: DelegationReduced[]];
}>();

const countryPickerOpen = ref(false);
const customDialogOpen = ref(false);
const countrySearch = ref("");
const customName = ref("");
const customVotingPower = ref<string>("regular");

const excludedCodes = computed(() => props.delegations.map((d) => d.id));

const filteredCountries = computed(() =>
	searchCountries(countrySearch.value, excludedCodes.value),
);

function handleAddCountry(country: CountryEntry) {
	const delegation: DelegationReduced = {
		id: country.code,
		entity: {
			id: country.code,
			code: country.code,
			name: country.name,
		},
		votingPower: VotingPower.REGULAR,
	};
	emit("update:delegations", [...props.delegations, delegation]);
	countryPickerOpen.value = false;
	countrySearch.value = "";
}

function handleAddCustom() {
	if (!customName.value.trim()) {
		alert("Please enter a delegation name.");
		return;
	}
	const delegation: DelegationReduced = {
		id: customName.value.toLowerCase(),
		isCustom: true,
		entity: {
			id: generateId(),
			code: generateId(),
			name: customName.value,
		},
		votingPower: customVotingPower.value as VotingPower,
	};
	emit("update:delegations", [...props.delegations, delegation]);
	customDialogOpen.value = false;
	customName.value = "";
	customVotingPower.value = "regular";
}

function handleRemoveDelegation(name: string) {
	emit(
		"update:delegations",
		props.delegations.filter((d) => d.entity.name !== name),
	);
}
</script>
