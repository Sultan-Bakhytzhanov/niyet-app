import React, { useState, useEffect, useRef } from 'react';
import {
	View,
	Text,
	Pressable,
	StyleSheet,
	StatusBar,
	ImageBackground,
	FlatList,
	ActivityIndicator,
	Modal,
	TextInput,
	TouchableWithoutFeedback,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useScreenLayout } from '@/hooks/useScreenLayout';
import i18n from '@/i18n';
import { useLanguage } from '@/providers/LanguageProvider';
import { getMotivationalQuote } from '@/api/getMotivationalQuote';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import ScaleModal from '@/components/ScaleModal';

type Niyet = {
	id: string;
	bad: string;
	good?: string;
	progress: number;
	streak: number;
};

const backgrounds = [
	{ img: require('@/assets/images/bg1.png'), isDark: true },
	{ img: require('@/assets/images/bg2.jpg'), isDark: true },
	{ img: require('@/assets/images/bg3.jpg'), isDark: true },
];

export default function HomeScreen() {
	const { language } = useLanguage();
	const router = useRouter();
	const { backgroundColor, textColor, colors, colorScheme } = useScreenLayout({
		withLogo: true,
		showSettings: true,
	});

	const [niyets, setNiyets] = useState<Niyet[]>([]);
	useEffect(() => {
		// При первом запуске — загружаем ниеты из AsyncStorage
		AsyncStorage.getItem('niyets').then(data => {
			if (data) setNiyets(JSON.parse(data));
		});
	}, []);
	useEffect(() => {
		// Сохраняем ниеты при каждом изменении списка
		AsyncStorage.setItem('niyets', JSON.stringify(niyets));
	}, [niyets]);
	const [modalVisible, setModalVisible] = useState(false);
	const [badInput, setBadInput] = useState('');
	const [goodInput, setGoodInput] = useState('');

	function openModal() {
		setTimeout(() => {
			setModalVisible(true);
		}, 50);
	}
	function closeModal() {
		setModalVisible(false);
		setBadInput('');
		setGoodInput('');
	}
	function createNiyet() {
		if (!badInput.trim()) return; // обязательна только вредная привычка
		setNiyets(prev => [
			...prev,
			{
				id: Date.now().toString(),
				bad: badInput,
				good: goodInput,
				progress: 0,
				streak: 0,
			},
		]);
		closeModal();
	}

	const [bg, setBg] = useState(backgrounds[0]);
	const [quote, setQuote] = useState('');
	const [author, setAuthor] = useState('');
	const [loading, setLoading] = useState(true);

	const rerenderQuoteBlock = async () => {
		setLoading(true);
		const randBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
		setBg(randBg);
		try {
			const res = await getMotivationalQuote(language);
			setQuote(res.quote);
			setAuthor(res.author);
		} catch (e) {
			setQuote(
				'Каждый маленький шаг — это прогресс. Твои намерения формируют твою реальность.'
			);
			setAuthor('Народная мудрость');
		}
		setLoading(false);
	};

	useEffect(() => {
		rerenderQuoteBlock();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [language]);

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
					{/* <View style={styles.overlay} />
					<View style={styles.bannerContent}>
						{loading ? (
							<ActivityIndicator
								size='small'
								color={bg.isDark ? '#fff' : '#222'}
							/>
						) : (
							<>
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
							</>
						)}
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
						disabled={loading}
					>
						<Text style={{ color: bg.isDark ? '#fff' : '#222', fontSize: 13 }}>
							{i18n.t('update_quote') || 'Обновить цитату'}
						</Text>
					</Pressable> */}
				</ImageBackground>

				{/* Список всех ниетов */}
				<View style={styles.section}>
					<Text style={[styles.sectionTitle, { color: colors.text }]}>
						{i18n.t('active_niyets') || 'Active Niyets'}
					</Text>
					<FlatList
						data={niyets}
						keyExtractor={item => item.id}
						renderItem={({ item }) => (
							<Pressable
								onPress={() =>
									router.push({
										pathname: '/(stack)/niyet/[id]',
										params: { id: item.id },
									})
								}
							>
								<NiyetCard
									niyet={item}
									colors={colors}
									colorScheme={colorScheme}
								/>
							</Pressable>
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
						onPress={openModal}
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

				{/* Модальное окно для создания ниета */}
				<ScaleModal
					visible={modalVisible}
					onClose={closeModal}
					overlayColor={
						colorScheme === 'dark' ? 'rgba(12,16,24,0.7)' : 'rgba(0,0,0,0.2)'
					}
					modalStyle={{
						backgroundColor: colors.surface,
						borderRadius: 22,
						paddingVertical: 28,
						paddingHorizontal: 22,
						shadowColor: '#000',
						shadowOffset: { width: 0, height: 3 },
						shadowOpacity: 0.16,
						shadowRadius: 9,
						elevation: 8,
						width: '87%',
					}}
				>
					<Text
						style={{
							fontSize: 20,
							fontWeight: '700',
							marginBottom: 18,
							color: colors.text,
							textAlign: 'center',
						}}
					>
						{i18n.t('add_niyet') || 'Создать новый ниет'}
					</Text>
					<Text
						style={{
							color: colors.secondary,
							fontSize: 14,
							marginBottom: 4,
						}}
					>
						{i18n.t('bad_habit') || 'Вредная привычка'}*
					</Text>
					<TextInput
						value={badInput}
						onChangeText={setBadInput}
						placeholder={i18n.t('habit_example') || 'Например, курение'}
						placeholderTextColor={colorScheme === 'dark' ? '#555' : '#bcbcbc'}
						style={{
							borderWidth: 1,
							borderColor: colorScheme === 'dark' ? '#383d4b' : '#e1e1e1',
							backgroundColor: colorScheme === 'dark' ? '#222533' : '#f9f9fc',
							color: colors.text,
							borderRadius: 11,
							paddingVertical: 10,
							paddingHorizontal: 12,
							marginBottom: 18,
							fontSize: 16,
						}}
					/>
					<Text
						style={{
							color: colors.secondary,
							fontSize: 14,
							marginBottom: 4,
						}}
					>
						{i18n.t('good_habit') || 'Полезная замена (необязательно)'}
					</Text>
					<TextInput
						value={goodInput}
						onChangeText={setGoodInput}
						placeholder={i18n.t('good_example') || 'Например, бегать утром'}
						placeholderTextColor={colorScheme === 'dark' ? '#555' : '#bcbcbc'}
						style={{
							borderWidth: 1,
							borderColor: colorScheme === 'dark' ? '#383d4b' : '#e1e1e1',
							backgroundColor: colorScheme === 'dark' ? '#222533' : '#f9f9fc',
							color: colors.text,
							borderRadius: 11,
							paddingVertical: 10,
							paddingHorizontal: 12,
							marginBottom: 26,
							fontSize: 16,
						}}
					/>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							marginTop: 5,
						}}
					>
						<Pressable
							onPress={createNiyet}
							style={{
								flex: 1,
								marginRight: 8,
								paddingVertical: 12,
								borderRadius: 10,
								backgroundColor: colors.primary,
								alignItems: 'center',
							}}
						>
							<Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
								{i18n.t('create') || 'Создать'}
							</Text>
						</Pressable>
						<Pressable
							onPress={closeModal}
							style={{
								flex: 1,
								marginLeft: 8,
								paddingVertical: 12,
								borderRadius: 10,
								backgroundColor:
									colorScheme === 'dark' ? colors.card || '#222533' : '#f5f5f7',
								alignItems: 'center',
								borderWidth: colorScheme === 'dark' ? 0 : 1,
								borderColor: colorScheme === 'dark' ? 'transparent' : '#e1e1e1',
							}}
						>
							<Text
								style={{
									color:
										colorScheme === 'dark' ? colors.secondary : colors.primary,
									fontWeight: '700',
									fontSize: 16,
								}}
							>
								{i18n.t('cancel') || 'Отмена'}
							</Text>
						</Pressable>
					</View>
				</ScaleModal>
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
