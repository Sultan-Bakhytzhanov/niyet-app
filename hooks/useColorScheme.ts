import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ColorScheme = 'light' | 'dark';

interface ThemeState {
	colorScheme: ColorScheme;
	setColorScheme: (colorScheme: ColorScheme) => void;
	toggleColorScheme: () => void;
}

export const useColorScheme = create(
	persist<ThemeState>(
		set => ({
			colorScheme: 'light',
			setColorScheme: colorScheme => set({ colorScheme }),
			toggleColorScheme: () =>
				set(state => ({
					colorScheme: state.colorScheme === 'light' ? 'dark' : 'light',
				})),
		}),
		{
			name: 'theme-storage',
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
);
