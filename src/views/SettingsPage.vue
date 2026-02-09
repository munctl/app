<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Account Card -->
      <ion-card>
        <ion-card-content>
          <ion-item lines="none" :router-link="accountStore.loggedIn ? '/account' : undefined" :detail="false">
            <ion-avatar slot="start">
              <div
                style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--ion-color-light); border-radius: 50%; font-weight: 600;"
              >
                {{ accountStore.loggedIn ? accountStore.initials : 'GU' }}
              </div>
            </ion-avatar>
            <ion-label>
              <h2>{{ accountStore.loggedIn ? accountStore.displayName : 'Guest User' }}</h2>
              <p v-if="accountStore.loggedIn">{{ accountStore.email ?? 'No email provided' }}</p>
              <p v-else>Sign in is not available during testing.</p>
              <p v-if="!accountStore.loggedIn" style="color: var(--ion-color-medium)">
                Your changes will not be synced until you log in.
              </p>
            </ion-label>
          </ion-item>
        </ion-card-content>
      </ion-card>

      <!-- Settings List -->
      <ion-list>
        <ion-item>
          <ion-toggle :checked="settingsStore.isDark" @ion-change="settingsStore.toggleTheme()">
            Dark Mode
          </ion-toggle>
        </ion-item>

        <ion-item>
          <ion-toggle :checked="settingsStore.linkCountdowns" @ion-change="settingsStore.linkCountdowns = !settingsStore.linkCountdowns">
            <ion-label>
              Link Caucus and Speaker countdown
              <p>If this is on, pausing the speaker countdown in moderated caucus will also pause the caucus countdown.</p>
            </ion-label>
          </ion-toggle>
        </ion-item>
      </ion-list>

      <!-- Data Management -->
      <div style="display: flex; gap: 8px; margin: 24px 0;">
        <ion-button expand="block" style="flex: 1" @click="importData">Import Data</ion-button>
        <ion-button expand="block" style="flex: 1" @click="exportData">Export Data</ion-button>
      </div>

      <ion-button expand="block" color="danger" size="small" @click="resetData">
        Reset Data
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { runSeed } from "@/composables/useSeed";
import type { Committee } from "@/models/Committee";
import { useAccountStore } from "@/stores/account";
import { useCommitteeStore } from "@/stores/committees";
import { useSettingsStore } from "@/stores/settings";
import {
	IonAvatar,
	IonButton,
	IonCard,
	IonCardContent,
	IonContent,
	IonHeader,
	IonItem,
	IonLabel,
	IonList,
	IonPage,
	IonTitle,
	IonToggle,
	IonToolbar,
	alertController,
} from "@ionic/vue";

const settingsStore = useSettingsStore();
const accountStore = useAccountStore();
const committeeStore = useCommitteeStore();

async function importData() {
	const input = document.createElement("input");
	input.type = "file";
	input.accept = "application/json";
	input.onchange = async (e) => {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		try {
			const text = await file.text();
			const parsed = JSON.parse(text) as {
				compatibility: number;
				committees: Record<string, Committee>;
			};
			if (parsed.compatibility !== committeeStore.compatibility) {
				alert("This document is not compatible with the current app version.");
				return;
			}
			// Merge imported committees
			for (const [id, committee] of Object.entries(parsed.committees)) {
				committeeStore.committees[id] = committee;
			}
			alert("Successfully imported data!");
		} catch {
			alert("Failed to import document. Please try again.");
		}
	};
	input.click();
}

function exportData() {
	try {
		const data = JSON.stringify({
			compatibility: committeeStore.compatibility,
			committees: committeeStore.committees,
		});
		const blob = new Blob([data], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "munctl-export.json";
		a.click();
		URL.revokeObjectURL(url);
	} catch {
		alert("Failed to export data. Please try again.");
	}
}

async function resetData() {
	const alert = await alertController.create({
		header: "Reset Data",
		message:
			"This will clear all your data and reload the demo committee. Continue?",
		buttons: [
			{ text: "Cancel", role: "cancel" },
			{
				text: "Reset",
				role: "destructive",
				handler: () => {
					committeeStore.clearAll();
					runSeed();
				},
			},
		],
	});
	await alert.present();
}
</script>
