<template>
  <ion-page>
    <ion-content class="ion-padding" style="--background: var(--ion-color-light);">
      <div style="display: flex; min-height: 100%; flex-direction: column; justify-content: center; max-width: 480px; margin: 0 auto; padding: 48px 0;">
        <h2 style="text-align: center; margin-bottom: 32px;">Sign in to MUNctl</h2>

        <ion-card>
          <ion-card-content>
            <ion-item>
              <ion-input label="Email" label-placement="stacked" type="email" autocomplete="email" />
            </ion-item>

            <ion-item>
              <ion-input label="Password" label-placement="stacked" type="password" autocomplete="current-password" />
            </ion-item>

            <ion-item lines="none" style="margin-top: 8px;">
              <ion-checkbox slot="start">Remember me</ion-checkbox>
            </ion-item>

            <ion-button expand="block" style="margin-top: 16px;">
              Sign in
            </ion-button>

            <div style="text-align: center; margin: 24px 0 16px; color: var(--ion-color-medium);">
              or continue with
            </div>

            <div style="display: flex; gap: 8px;">
              <ion-button expand="block" fill="outline" style="flex: 1">Google</ion-button>
              <ion-button expand="block" fill="outline" style="flex: 1">Apple</ion-button>
            </div>
          </ion-card-content>
        </ion-card>

        <p style="text-align: center; margin-top: 24px; color: var(--ion-color-medium);">
          Not a member?
          <a style="color: var(--ion-color-primary); font-weight: 600; text-decoration: none;">Register</a>
        </p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
	IonButton,
	IonCard,
	IonCardContent,
	IonCheckbox,
	IonContent,
	IonInput,
	IonItem,
	IonPage,
} from "@ionic/vue";
</script>
