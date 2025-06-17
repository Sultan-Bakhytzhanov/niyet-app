import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import { useScreenLayout } from '@/hooks/useScreenLayout';
import { AuthProvider } from '@/providers/AuthProvider';

export default function RootLayout() {
	const { headerOptions } = useScreenLayout({
		withLogo: false,
		showSettings: false,
	});

	return (
		<AuthProvider>
			<LanguageProvider>
				<ThemeProvider>
					<Stack screenOptions={headerOptions}>
						<Stack.Screen name='(auth)' options={{ headerShown: false }} />
						<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
						<Stack.Screen
							name='settings'
							options={{ headerTitle: '', headerBackTitle: '' }}
						/>
					</Stack>
				</ThemeProvider>
			</LanguageProvider>
		</AuthProvider>
	);
}
