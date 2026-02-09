<template>
  <div>
    <ion-accordion-group :value="currentAccordion">
      <ion-accordion
        v-for="(d, index) in delegations"
        :key="d.id"
        :value="d.id"
        @click="currentAccordion = d.id"
      >
        <ion-item slot="header" :style="headerStyle(d.id)">
          <ion-avatar slot="start" style="width: 32px; height: 24px; --border-radius: 2px;">
            <img
              v-if="!d.isCustom"
              :src="flagUrl(d.entity.code)"
              :alt="d.entity.name"
              style="object-fit: contain; width: 100%; height: 100%;"
            />
          </ion-avatar>
          <ion-label>{{ d.entity.name }}</ion-label>
          <ion-icon
            slot="end"
            :icon="statusIcon(d.id)"
            :color="statusColor(d.id)"
          />
        </ion-item>

        <div slot="content" class="ion-padding">
          <div style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: center;">
            <ion-button color="success" @click="mark(d, AttendanceType.PRESENT_VOTING, index)">
              Present, Voting
            </ion-button>
            <ion-button color="primary" @click="mark(d, AttendanceType.PRESENT, index)">
              Present
            </ion-button>
            <ion-button color="danger" @click="mark(d, AttendanceType.ABSENT, index)">
              Absent
            </ion-button>
          </div>
        </div>
      </ion-accordion>
    </ion-accordion-group>

    <div style="display: flex; gap: 8px; margin-top: 24px;">
      <ion-button expand="block" fill="outline" style="flex: 1" @click="$emit('cancel')">
        Cancel
      </ion-button>
      <ion-button
        expand="block"
        style="flex: 1"
        :disabled="!canSubmit"
        @click="handleSubmit"
      >
        Done
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { flagUrl } from "@/lib/utils";
import type { DelegationReduced } from "@/models/Delegation";
import { AttendanceType } from "@/models/SharedTypes";
import {
	IonAccordion,
	IonAccordionGroup,
	IonAvatar,
	IonButton,
	IonIcon,
	IonItem,
	IonLabel,
} from "@ionic/vue";
import {
	checkmark,
	checkmarkCircle,
	closeCircle,
	helpCircleOutline,
} from "ionicons/icons";
import { computed, ref } from "vue";

const props = defineProps<{
	delegations: DelegationReduced[];
	currentAttendance: Record<string, AttendanceType>;
}>();

const emit = defineEmits<{
	submit: [attendance: Record<string, AttendanceType>];
	cancel: [];
}>();

const working = ref<Record<string, AttendanceType>>({});
const currentAccordion = ref(props.delegations[0]?.id ?? "");

function mark(
	delegation: DelegationReduced,
	type: AttendanceType,
	index: number,
) {
	working.value[delegation.id] = type;
	// Advance to next delegation
	const next = props.delegations[index + 1];
	if (next) {
		currentAccordion.value = next.id;
	}
}

function statusIcon(delegationId: string): string {
	const status = working.value[delegationId];
	switch (status) {
		case AttendanceType.PRESENT_VOTING:
			return checkmarkCircle;
		case AttendanceType.PRESENT:
			return checkmark;
		case AttendanceType.ABSENT:
			return closeCircle;
		default:
			return helpCircleOutline;
	}
}

function statusColor(delegationId: string): string {
	const status = working.value[delegationId];
	switch (status) {
		case AttendanceType.PRESENT_VOTING:
			return "success";
		case AttendanceType.PRESENT:
			return "primary";
		case AttendanceType.ABSENT:
			return "danger";
		default:
			return "medium";
	}
}

function headerStyle(delegationId: string): Record<string, string> {
	const status = working.value[delegationId];
	switch (status) {
		case AttendanceType.PRESENT_VOTING:
			return { "--background": "var(--ion-color-success)", "--color": "#fff" };
		case AttendanceType.PRESENT:
			return { "--background": "var(--ion-color-primary)", "--color": "#fff" };
		case AttendanceType.ABSENT:
			return { "--background": "var(--ion-color-danger)", "--color": "#fff" };
		default:
			return {};
	}
}

const canSubmit = computed(() => {
	const markedCount = Object.keys(working.value).length;
	const hasVoting = Object.values(working.value).some(
		(v) => v === AttendanceType.PRESENT_VOTING,
	);
	return markedCount >= props.delegations.length && hasVoting;
});

function handleSubmit() {
	emit("submit", { ...working.value });
}
</script>
