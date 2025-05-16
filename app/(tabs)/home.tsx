import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	Pressable,
	StyleSheet,
	StatusBar,
	ImageBackground,
	FlatList,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useScreenLayout } from '@/hooks/useScreenLayout';
import i18n from '@/i18n';
import { useLanguage } from '@/providers/LanguageProvider';

// Тип для ниета
type Niyet = {
	id: string;
	bad: string;
	good?: string;
	progress: number;
	streak: number;
};

// Фоны + признак темного/светлого
const backgrounds = [
	{ img: require('@/assets/images/bg1.png'), isDark: true },
	{ img: require('@/assets/images/bg2.jpg'), isDark: true },
	{ img: require('@/assets/images/bg3.jpg'), isDark: true },
];

// Заглушки ниетов (можно заменить на useState/загрузку из async storage)
const MOCK_NIYETS: Niyet[] = [
	{
		id: '1',
		bad: 'Курение',
		good: 'Бегать утром',
		progress: 0,
		streak: 0,
	},
	{
		id: '2',
		bad: 'Сладкое',
		good: '',
		progress: 40,
		streak: 3,
	},
];

// Заглушки цитат (пока вместо API)
const MOCK_QUOTES = [
	{
		quote:
			'Every small step forward is progress. Your intentions shape your reality.',
		author: 'Daily Wisdom',
	},
	{
		quote: 'The journey of a thousand miles begins with a single step.',
		author: 'Lao Tzu',
	},
	{
		quote: 'Mistakes are proof that you are trying.',
		author: 'Unknown',
	},
];

export default function HomeScreen() {
	useLanguage();
	const { backgroundColor, textColor, colors, colorScheme } = useScreenLayout({
		withLogo: true,
		showSettings: true,
	});

	// Фон и цитата
	const [bg, setBg] = useState(backgrounds[0]);
	const [quote, setQuote] = useState(MOCK_QUOTES[0].quote);
	const [author, setAuthor] = useState(MOCK_QUOTES[0].author);

	// Функция для смены фона и цитаты (заглушка для API)
	const rerenderQuoteBlock = () => {
		const randBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
		const randQuote =
			MOCK_QUOTES[Math.floor(Math.random() * MOCK_QUOTES.length)];
		setBg(randBg);
		setQuote(randQuote.quote);
		setAuthor(randQuote.author);
	};

	useEffect(() => {
		rerenderQuoteBlock();
	}, []);

	const [niyets, setNiyets] = useState<Niyet[]>(MOCK_NIYETS);

	const lastNiyet = niyets.length > 0 ? niyets[niyets.length - 1] : null;
	const activeNiyets = niyets.length > 1 ? niyets.slice(0, -1) : [];

	return (
		<>
			<StatusBar
				backgroundColor={colors.background}
				barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
			/>

			<Animated.View style={[styles.container, backgroundColor]}>
				{/* Блок с цитатой и кнопкой */}
				<ImageBackground
					source={bg.img}
					style={styles.banner}
					imageStyle={{ borderRadius: 16 }}
				>
					<View style={styles.overlay} />
					<View style={styles.bannerContent}>
						<Text
							style={[
								styles.quoteText,
								{ color: bg.isDark ? '#fff' : '#181818' },
							]}
						>
							"{quote}"
						</Text>
						<Text
							style={[
								styles.quoteAuthor,
								{ color: bg.isDark ? '#d3d3d3' : '#444' },
							]}
						>
							— {author}
						</Text>
					</View>
					<Pressable
						onPress={rerenderQuoteBlock}
						style={{
							position: 'absolute',
							top: 12,
							right: 12,
							backgroundColor: bg.isDark
								? 'rgba(255,255,255,0.15)'
								: 'rgba(0,0,0,0.08)',
							padding: 8,
							borderRadius: 8,
						}}
					>
						<Text style={{ color: bg.isDark ? '#fff' : '#222', fontSize: 13 }}>
							Обновить цитату
						</Text>
					</Pressable>
				</ImageBackground>

				{/* Последний созданный ниет */}
				{lastNiyet && (
					<View style={styles.section}>
						<Text style={[styles.sectionTitle, { color: colors.text }]}>
							{i18n.t('last_niyet') || 'Last Niyet'}
						</Text>
						<NiyetCard
							niyet={lastNiyet}
							colors={colors}
							colorScheme={colorScheme}
						/>
					</View>
				)}

				{/* Список активных ниетов */}
				<View style={styles.section}>
					<Text style={[styles.sectionTitle, { color: colors.text }]}>
						{i18n.t('active_niyets') || 'Active Niyets'}
					</Text>
					<FlatList
						data={activeNiyets}
						keyExtractor={item => item.id}
						renderItem={({ item }) => (
							<NiyetCard
								niyet={item}
								colors={colors}
								colorScheme={colorScheme}
							/>
						)}
						ListEmptyComponent={
							<Text
								style={{
									color: colors.secondary,
									textAlign: 'center',
									marginVertical: 16,
								}}
							>
								{i18n.t('no_active_niyets') || 'No active niyets yet.'}
							</Text>
						}
					/>
					<Pressable
						style={[
							styles.createBtn,
							{
								backgroundColor:
									colorScheme === 'dark'
										? colors.surface || '#232536'
										: colors.primary || '#00A877',
								borderWidth: colorScheme === 'dark' ? 0 : 1,
								borderColor: colorScheme === 'dark' ? 'transparent' : '#00A877',
							},
						]}
					>
						<Text
							style={[
								styles.createBtnText,
								{
									color:
										colorScheme === 'dark'
											? colors.primary || '#6FE3C1'
											: '#fff',
								},
							]}
						>
							+ {i18n.t('add_niyet')}
						</Text>
					</Pressable>
				</View>
			</Animated.View>
		</>
	);
}

// Карточка ниета с поддержкой темы
function NiyetCard({
	niyet,
	colors,
	colorScheme,
}: {
	niyet: Niyet;
	colors: any;
	colorScheme: string;
}) {
	const isDark = colorScheme === 'dark';
	return (
		<View
			style={[
				styles.card,
				{
					backgroundColor: isDark
						? colors.card || '#232536'
						: colors.card || '#f2f3fa',
					shadowColor: isDark ? '#000' : '#c9c9c9',
					borderWidth: isDark ? 0 : 1,
					borderColor: isDark ? 'transparent' : '#e2e2e2',
				},
			]}
		>
			<Text style={[styles.bad, { color: colors.error || '#F66' }]}>
				{niyet.bad}
			</Text>
			{niyet.good ? (
				<Text style={[styles.good, { color: colors.success || '#00A877' }]}>
					{niyet.good}
				</Text>
			) : null}
			<View style={styles.progressRow}>
				<View
					style={[
						styles.progressBarContainer,
						{ backgroundColor: isDark ? colors.border || '#333' : '#e6e6e6' },
					]}
				>
					<View
						style={[
							styles.progressBar,
							{
								width: `${niyet.progress}%`,
								backgroundColor: colors.success || '#00A877',
							},
						]}
					/>
				</View>
				<Text
					style={[
						styles.streak,
						{ color: isDark ? colors.secondary : '#656565' },
					]}
				>
					{niyet.streak} day streak
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 0 },
	banner: { height: 170, margin: 12, borderRadius: 16, overflow: 'hidden' },
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: 'rgba(20,20,30,0.35)',
	},
	bannerContent: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	quoteText: {
		fontSize: 17,
		fontWeight: '600',
		textAlign: 'center',
		marginBottom: 8,
	},
	quoteAuthor: { fontSize: 14, textAlign: 'center' },

	section: { marginTop: 8, marginHorizontal: 12 },
	sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
	card: {
		borderRadius: 12,
		padding: 12,
		marginBottom: 12,
	},
	bad: { fontSize: 16, fontWeight: '600' },
	good: { fontSize: 15, marginTop: 2 },
	progressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
	progressBarContainer: {
		flex: 1,
		height: 6,
		borderRadius: 3,
	},
	progressBar: { height: 6, borderRadius: 3 },
	streak: { fontSize: 12, marginLeft: 8 },
	createBtn: {
		borderRadius: 12,
		alignItems: 'center',
		padding: 14,
		marginTop: 12,
	},
	createBtnText: { fontSize: 16, fontWeight: '600' },
});
