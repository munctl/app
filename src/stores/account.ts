import { defineStore } from "pinia";

interface AccountState {
	uuid?: string;
	username?: string;
	email?: string;
	fullName?: string;
	avatar?: string;
	loggedIn: boolean;
}

export const useAccountStore = defineStore("account", {
	state: (): AccountState => ({
		uuid: undefined,
		username: undefined,
		email: undefined,
		fullName: undefined,
		avatar: undefined,
		loggedIn: false,
	}),

	getters: {
		displayName(state): string {
			return state.fullName ?? state.username ?? "Guest User";
		},
		initials(state): string {
			const name = state.fullName ?? state.username ?? "?";
			return name
				.split(" ")
				.slice(0, 2)
				.map((w) => w[0])
				.join("");
		},
	},

	actions: {
		logout() {
			this.uuid = undefined;
			this.username = undefined;
			this.email = undefined;
			this.fullName = undefined;
			this.avatar = undefined;
			this.loggedIn = false;
		},
	},

	// Not persisted (same as original)
});
