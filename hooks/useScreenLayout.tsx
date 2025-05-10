import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getDefaultHeaderOptions } from '@/utils/getHeaderOptions';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAnimatedTheme } from '@/providers/ThemeProvider';
import { useAnimatedStyle } from 'react-native-reanimated';

type Options = {
	withLogo?: boolean;
	showSettings?: boolean;
};

export function useScreenLayout(options: Options = {}) {
	const navigation = useNavigation();
	const router = useRouter();
	const { animatedColors } = useAnimatedTheme();
	const { colorScheme } = useColorScheme() as { colorScheme: 'light' | 'dark' };
	const scheme = colorScheme === 'dark' ? 'dark' : 'light';

	useLayoutEffect(() => {
		navigation.setOptions({
			...getDefaultHeaderOptions(colorScheme, options.withLogo),
			headerRight: options.showSettings
				? () => (
						<Pressable
							onPress={() => router.push('/settings')}
							style={{ marginRight: 16 }}
						>
							<Ionicons
								name='settings-outline'
								size={24}
								color={Colors[scheme].text}
							/>
						</Pressable>
				  )
				: undefined,
		});
	}, [navigation, router, colorScheme, scheme, options]);

	const backgroundColor = useAnimatedStyle(() => ({
		backgroundColor: animatedColors.background.value,
	}));

	const textColor = useAnimatedStyle(() => ({
		color: animatedColors.text.value,
	}));

	return {
		backgroundColor,
		textColor,
		colors: Colors[scheme],
		colorScheme,
		navigation,
		router,
	};
}
