// ProfileScreen.tsx
import React from 'react';
import {
	View,
	Pressable,
	StyleSheet,
	ScrollView,
	Image,
	TouchableOpacity,
	Text,
	StatusBar,
} from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useScreenLayout } from '@/hooks/useScreenLayout';
import { useAnimatedTheme } from '@/providers/ThemeProvider'; // Для цветов поверхности карточек
import i18n from '@/i18n';
import { useLanguage } from '@/providers/LanguageProvider';
import {
	User,
	Mail,
	LogOut,
	ChevronRight,
	Bell,
	ShieldCheck,
	Settings2,
} from 'lucide-react-native'; // Пример иконок

// Заглушка для данных пользователя, замените на реальные данные
const userProfile = {
	name: 'Иван Иванов',
	email: 'ivan@example.com',
	avatarUrl:
		'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y&s=128', // Замените на реальный URL или локальный asset
};

// Компонент для элементов списка настроек/информации
const ProfileListItem = ({
	icon: Icon,
	label,
	value,
	onPress,
	textColor,
	iconColor,
	showChevron = true,
}: {
	icon: React.ElementType;
	label: string;
	value?: string;
	onPress?: () => void;
	textColor: string;
	iconColor: string;
	showChevron?: boolean;
}) => (
	<TouchableOpacity
		onPress={onPress}
		style={styles.listItem}
		disabled={!onPress}
	>
		<View style={styles.listItemIconContainer}>
			<Icon size={22} color={iconColor} />
		</View>
		<View style={styles.listItemTextContainer}>
			<Text style={[styles.listItemLabel, { color: textColor }]}>{label}</Text>
			{value && (
				<Text
					style={[styles.listItemValue, { color: textColor, opacity: 0.7 }]}
				>
					{value}
				</Text>
			)}
		</View>
		{showChevron && onPress && (
			<ChevronRight size={20} color={textColor} style={{ opacity: 0.5 }} />
		)}
	</TouchableOpacity>
);

export default function ProfileScreen() {
	useLanguage();
	const { backgroundColor, textColor, colors, colorScheme } = useScreenLayout({
		// withLogo: true, // Обычно лого на экране профиля не нужно
		// showSettings: true, // Кнопка настроек может быть здесь или в хедере
	});
	const { animatedColors } = useAnimatedTheme();

	const cardStyle = useAnimatedStyle(() => {
		return {
			backgroundColor: animatedColors.surface.value,
			// Можно добавить тени в зависимости от темы, если animatedColors это поддерживает
			// shadowColor: colorScheme === 'dark' ? '#050505' : '#B0B0B0',
		};
	});

	const handleLogout = () => {
		// Ваша логика выхода из системы
		console.log('User logged out');
		// например, router.replace('/login');
	};

	// Добавим локализацию для новых ключей
	// "profile_title": "Профиль",
	// "profile_personal_info": "Личная информация",
	// "profile_name": "Имя",
	// "profile_email": "Электронная почта",
	// "profile_app_settings": "Настройки приложения",
	// "profile_notifications": "Уведомления",
	// "profile_privacy": "Конфиденциальность",
	// "profile_general_settings": "Общие настройки",
	// "profile_logout": "Выйти из аккаунта"

	return (
		<ScrollView
			style={[styles.scrollContainer, { backgroundColor: colors.background }]}
			contentContainerStyle={styles.scrollContentContainer}
			showsVerticalScrollIndicator={false}
		>
			<StatusBar
				backgroundColor={colors.background}
				barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
			/>
			<View style={styles.headerContainer}>
				<Image source={{ uri: userProfile.avatarUrl }} style={styles.avatar} />
				<Text style={[styles.userName, { color: colors.text }]}>
					{userProfile.name}
				</Text>
				<Text style={[styles.userEmail, { color: colors.textSecondary }]}>
					{userProfile.email}
				</Text>
			</View>

			{/* Секция Личной Информации */}
			<Animated.View style={[styles.card, cardStyle]}>
				<Text style={[styles.cardTitle, { color: colors.text }]}>
					{i18n.t('profile_personal_info')}
				</Text>
				<ProfileListItem
					icon={User}
					label={i18n.t('profile_name')}
					value={userProfile.name}
					textColor={colors.text}
					iconColor={colors.primary}
					showChevron={false} // Обычно имя/email не кликабельны для перехода
				/>
				<View style={[styles.divider, { backgroundColor: colors.border }]} />
				<ProfileListItem
					icon={Mail}
					label={i18n.t('profile_email')}
					value={userProfile.email}
					textColor={colors.text}
					iconColor={colors.primary}
					showChevron={false}
				/>
			</Animated.View>

			{/* Секция Настроек Приложения */}
			<Animated.View style={[styles.card, cardStyle]}>
				<Text style={[styles.cardTitle, { color: colors.text }]}>
					{i18n.t('profile_app_settings')}
				</Text>
				<ProfileListItem
					icon={Bell}
					label={i18n.t('profile_notifications')}
					textColor={colors.text}
					iconColor={colors.primary}
					onPress={() => console.log('Navigate to Notifications Settings')}
				/>
				<View style={[styles.divider, { backgroundColor: colors.border }]} />
				<ProfileListItem
					icon={Settings2} // или другая иконка для общих настроек
					label={i18n.t('profile_general_settings')}
					textColor={colors.text}
					iconColor={colors.primary}
					onPress={() => console.log('Navigate to General Settings')} // Заменить на router.push('/settings') если нужно
				/>
				<View style={[styles.divider, { backgroundColor: colors.border }]} />
				<ProfileListItem
					icon={ShieldCheck}
					label={i18n.t('profile_privacy')}
					textColor={colors.text}
					iconColor={colors.primary}
					onPress={() => console.log('Navigate to Privacy Settings')}
				/>
			</Animated.View>

			{/* Кнопка Выхода */}
			<TouchableOpacity
				style={[styles.logoutButton, { backgroundColor: colors.error }]} // Используем цвет ошибки для кнопки выхода
				onPress={handleLogout}
			>
				<LogOut size={20} color='#FFFFFF' style={styles.logoutIcon} />
				<Text style={styles.logoutButtonText}>{i18n.t('profile_logout')}</Text>
			</TouchableOpacity>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	scrollContainer: {
		flex: 1,
	},
	scrollContentContainer: {
		paddingHorizontal: 16,
		paddingVertical: 24,
	},
	headerContainer: {
		alignItems: 'center',
		marginBottom: 32,
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50,
		marginBottom: 16,
		borderWidth: 3,
		borderColor: '#00C85333', // Легкая обводка основного цвета
	},
	userName: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 4,
	},
	userEmail: {
		fontSize: 16,
	},
	card: {
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 8, // Уменьшил вертикальный паддинг, т.к. у listItem он свой
		marginBottom: 20,
		// Стили для тени (могут отличаться для iOS/Android)
		shadowColor: '#000', // Цвет тени будет зависеть от темы
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 5,
		elevation: 3, // Для Android
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 8,
		paddingTop: 8, // Добавил отступ для заголовка внутри карточки
	},
	listItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 14, // Увеличил для лучшего касания
	},
	listItemIconContainer: {
		width: 30, // Фиксированная ширина для выравнивания
		alignItems: 'center', // Центрируем иконку
		marginRight: 16,
	},
	listItemTextContainer: {
		flex: 1,
	},
	listItemLabel: {
		fontSize: 16,
		fontWeight: '500',
	},
	listItemValue: {
		fontSize: 14,
		marginTop: 2,
	},
	divider: {
		height: 1,
		// backgroundColor: '#e0e0e0', // Задается из colors.border
		marginVertical: 4, // Небольшой отступ для разделителя
		marginLeft: 46, // Отступ слева, чтобы линия начиналась после иконки
	},
	logoutButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 14,
		paddingHorizontal: 32,
		borderRadius: 25, // Более круглые края
		marginTop: 20, // Отступ сверху
	},
	logoutIcon: {
		marginRight: 10,
	},
	logoutButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
});
