import { View, Text, Pressable, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { useAnimatedTheme } from '@/providers/ThemeProvider';
import { getDefaultHeaderOptions } from '@/utils/getHeaderOptions';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors'; // ✅ импортируем палитру

export default function HomeScreen() {
	const navigation = useNavigation();
	const router = useRouter();
	const { animatedColors } = useAnimatedTheme();
	const { colorScheme } = useColorScheme() as { colorScheme: 'light' | 'dark' };
	const colors = Colors[colorScheme ?? 'light'];

	const backgroundColor = useAnimatedStyle(() => ({
		backgroundColor: animatedColors.background.value,
	}));

	const textColor = useAnimatedStyle(() => ({
		color: animatedColors.text.value,
	}));

	useLayoutEffect(() => {
		navigation.setOptions({
			...getDefaultHeaderOptions(colorScheme, true),
			headerRight: () => (
				<Pressable
					onPress={() => router.push('/settings')}
					style={{ marginRight: 16 }}
				>
					<Ionicons
						name='settings-outline'
						size={24}
						color={colors.text} // 🎯 вместо жёсткого цвета
					/>
				</Pressable>
			),
		});
	}, [navigation, colorScheme, router]);

	return (
		<>
			<StatusBar
				backgroundColor={colors.background} // 🎯 меняем через палитру
				barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
			/>

			<Animated.View style={[styles.container, backgroundColor]}>
				<Animated.Text style={[styles.title, textColor]}>
					Добро пожаловать в Niyet!
				</Animated.Text>
				<Animated.Text style={[styles.subtitle, textColor]}>
					Начни путь к лучшей версии себя 🚀
				</Animated.Text>

				<Pressable style={[styles.button, { backgroundColor: colors.primary }]}>
					<Text style={[styles.buttonText, { color: colors.surface }]}>
						Добавить НИЕТ
					</Text>
				</Pressable>
			</Animated.View>
		</>
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
		fontSize: 18,
		fontWeight: '600',
	},
});
