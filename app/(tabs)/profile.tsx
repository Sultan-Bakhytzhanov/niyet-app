import {
	View,
	Text,
	StyleSheet,
	Pressable,
	Animated,
	Image,
	StatusBar,
} from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import React from 'react';
import { useRouter } from 'expo-router';
import { getDefaultHeaderOptions } from '@/utils/getHeaderOptions';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
	const { theme, animatedValue } = useTheme();
	const router = useRouter();
	const navigation = useNavigation();

	React.useLayoutEffect(() => {
		navigation.setOptions(getDefaultHeaderOptions(theme));
	}, [navigation, theme, router]);

	const backgroundColor = animatedValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['#ffffff', '#121212'],
	});

	const textColor = animatedValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['#000000', '#ffffff'],
	});

	return (
		<Animated.View style={[styles.container, { backgroundColor }]}>
			<Animated.Text style={[styles.title, { color: textColor }]}>
				Профиль пользователя
			</Animated.Text>

			<View style={styles.profileInfo}>
				<Animated.Text style={[styles.label, { color: textColor }]}>
					Имя:
				</Animated.Text>
				<Animated.Text style={[styles.value, { color: textColor }]}>
					Иван Иванов
				</Animated.Text>

				<Animated.Text style={[styles.label, { color: textColor }]}>
					Email:
				</Animated.Text>
				<Animated.Text style={[styles.value, { color: textColor }]}>
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
