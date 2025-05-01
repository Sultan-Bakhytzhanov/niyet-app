import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAnimatedTheme } from '@/providers/ThemeProvider';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import { getDefaultHeaderOptions } from '@/utils/getHeaderOptions';
import React, { useLayoutEffect } from 'react';
import {
	View,
	Switch,
	StyleSheet,
	Pressable,
	Linking,
	Text,
} from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

export default function SettingsScreen() {
	const navigation = useNavigation();
	const router = useRouter();
	const { animatedColors } = useAnimatedTheme();
	const { colorScheme, toggleColorScheme } = useColorScheme();
	useLayoutEffect(() => {
		navigation.setOptions(getDefaultHeaderOptions(colorScheme, false));
	}, [navigation, colorScheme, router]);

	const backgroundColor = useAnimatedStyle(() => ({
		backgroundColor: animatedColors.background.value,
	}));

	const textColor = useAnimatedStyle(() => ({
		color: animatedColors.text.value,
	}));

	return (
		<Animated.View style={[styles.container, backgroundColor]}>
			<Animated.Text style={[styles.title, textColor]}>Настройки</Animated.Text>

			<View style={styles.settingItem}>
				<Animated.Text style={[styles.settingText, textColor]}>
					Тёмная тема
				</Animated.Text>
				<Switch
					value={colorScheme === 'dark'}
					onValueChange={toggleColorScheme}
					trackColor={{ false: '#767577', true: '#00C853' }}
					thumbColor={colorScheme === 'dark' ? '#00C853' : '#f4f3f4'}
				/>
			</View>

			<Pressable
				style={styles.button}
				onPress={() => Linking.openURL('https://your-privacy-policy-link.com')}
			>
				<Text style={styles.buttonText}>Политика конфиденциальности</Text>
			</Pressable>

			<Pressable style={styles.button}>
				<Text style={styles.buttonText}>FAQ</Text>
			</Pressable>

			<Pressable
				style={styles.button}
				onPress={() => Linking.openURL('mailto:support@example.com')}
			>
				<Text style={styles.buttonText}>Связаться с нами</Text>
			</Pressable>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	title: {
		fontSize: 26,
		fontWeight: 'bold',
		marginBottom: 24,
		textAlign: 'center',
	},
	settingItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 16,
	},
	settingText: {
		fontSize: 18,
	},
	button: {
		backgroundColor: '#00C853',
		paddingVertical: 14,
		paddingHorizontal: 24,

		borderRadius: 8,
		marginBottom: 16,
	},
	buttonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: '600',
	},
});
