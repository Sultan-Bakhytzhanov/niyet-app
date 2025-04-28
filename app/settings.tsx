import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
	Animated,
	View,
	Text,
	Pressable,
	StyleSheet,
	Linking,
} from 'react-native';
import React, { useEffect } from 'react';

export default function SettingsScreen() {
	const { animatedValue, toggleTheme, theme } = useTheme();
	const navigation = useNavigation();

	const backgroundColor = animatedValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['#ffffff', '#121212'],
	});

	const textColor = animatedValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['#000000', '#ffffff'],
	});

	useEffect(() => {
		navigation.setOptions({
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
			headerTintColor: '#00C853',
		});
	}, [theme, navigation]);

	return (
		<Animated.View style={[styles.container, { backgroundColor }]}>
			<Animated.Text style={[styles.title, { color: textColor }]}>
				Settings
			</Animated.Text>

			<Pressable style={styles.button} onPress={toggleTheme}>
				<Text style={styles.buttonText}>Theme</Text>
			</Pressable>

			<Pressable style={styles.button}>
				<Text style={styles.buttonText}>Language</Text>
			</Pressable>

			<Pressable
				style={styles.button}
				onPress={() => Linking.openURL('https://your-privacy-policy-link.com')}
			>
				<Text style={styles.buttonText}>Privacy Policy</Text>
			</Pressable>

			<Pressable style={styles.button}>
				<Text style={styles.buttonText}>FAQ</Text>
			</Pressable>

			<Pressable
				style={styles.button}
				onPress={() => Linking.openURL('mailto:support@example.com')}
			>
				<Text style={styles.buttonText}>Contact us</Text>
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
