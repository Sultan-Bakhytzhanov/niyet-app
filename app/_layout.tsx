import { Stack } from 'expo-router';
import { ThemeProvider } from '@/providers/ThemeProvider';

export default function RootLayout() {
	return (
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
						title: 'Настройки',
						headerTintColor: '#00C853',
						headerTitleAlign: 'center',
					}}
				/>
			</Stack>
		</ThemeProvider>
	);
}
