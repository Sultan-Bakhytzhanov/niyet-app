import { Stack } from 'expo-router';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { LanguageProvider } from '@/providers/LanguageProvider';

export default function RootLayout() {
	return (
		<LanguageProvider>
			{' '}
			<ThemeProvider>
				<Stack>
					<Stack.Screen
						name='(tabs)'
						options={{
							headerShown: false,
						}}
					/>
					<Stack.Screen
						name='settings'
						options={{
							title: '',
							headerTintColor: '#00C853',
							headerTitleAlign: 'center',
						}}
					/>
				</Stack>
			</ThemeProvider>
		</LanguageProvider>
	);
}
