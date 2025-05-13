import React from 'react';
import { View, StyleSheet, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAnimatedTheme } from '@/providers/ThemeProvider';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useScreenLayout } from '@/hooks/useScreenLayout';
import Colors from '@/constants/Colors';
import CustomSwitch from '@/components/CustomSwitch';
import { Picker } from '@react-native-picker/picker';
import { useLanguage } from '@/providers/LanguageProvider';
import i18n from '@/i18n';

export default function SettingsScreen() {
	const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
	const { language, setLanguage } = useLanguage();

	const { colorScheme, toggleColorScheme } = useColorScheme();
	const { animatedColors } = useAnimatedTheme();
	useScreenLayout({ withLogo: false, showSettings: false });

	const scheme = colorScheme === 'dark' ? 'dark' : 'light';
	const colors = Colors[scheme];

	const backgroundColor = useAnimatedStyle(() => ({
		backgroundColor: animatedColors.background.value,
	}));

	const surfaceColor = useAnimatedStyle(() => ({
		backgroundColor: animatedColors.surface.value,
	}));

	const textColor = useAnimatedStyle(() => ({
		color: animatedColors.text.value,
	}));

	const textSecondary = useAnimatedStyle(() => ({
		color: animatedColors.textSecondary.value,
	}));

	return (
		<Animated.View style={[styles.container, backgroundColor]}>
			<Animated.Text style={[styles.title, textColor]}>
				{i18n.t('settings')}
			</Animated.Text>
			<Animated.View style={[styles.card, surfaceColor]}>
				{/* 🌓 Dark Mode */}
				<View style={styles.row}>
					<Ionicons name='moon-outline' size={24} color={colors.text} />
					<Animated.Text style={[styles.label, textColor]}>
						{i18n.t('dark_mode')}
					</Animated.Text>
					<View style={styles.flexSpacer} />
					<CustomSwitch
						value={colorScheme === 'dark'}
						onToggle={toggleColorScheme}
					/>
				</View>

				{/* 🔔 Notifications */}
				<View style={styles.row}>
					<Ionicons
						name='notifications-outline'
						size={24}
						color={colors.text}
					/>
					<Animated.Text style={[styles.label, textColor]}>
						{i18n.t('notifications')}
					</Animated.Text>
					<View style={styles.flexSpacer} />
					<CustomSwitch
						value={notificationsEnabled}
						onToggle={() => setNotificationsEnabled(prev => !prev)}
					/>
				</View>

				{/* 🌐 Language */}
				<View style={styles.row}>
					<Ionicons name='globe-outline' size={24} color={colors.text} />
					<Animated.Text style={[styles.label, textColor]}>
						{i18n.t('language')}
					</Animated.Text>
					<View style={styles.flexSpacer} />
					<Picker
						selectedValue={language}
						onValueChange={value => setLanguage(value)}
						style={[
							styles.languagePicker,
							{ backgroundColor: colors.surface, color: colors.text }, // под твою тему
						]}
						mode='dropdown'
						dropdownIconColor={colors.text}
					>
						<Picker.Item label='EN' value='en' />
						<Picker.Item label='RU' value='ru' />
						<Picker.Item label='KZ' value='kz' />
					</Picker>
				</View>

				{/* ❓ Help */}
				<Pressable
					style={styles.row}
					onPress={() => Linking.openURL('mailto:support@example.com')}
				>
					<Ionicons name='help-circle-outline' size={24} color={colors.text} />
					<Animated.Text style={[styles.label, textColor]}>
						{i18n.t('help_support')}
					</Animated.Text>
				</Pressable>
			</Animated.View>

			{/* 🔢 Version */}
			<Animated.Text style={[styles.versionText, textSecondary]}>
				{i18n.t('version')}
			</Animated.Text>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		justifyContent: 'flex-start',
	},
	card: {
		padding: 20,
		borderRadius: 16,
		gap: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		minHeight: 20,
	},
	title: {
		fontSize: 28,
		fontWeight: '700',
		textAlign: 'center',
		marginBottom: 12,
	},
	column: {
		flexDirection: 'column',
		gap: 6,
	},
	pickerWrapper: {
		borderWidth: 1,
		borderColor: '#888',
		borderRadius: 8,
		overflow: 'hidden',
		backgroundColor: 'transparent',
	},
	picker: {
		height: 36,
		fontSize: 14,
		paddingVertical: 0,
		paddingHorizontal: 8,
		backgroundColor: 'transparent',
	},
	languagePicker: {
		width: 60,
		height: 32,
		borderRadius: 8,
		paddingHorizontal: 6,
		fontSize: 13,
		marginRight: -6,
		marginLeft: 'auto',
		backgroundColor: '#2e2e2e',
		color: 'white',
	},

	label: {
		marginLeft: 12,
		fontSize: 16,
		fontWeight: '500',
	},
	versionText: {
		textAlign: 'center',
		fontSize: 13,
		opacity: 0.6,
		marginTop: 16,
	},
	secondary: {
		fontSize: 14,
	},
	flexSpacer: {
		flex: 1,
	},
});
