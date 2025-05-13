import { View, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';
import { Text } from 'react-native';
import { useScreenLayout } from '@/hooks/useScreenLayout';
import { useTranslation } from '@/hooks/useTranslation';
import i18n from '@/i18n';

export default function ProfileScreen() {
	const { t } = useTranslation();
	const { backgroundColor, textColor } = useScreenLayout({
		withLogo: true,
		showSettings: true,
	});

	return (
		<Animated.View style={[styles.container, backgroundColor]}>
			<Animated.Text style={[styles.title, textColor]}>
				{i18n.t('profile')}
			</Animated.Text>

			<View style={styles.profileInfo}>
				<Animated.Text style={[styles.label, textColor]}>
					{i18n.t('name')}
				</Animated.Text>
				<Animated.Text style={[styles.value, textColor]}>
					Иван Иванов
				</Animated.Text>

				<Animated.Text style={[styles.label, textColor]}>
					{i18n.t('email')}
				</Animated.Text>
				<Animated.Text style={[styles.value, textColor]}>
					ivan@example.com
				</Animated.Text>
			</View>

			<Pressable style={styles.button} onPress={() => {}}>
				<Text style={styles.buttonText}>{i18n.t('logout')}</Text>
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
