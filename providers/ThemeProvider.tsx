import React, { createContext, useContext, useState } from 'react';
import { Appearance, Animated } from 'react-native';

export type Theme = 'light' | 'dark';

interface ThemeContextProps {
	theme: Theme;
	toggleTheme: () => void;
	animatedValue: Animated.Value;
	slideValue: Animated.Value;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const systemColorScheme = Appearance.getColorScheme();
	const [theme, setTheme] = useState<Theme>(
		systemColorScheme === 'dark' ? 'dark' : 'light'
	);

	const animatedValue = React.useRef(
		new Animated.Value(theme === 'dark' ? 1 : 0)
	).current;
	const slideValue = React.useRef(new Animated.Value(0)).current;

	const toggleTheme = () => {
		// 1. Сначала сдвигаем экран вправо
		Animated.timing(slideValue, {
			toValue: 300,
			duration: 250,
			useNativeDriver: true,
		}).start(() => {
			// 2. После сдвига — возвращаем экран обратно
			Animated.timing(slideValue, {
				toValue: 0,
				duration: 250,
				useNativeDriver: true,
			}).start(() => {
				// 3. Только после полного возврата — меняем тему
				const newTheme = theme === 'light' ? 'dark' : 'light';
				setTheme(newTheme);

				// 4. Плавно меняем цвета
				Animated.timing(animatedValue, {
					toValue: newTheme === 'dark' ? 1 : 0,
					duration: 500,
					useNativeDriver: false,
				}).start();
			});
		});
	};

	return (
		<ThemeContext.Provider
			value={{ theme, toggleTheme, animatedValue, slideValue }}
		>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};
