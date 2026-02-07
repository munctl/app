import { observablePersistAsyncStorage } from "@legendapp/state/persist-plugins/async-storage";
import { observablePersistSqlite } from "@legendapp/state/persist-plugins/expo-sqlite";
import { configureSynced } from "@legendapp/state/sync";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Storage from "expo-sqlite/kv-store";

export const persistOptions = configureSynced({
	persist: {
		plugin: observablePersistSqlite(Storage),
	},
});
export const webPersistOptions = configureSynced({
	persist: {
		plugin: observablePersistAsyncStorage({
			AsyncStorage,
		}),
	},
});
