import {
	View,
	Image,
	Text,
	Pressable,
	StyleSheet,
	Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { getDefaultHeaderOptions } from '@/utils/getHeaderOptions';

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

	useLayoutEffect(() => {
		navigation.setOptions(getDefaultHeaderOptions(theme));
	}, [navigation, theme, router]);

	return (
		<Animated.View style={[styles.container, { backgroundColor }]}>
			<Animated.Text style={[styles.title, { color: textColor }]}>
				Добро пожаловать в Niyet!
			</Animated.Text>
			<Animated.Text style={[styles.subtitle, { color: textColor }]}>
				Начни путь к лучшей версии себя 🚀
			</Animated.Text>

			<Pressable style={styles.button} onPress={() => {}}>
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
		backgroundColor: '#00C853',
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
