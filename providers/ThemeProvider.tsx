import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, Animated } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
	theme: Theme;
	toggleTheme: () => void;
	animatedValue: Animated.Value;
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

	const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		setTheme(newTheme);
		Animated.timing(animatedValue, {
			toValue: newTheme === 'dark' ? 1 : 0,
			duration: 500,
			useNativeDriver: false,
		}).start();
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme, animatedValue }}>
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
