import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Image, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Theme } from '@/providers/ThemeProvider';

export function getDefaultHeaderOptions(theme: Theme) {
	return {
		headerTitle: '',
		headerLeft: () => (
			<Image
				source={require('@/assets/images/logo.png')}
				style={{ width: 32, height: 32, marginLeft: 16 }}
				resizeMode='contain'
			/>
		),
		headerRight: () => (
			<Pressable
				onPress={() => router.push('/settings')}
				style={{ marginRight: 16 }}
			>
				<Ionicons name='settings-outline' size={24} color='#00C853' />
			</Pressable>
		),
		headerStyle: {
			backgroundColor: theme === 'dark' ? '#121212' : '#ffffff',
			borderBottomWidth: StyleSheet.hairlineWidth,
			borderBottomColor: theme === 'dark' ? '#333333' : '#e0e0e0',
			elevation: 0,
			shadowOpacity: 0,
			shadowColor: 'transparent',
			shadowOffset: { height: 0, width: 0 },
		},
		headerTitleStyle: {
			color: theme === 'dark' ? '#ffffff' : '#000000',
		},
	};
}
