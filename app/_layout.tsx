// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import { useScreenLayout } from '@/hooks/useScreenLayout';

export default function RootLayout() {
	// Хук — ТОЛЬКО здесь, в React-компоненте
	const { headerOptions } = useScreenLayout({
		withLogo: false,
		showSettings: false,
	});

	return (
		<LanguageProvider>
			<ThemeProvider>
				<Stack
					screenOptions={headerOptions} // передаем результат хука константой
				>
					<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
					<Stack.Screen
						name='settings'
						options={{ headerTitle: '', headerBackTitle: '' }}
					/>
					<Stack.Screen
						name='niyets/[id]'
						options={{ headerTitle: '', headerBackTitle: '' }}
					/>
				</Stack>
			</ThemeProvider>
		</LanguageProvider>
	);
}
