import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTheme } from '@/providers/ThemeProvider';

export default function HomeScreen() {
	const navigation = useNavigation();
	const router = useRouter();
	const { theme, animatedValue } = useTheme();

	const backgroundColor = animatedValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['#ffffff', '#121212'],
	});

	const textColor = animatedValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['#000000', '#ffffff'],
	});

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: '',
			headerLeft: () => (
				<Ionicons
					name='home-outline'
					size={32}
					color='#00C853'
					style={{ marginLeft: 16 }}
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
				backgroundColor: theme === 'dark' ? '#121212' : '#ffffff', // Пока без анимации хедера
			},
			headerTitleStyle: {
				color: theme === 'dark' ? '#ffffff' : '#000000',
			},
		});
	}, [navigation, router, theme]);

	return (
		<Animated.View style={[styles.container, { backgroundColor }]}>
			<Animated.Text style={[styles.title, { color: textColor }]}>
				Добро пожаловать в Niyet!
			</Animated.Text>
			<Animated.Text style={[styles.subtitle, { color: textColor }]}>
				Начни путь к лучшей версии себя 🚀
			</Animated.Text>

			<Pressable style={[styles.button, { backgroundColor: '#00C853' }]}>
				<Text style={styles.buttonText}>Добавить НИЕТ</Text>
			</Pressable>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 24,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		marginBottom: 8,
		textAlign: 'center',
	},
	subtitle: {
		fontSize: 18,
		marginBottom: 32,
		textAlign: 'center',
	},
	button: {
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 8,
		elevation: 2,
	},
	buttonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: '600',
	},
});
