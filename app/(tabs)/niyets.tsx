import {
	View,
	Text,
	StyleSheet,
	FlatList,
	Animated,
	Image,
	Pressable,
	StatusBar,
} from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import React from 'react';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { getDefaultHeaderOptions } from '@/utils/getHeaderOptions';

export default function NiyetsScreen() {
	const { theme, animatedValue } = useTheme();
	const router = useRouter();
	const navigation = useNavigation();

	React.useLayoutEffect(() => {
		navigation.setOptions(getDefaultHeaderOptions(theme));
	}, [navigation, theme, router]);

	const backgroundColor = animatedValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['#ffffff', '#121212'],
	});

	const textColor = animatedValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['#000000', '#ffffff'],
	});

	const cardBackground = animatedValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['#f2f2f2', '#1e1e1e'],
	});

	const niyets = [
		{ id: '1', badHabit: 'Курение', goodHabit: 'Спорт' },
		{
			id: '2',
			badHabit: 'Чрезмерное использование телефона',
			goodHabit: 'Чтение',
		},
	];

	return (
		<Animated.View style={[styles.container, { backgroundColor }]}>
			<Animated.Text style={[styles.title, { color: textColor }]}>
				Мои НИЕТЫ
			</Animated.Text>

			<FlatList
				data={niyets}
				keyExtractor={item => item.id}
				renderItem={({ item }) => (
					<Animated.View
						style={[styles.card, { backgroundColor: cardBackground }]}
					>
						<Animated.Text style={[styles.badHabit, { color: textColor }]}>
							🚫 {item.badHabit}
						</Animated.Text>
						<Animated.Text style={[styles.goodHabit, { color: textColor }]}>
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
