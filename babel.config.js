module.exports = function (api) {
	api.cache(true);
	return {
		presets: ['babel-preset-expo'],
		plugins: ['react-native-reanimated/plugin'], // <-- ВАЖНО: плагин должен быть последним!
	};
};
