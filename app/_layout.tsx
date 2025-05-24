import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import { useScreenLayout } from '@/hooks/useScreenLayout';

export default function RootLayout() {
	const { headerOptions } = useScreenLayout({
		withLogo: false,
		showSettings: false,
	});

	return (
		<LanguageProvider>
			<ThemeProvider>
				<Stack screenOptions={headerOptions}>
					<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
					<Stack.Screen
						name='settings'
						options={{ headerTitle: '', headerBackTitle: '' }}
					/>
					<Stack.Screen
						name='(stack)/niyet/[id].tsx]'
						options={{ headerTitle: '', headerBackTitle: '' }}
					/>
				</Stack>
			</ThemeProvider>
		</LanguageProvider>
	);
}
