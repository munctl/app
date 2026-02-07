/** @type {import('expo/metro-config').MetroConfig} */
const { withNativeWind } = require("nativewind/metro");
const { getSentryExpoConfig } = require("@sentry/react-native/metro");

// eslint-disable-next-line no-undef
const config = getSentryExpoConfig(__dirname);

// Add wasm asset support
config.resolver.assetExts.push("wasm");

// Add COEP and COOP headers to support SharedArrayBuffer
config.server.enhanceMiddleware = (middleware) => {
	return (req, res, next) => {
		res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
		res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
		middleware(req, res, next);
	};
};

module.exports = withNativeWind(config, {
	input: "./src/global.css",
	inlineRem: 16,
});
