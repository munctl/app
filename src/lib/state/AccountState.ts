import { observable } from "@legendapp/state";
import type { Committee } from "~/lib/committee/Committee";

interface AccountStore {
	uuid?: string;
	username?: string;
	email?: string;

	fullName?: string;
	avatar?: string;

	userCommittees?: Map<string, Committee>;
	adminCommittees?: Map<string, Committee>;
	logout: () => void;
	loggedIn: boolean;
}

export const AccountState$ = observable<AccountStore>({
	uuid: undefined,
	username: undefined,
	email: undefined,

	fullName: undefined,
	avatar: undefined,

	userCommittees: new Map(),
	adminCommittees: new Map(),

	logout: () => {
		AccountState$.uuid.set(undefined);
		AccountState$.username.set(undefined);
		AccountState$.fullName.set(undefined);
		AccountState$.email.set(undefined);
		//AccountState$.userCommittees.clear();
		//AccountState$.adminCommittees.clear();
	},

	loggedIn: false,
});
