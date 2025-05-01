import React, { createContext, useContext } from 'react';
import { View } from 'react-native';
import Animated, {
	useDerivedValue,
	withTiming,
	interpolateColor,
	useAnimatedStyle,
} from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';

const ThemeContext = createContext<{
	animatedColors: {
		primary: Animated.SharedValue<string>;
		background: Animated.SharedValue<string>;
		surface: Animated.SharedValue<string>;
		text: Animated.SharedValue<string>;
		textSecondary: Animated.SharedValue<string>;
		border: Animated.SharedValue<string>;
	};
}>({
	animatedColors: {
		primary: { value: Colors.light.primary },
		background: { value: Colors.light.background },
		surface: { value: Colors.light.surface },
		text: { value: Colors.light.text },
		textSecondary: { value: Colors.light.textSecondary },
		border: { value: Colors.light.border },
	} as any,
});

export function useAnimatedTheme() {
	return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const { colorScheme } = useColorScheme();

	const progress = useDerivedValue(() => {
		return withTiming(colorScheme === 'dark' ? 1 : 0, { duration: 300 });
	}, [colorScheme]);

	const animatedColors = {
		primary: useDerivedValue(() =>
			interpolateColor(
				progress.value,
				[0, 1],
				[Colors.light.primary, Colors.dark.primary]
			)
		),
		background: useDerivedValue(() =>
			interpolateColor(
				progress.value,
				[0, 1],
				[Colors.light.background, Colors.dark.background]
			)
		),
		surface: useDerivedValue(() =>
			interpolateColor(
				progress.value,
				[0, 1],
				[Colors.light.surface, Colors.dark.surface]
			)
		),
		text: useDerivedValue(() =>
			interpolateColor(
				progress.value,
				[0, 1],
				[Colors.light.text, Colors.dark.text]
			)
		),
		textSecondary: useDerivedValue(() =>
			interpolateColor(
				progress.value,
				[0, 1],
				[Colors.light.textSecondary, Colors.dark.textSecondary]
			)
		),
		border: useDerivedValue(() =>
			interpolateColor(
				progress.value,
				[0, 1],
				[Colors.light.border, Colors.dark.border]
			)
		),
	};

	const animatedStyle = useAnimatedStyle(() => ({
		backgroundColor: animatedColors.background.value,
		flex: 1,
	}));

	return (
		<View
			style={{
				flex: 1,
				backgroundColor:
					colorScheme === 'dark'
						? Colors.dark.background
						: Colors.light.background,
			}}
		>
			<ThemeContext.Provider value={{ animatedColors }}>
				<Animated.View style={animatedStyle}>{children}</Animated.View>
			</ThemeContext.Provider>
		</View>
	);
}
