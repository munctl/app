import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
	appId: "app.munctl",
	appName: "MUNctl",
	webDir: "dist",
	server: {
		androidScheme: "https",
	},
	plugins: {
		SplashScreen: {
			launchAutoHide: true,
			backgroundColor: "#18181b",
		},
		Keyboard: {
			// @ts-expect-error Capacitor config accepts string values
			resize: "body",
			resizeOnFullScreen: true,
		},
		StatusBar: {
			// @ts-expect-error Capacitor config accepts string values
			style: "dark",
		},
	},
};

export default config;
