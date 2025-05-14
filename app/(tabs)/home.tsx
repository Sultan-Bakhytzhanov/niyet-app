import { View, Text, Pressable, StyleSheet, StatusBar } from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';
import { useScreenLayout } from '@/hooks/useScreenLayout';
import i18n from '@/i18n';
import { useLanguage } from '@/providers/LanguageProvider';

export default function HomeScreen() {
	useLanguage();
	const { backgroundColor, textColor, colors, colorScheme } = useScreenLayout({
		withLogo: true,
		showSettings: true,
	});

	return (
		<>
			<StatusBar
				backgroundColor={colors.background}
				barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
			/>

			<Animated.View style={[styles.container, backgroundColor]}>
				<Animated.Text style={[styles.title, textColor]}>
					{i18n.t('welcome')}
				</Animated.Text>
				<Animated.Text style={[styles.subtitle, textColor]}>
					{i18n.t('start_journey')}
				</Animated.Text>

				<Pressable style={[styles.button, { backgroundColor: colors.primary }]}>
					<Text style={[styles.buttonText, { color: colors.surface }]}>
						{i18n.t('add_niyet')}
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
