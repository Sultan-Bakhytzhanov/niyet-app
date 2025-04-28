import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/providers/ThemeProvider';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
	const { theme } = useTheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: '#00C853',
				tabBarInactiveTintColor: theme === 'dark' ? '#aaaaaa' : '#8e8e8e',
				tabBarStyle: {
					backgroundColor: theme === 'dark' ? '#121212' : '#ffffff',
					borderTopColor: theme === 'dark' ? '#333333' : '#e0e0e0',
				},
				headerShown: true,
			}}
		>
			<Tabs.Screen
				name='home'
				options={{
					title: 'Home',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='home-outline' size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='niyets'
				options={{
					title: 'Niyets',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='list-outline' size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name='profile'
				options={{
					title: 'Profile',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name='person-outline' size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
