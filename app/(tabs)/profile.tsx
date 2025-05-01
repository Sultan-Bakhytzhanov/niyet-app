import { View, Pressable, StyleSheet } from 'react-native';
import { useAnimatedTheme } from '@/providers/ThemeProvider';
import React, { useLayoutEffect } from 'react';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getDefaultHeaderOptions } from '@/utils/getHeaderOptions';
import { useNavigation } from '@react-navigation/native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
	const { animatedColors } = useAnimatedTheme();
	const router = useRouter();
	const navigation = useNavigation();

	const { colorScheme } = useColorScheme();

	useLayoutEffect(() => {
		navigation.setOptions({
			...getDefaultHeaderOptions(colorScheme),
			headerRight: () => (
				<Pressable
					onPress={() => router.push('/settings')}
					style={{ marginRight: 16 }}
				>
					<Ionicons
						name='settings-outline'
						size={24}
						color={animatedColors.text.value}
					/>
				</Pressable>
			),
		});
	}, [navigation, colorScheme, router]);

	const backgroundColor = useAnimatedStyle(() => ({
		backgroundColor: animatedColors.background.value,
	}));

	const textColor = useAnimatedStyle(() => ({
		color: animatedColors.text.value,
	}));

	return (
		<Animated.View style={[styles.container, backgroundColor]}>
			<Animated.Text style={[styles.title, textColor]}>
				Профиль пользователя
			</Animated.Text>

			<View style={styles.profileInfo}>
				<Animated.Text style={[styles.label, textColor]}>Имя:</Animated.Text>
				<Animated.Text style={[styles.value, textColor]}>
					Иван Иванов
				</Animated.Text>

				<Animated.Text style={[styles.label, textColor]}>Email:</Animated.Text>
				<Animated.Text style={[styles.value, textColor]}>
					ivan@example.com
				</Animated.Text>
			</View>

			<Pressable style={styles.button} onPress={() => {}}>
				<Text style={styles.buttonText}>Выйти</Text>
			</Pressable>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		alignItems: 'center',
	},
	title: {
		fontSize: 26,
		fontWeight: 'bold',
		marginBottom: 24,
	},
	profileInfo: {
		width: '100%',
		marginBottom: 40,
	},
	label: {
		fontSize: 16,
		marginTop: 8,
	},
	value: {
		fontSize: 18,
		fontWeight: '500',
	},
	button: {
		backgroundColor: '#00C853',
		paddingVertical: 12,
		paddingHorizontal: 32,
		borderRadius: 8,
	},
	buttonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: '600',
	},
});
