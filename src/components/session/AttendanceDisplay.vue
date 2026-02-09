<template>
  <div>
    <h3 style="font-weight: 600; margin-bottom: 8px;">Attendance</h3>

    <template v-if="hasAttendance">
      <!-- Present and Voting -->
      <h4 style="font-weight: 500; margin-top: 12px;">Present and Voting</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">
        <PillBadge
          v-for="d in presentVoting"
          :key="d.id"
          :text="d.entity.name"
          :image-url="d.isCustom ? undefined : flagUrl(d.entity.code)"
        />
        <span v-if="presentVoting.length === 0" style="color: var(--ion-color-medium)">None</span>
      </div>

      <!-- Present -->
      <h4 style="font-weight: 500; margin-top: 12px;">Present</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">
        <PillBadge
          v-for="d in present"
          :key="d.id"
          :text="d.entity.name"
          :image-url="d.isCustom ? undefined : flagUrl(d.entity.code)"
        />
        <span v-if="present.length === 0" style="color: var(--ion-color-medium)">None</span>
      </div>

      <!-- Absent -->
      <h4 style="font-weight: 500; margin-top: 12px;">Absent</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">
        <PillBadge
          v-for="d in absent"
          :key="d.id"
          :text="d.entity.name"
          :image-url="d.isCustom ? undefined : flagUrl(d.entity.code)"
        />
        <span v-if="absent.length === 0" style="color: var(--ion-color-medium)">None</span>
      </div>
    </template>

    <p v-else style="color: var(--ion-color-medium)">
      You haven't performed a roll call yet.
    </p>
  </div>
</template>

<script setup lang="ts">
import PillBadge from "@/components/PillBadge.vue";
import { flagUrl } from "@/lib/utils";
import type { DelegationReduced } from "@/models/Delegation";
import { AttendanceType } from "@/models/SharedTypes";
import { computed } from "vue";

const props = defineProps<{
	attendance: Record<string, AttendanceType>;
	delegations: DelegationReduced[];
}>();

const hasAttendance = computed(() => Object.keys(props.attendance).length > 0);

const presentVoting = computed(() =>
	props.delegations.filter(
		(d) => props.attendance[d.id] === AttendanceType.PRESENT_VOTING,
	),
);

const present = computed(() =>
	props.delegations.filter(
		(d) => props.attendance[d.id] === AttendanceType.PRESENT,
	),
);

const absent = computed(() =>
	props.delegations.filter(
		(d) =>
			props.attendance[d.id] === AttendanceType.ABSENT ||
			!props.attendance[d.id],
	),
);
</script>
