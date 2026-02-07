// Do not import raw src/global.css at module load; load compiled CSS on web and source CSS on native below.

import {
	DarkTheme,
	DefaultTheme,
	type Theme,
	ThemeProvider,
} from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import * as Sentry from "@sentry/react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Platform } from "react-native";

// Load compiled nativewind CSS on web so Tailwind classes are present in the browser.
if (Platform.OS === "web") {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	try {
		require("../../node_modules/.cache/nativewind/global.css");
	} catch (e) {
		// If the compiled CSS isn't available (postinstall not run), ignore silently.
	}

	// Ensure React Native Web Text inherits CSS color from the document so it follows --web-foreground / .dark
	try {
		// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
		const reactNative = require("react-native");
		const RNWText = reactNative?.Text;
		if (RNWText) {
			RNWText.defaultProps = RNWText.defaultProps || {};
			// Prepend to existing style so we don't clobber other defaults
			const existing = RNWText.defaultProps.style;
			RNWText.defaultProps.style = Array.isArray(existing)
				? [{ color: "inherit" }, ...existing]
				: [{ color: "inherit" }, existing];
		}
	} catch (e) {
		// ignore
	}
} else {
	// On native, load the source global.css so nativewind/tailwind directives can be processed by postinstall step
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	try {
		require("../global.css");
	} catch (e) {
		// ignore if not present
	}
}

import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NAV_THEME } from "~/lib/constants";
import runSeed from "~/lib/seed";
import { MainState$ } from "~/lib/state/CommitteeState";
import { SettingsState$ } from "~/lib/state/SettingsState";
import { useColorScheme } from "~/lib/useColorScheme";

Sentry.init({
	dsn: "https://545ee5131988fac834deae072176821e@sentry.rgn.one/4",

	// Adds more context data to events (IP address, cookies, user, etc.)
	// For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
	//sendDefaultPii: true,

	// Configure Session Replay
	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1,
	integrations: [Sentry.mobileReplayIntegration({})],

	// uncomment the line below to enable Spotlight (https://spotlightjs.com)
	// spotlight: __DEV__,
});
const LIGHT_THEME: Theme = {
	...DefaultTheme,
	colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
	...DarkTheme,
	colors: NAV_THEME.dark,
};

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

export default Sentry.wrap(function RootLayout() {
	const hasMounted = useRef(false);
	const { isDarkColorScheme } = useColorScheme();
	const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

	useEffect(() => {
		const SettingsState = SettingsState$.peek();
		if (!SettingsState.runSeed || MainState$.committees.size > 0) return;
		runSeed();
	}, []);

	useIsomorphicLayoutEffect(() => {
		if (hasMounted.current) {
			return;
		}
		setIsColorSchemeLoaded(true);
		hasMounted.current = true;
	}, []);

	if (!isColorSchemeLoaded) {
		return null;
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider>
				<ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
					<StatusBar style={isDarkColorScheme ? "light" : "dark"} />
					<Stack>
						<Stack.Screen
							name="(tabs)"
							options={{
								headerShown: false,
								title: "Home",
							}}
						/>
					</Stack>
					<PortalHost />
				</ThemeProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
});

const useIsomorphicLayoutEffect =
	Platform.OS === "web" && typeof window === "undefined"
		? useEffect
		: useLayoutEffect;
