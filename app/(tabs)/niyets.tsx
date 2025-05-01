import { StyleSheet, FlatList, Pressable } from 'react-native';
import { useAnimatedTheme } from '@/providers/ThemeProvider';
import React, { useLayoutEffect } from 'react';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useNavigation } from '@react-navigation/native';
import { getDefaultHeaderOptions } from '@/utils/getHeaderOptions';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

export default function NiyetsScreen() {
	const { animatedColors } = useAnimatedTheme();
	const router = useRouter();
	const navigation = useNavigation();
	const { colorScheme } = useColorScheme();

	useLayoutEffect(() => {
		navigation.setOptions({
			...getDefaultHeaderOptions(colorScheme),
			headerRight: () => (
				<Pressable
					onPress={() => router.push('/settings')}
					style={{ marginRight: 16 }}
				>
					<Ionicons
						name='settings-outline'
						size={24}
						color={animatedColors.text.value}
					/>
				</Pressable>
			),
		});
	}, [navigation, colorScheme, router]);

	const backgroundColor = useAnimatedStyle(() => ({
		backgroundColor: animatedColors.background.value,
	}));

	const textColor = useAnimatedStyle(() => ({
		color: animatedColors.text.value,
	}));

	const cardBackground = useAnimatedStyle(() => ({
		backgroundColor: animatedColors.surface.value,
	}));

	const niyets = [
		{ id: '1', badHabit: 'Курение', goodHabit: 'Спорт' },
		{
			id: '2',
			badHabit: 'Чрезмерное использование телефона',
			goodHabit: 'Чтение',
		},
	];

	return (
		<Animated.View style={[styles.container, backgroundColor]}>
			<Animated.Text style={[styles.title, textColor]}>Мои НИЕТЫ</Animated.Text>

			<FlatList
				data={niyets}
				keyExtractor={item => item.id}
				renderItem={({ item }) => (
					<Animated.View style={[styles.card, cardBackground]}>
						<Animated.Text style={[styles.badHabit, textColor]}>
							🚫 {item.badHabit}
						</Animated.Text>
						<Animated.Text style={[styles.goodHabit, textColor]}>
							✅ {item.goodHabit}
						</Animated.Text>
					</Animated.View>
				)}
				contentContainerStyle={{ paddingBottom: 20 }}
			/>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 16,
		textAlign: 'center',
	},
	card: {
		padding: 16,
		borderRadius: 10,
		marginBottom: 12,
	},
	badHabit: {
		fontSize: 18,
		marginBottom: 4,
	},
	goodHabit: {
		fontSize: 18,
	},
});
