import { StyleSheet, FlatList, Pressable } from 'react-native';
import { useAnimatedTheme } from '@/providers/ThemeProvider';
import React from 'react';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useScreenLayout } from '@/hooks/useScreenLayout';

export default function NiyetsScreen() {
	const { backgroundColor, textColor } = useScreenLayout({
		withLogo: true,
		showSettings: true,
	});

	const { animatedColors } = useAnimatedTheme();
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
