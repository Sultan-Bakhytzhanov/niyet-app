import React from 'react';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAnimatedStyle } from 'react-native-reanimated';
import { useAnimatedTheme } from '@/providers/ThemeProvider';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getDefaultHeaderOptions } from '@/utils/getHeaderOptions';

type Options = {
	/** Показывать ли логотип в хедере */
	withLogo?: boolean;
	/** Показывать ли кнопку настроек справа */
	showSettings?: boolean;
};

type UseScreenLayoutResult = {
	/** Анимированный стиль фона */
	backgroundColor: ReturnType<typeof useAnimatedStyle>;
	/** Анимированный стиль текста */
	textColor: ReturnType<typeof useAnimatedStyle>;
	/** Статические цвета текущей темы */
	colors: typeof Colors.light;
	/** Текущая схема: 'light' или 'dark' */
	colorScheme: 'light' | 'dark';
	/** Опции для header, применяются в screenOptions */
	headerOptions: any;
};

/**
 * Хук для получения стилей экрана и декларативных опций хедера
 * Без вызова navigation.setOptions внутри.
 */
export function useScreenLayout(options: Options = {}): UseScreenLayoutResult {
	const { animatedColors } = useAnimatedTheme();
	const { colorScheme } = useColorScheme() as { colorScheme: 'light' | 'dark' };
	const scheme = colorScheme === 'dark' ? 'dark' : 'light';
	const colors = Colors[scheme];

	// Анимированные стили
	const backgroundColor = useAnimatedStyle(() => ({
		backgroundColor: animatedColors.background.value,
	}));
	const textColor = useAnimatedStyle(() => ({
		color: animatedColors.text.value,
	}));

	// Дефолтные опции заголовка из утилиты
	const defaultHeader = getDefaultHeaderOptions(colorScheme, options.withLogo);
	const router = useRouter();
	const headerRight = options.showSettings
		? () => (
				<Pressable
					onPress={() => router.push('/settings')}
					style={{ marginRight: 16 }}
				>
					<Ionicons name='settings-outline' size={24} color={colors.text} />
				</Pressable>
		  )
		: undefined;

	const headerOptions = {
		...defaultHeader,
		headerRight,
		headerStyle: {
			...(defaultHeader.headerStyle || {}),
			backgroundColor: colors.surface,
			borderBottomColor: colors.border,
			borderBottomWidth: 1,
		},
		headerTintColor: colors.text,
	};

	return {
		backgroundColor,
		textColor,
		colors,
		colorScheme: scheme,
		headerOptions,
	};
}
