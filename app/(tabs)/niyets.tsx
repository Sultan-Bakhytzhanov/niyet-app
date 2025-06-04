import React, { useState, useCallback, useMemo } from 'react';
import {
	StyleSheet,
	FlatList,
	Pressable,
	View,
	ActivityIndicator,
	Text,
	TextInput,
	StatusBar,
	ScrollView,
} from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAnimatedTheme } from '@/providers/ThemeProvider';
import { useScreenLayout } from '@/hooks/useScreenLayout';
import { useLanguage } from '@/providers/LanguageProvider';
import i18n from '@/i18n';
import type { Niyet } from '@/types/Niyet';
import ScaleModal from '@/components/ScaleModal';

const STORAGE_KEY = 'niyets';
type TabKey = 'active' | 'completed' | 'paused';

const NiyetListItem = ({
	item,
	textColorStyle,
	cardBackgroundStyle,
	onPress,
	colors,
}: {
	item: Niyet;
	textColorStyle: any;
	cardBackgroundStyle: any;
	onPress: () => void;
	colors: ReturnType<typeof useScreenLayout>['colors'];
}) => {
	return (
		<Pressable onPress={onPress} style={styles.cardOuterPressable}>
			<Animated.View style={[styles.card, cardBackgroundStyle]}>
				<Animated.Text style={[styles.badHabit, textColorStyle]}>
					{item.bad}
				</Animated.Text>
				{item.good && (
					<Animated.Text style={[styles.goodHabit, textColorStyle]}>
						{`${i18n.t('goal')}: ${item.good}`}
					</Animated.Text>
				)}
				<View style={styles.infoRow}>
					<Animated.Text style={[styles.infoText, textColorStyle]}>
						{`${i18n.t('progress')}: ${item.progress}%`}
					</Animated.Text>
					<Animated.Text style={[styles.infoText, textColorStyle]}>
						🔥 {item.streak}
					</Animated.Text>
				</View>
				{item.status === 'paused' && (
					<Animated.Text
						style={[
							styles.statusText,
							{ color: colors?.secondary || '#FFA000' },
						]}
					>
						{i18n.t('status_paused')}
					</Animated.Text>
				)}
				{item.status === 'completed' && (
					<Animated.Text
						style={[styles.statusText, { color: colors?.success || '#4CAF50' }]}
					>
						{i18n.t('status_completed')}
					</Animated.Text>
				)}
			</Animated.View>
		</Pressable>
	);
};

export default function NiyetsScreen() {
	const { backgroundColor, textColor, colors, colorScheme } = useScreenLayout({
		withLogo: false,
		showSettings: true,
	});

	const { animatedColors } = useAnimatedTheme();
	const cardBackgroundStyle = useAnimatedStyle(() => ({
		backgroundColor: animatedColors.surface.value,
	}));
	useLanguage();
	const router = useRouter();

	const [allNiyets, setAllNiyets] = useState<Niyet[]>([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [badInput, setBadInput] = useState('');
	const [goodInput, setGoodInput] = useState('');
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<TabKey>('active');

	const loadNiyetsFromStorage = useCallback(async (): Promise<Niyet[]> => {
		try {
			const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
			const niyetsFromStorage: Niyet[] = jsonValue ? JSON.parse(jsonValue) : [];
			return niyetsFromStorage.map(n => ({
				...n,
				status: n.status || (n.progress >= 100 ? 'completed' : 'active'),
			}));
		} catch (e) {
			console.error('NiyetsScreen: Ошибка загрузки ниетов:', e);
			return [];
		}
	}, []);

	useFocusEffect(
		useCallback(() => {
			const fetchNiyets = async () => {
				setLoading(true);
				const storedNiyets = await loadNiyetsFromStorage();
				setAllNiyets(storedNiyets);
				setLoading(false);
			};
			fetchNiyets();
		}, [loadNiyetsFromStorage])
	);

	const displayedNiyets = useMemo(() => {
		switch (activeTab) {
			case 'active':
				return allNiyets.filter(
					n => n.status === 'active' && (n.progress || 0) < 100
				);
			case 'completed':
				return allNiyets.filter(
					n => n.status === 'completed' || (n.progress || 0) >= 100
				);
			case 'paused':
				return allNiyets.filter(n => n.status === 'paused');
			default:
				return [];
		}
	}, [allNiyets, activeTab]);

	const TABS: { key: TabKey; labelKey: string }[] = [
		{ key: 'active', labelKey: 'niyets_active' },
		{ key: 'completed', labelKey: 'niyets_completed' },
		{ key: 'paused', labelKey: 'niyets_paused' },
	];

	if (loading && allNiyets.length === 0) {
		return (
			<Animated.View style={[styles.container, styles.center, backgroundColor]}>
				<ActivityIndicator size='large' color={colors?.primary} />
			</Animated.View>
		);
	}

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
	async function createNiyet(
		badInput: string,
		goodInput: string,
		closeModal: () => void,
		setNiyetsOnScreen?: React.Dispatch<React.SetStateAction<Niyet[]>>
	) {
		if (!badInput.trim()) {
			console.warn("Поле 'Вредная привычка' не может быть пустым.");
			return;
		}

		const newNiyet: Niyet = {
			id: Date.now().toString(),
			bad: badInput.trim(),
			good: goodInput.trim() || undefined, // Если goodInput пустой, делаем его undefined
			progress: 0,
			streak: 0,
			createdAt: new Date().toISOString(), // Добавляем дату создания
			status: 'active', // По умолчанию новый ниет активен
			logs: [], // Инициализируем пустым массивом логов
		};

		try {
			const existingNiyetsJson = await AsyncStorage.getItem(STORAGE_KEY);
			const existingNiyets: Niyet[] = existingNiyetsJson
				? JSON.parse(existingNiyetsJson)
				: [];

			const updatedNiyets = [newNiyet, ...existingNiyets];
			setAllNiyets(prevNiyets => [newNiyet, ...prevNiyets]);
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNiyets));

			console.log('Ниет успешно создан и сохранен:', newNiyet);

			if (setNiyetsOnScreen) {
				setNiyetsOnScreen(updatedNiyets);
			}

			closeModal();
		} catch (error) {
			console.error('Ошибка при создании ниета:', error);
		}
	}

	const handleCreateNiyetPress = async () => {
		await createNiyet(badInput, goodInput, closeModal);
	};
	return (
		<Animated.View style={[styles.container, backgroundColor]}>
			<StatusBar
				backgroundColor={colors.background}
				barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
			/>
			<Animated.Text style={[styles.title, textColor]}>
				{i18n.t('my_niyets')}
			</Animated.Text>

			{/* Вкладки */}
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.tabsContainer}
				style={{ flexGrow: 0 }}
			>
				{TABS.map(tab => (
					<Pressable
						key={tab.key}
						style={[
							styles.tabButton,
							activeTab === tab.key
								? { backgroundColor: colors?.primary }
								: {
										backgroundColor: animatedColors.surface.value,
										borderColor: colors?.border,
										borderWidth: 1,
								  },
						]}
						onPress={() => setActiveTab(tab.key)}
					>
						<Animated.Text
							style={[
								styles.tabButtonText,
								activeTab === tab.key
									? { color: colors.background } // Обычно белый или очень светлый на основном цвете
									: { color: colors.text },
							]}
						>
							{i18n.t(tab.labelKey)}
						</Animated.Text>
					</Pressable>
				))}
			</ScrollView>

			{displayedNiyets.length > 0 ? (
				<FlatList
					data={displayedNiyets}
					keyExtractor={item => item.id}
					renderItem={({ item }) => (
						<NiyetListItem
							item={item}
							textColorStyle={textColor}
							cardBackgroundStyle={cardBackgroundStyle}
							onPress={() =>
								router.push({
									pathname: '/(stack)/niyet/[id]', // Literal path
									params: { id: item.id }, // Params
								})
							}
							colors={colors}
						/>
					)}
					showsVerticalScrollIndicator={false}
				/>
			) : (
				<View style={styles.emptyStateContainer}>
					<Animated.Text style={[styles.emptyStateText, textColor]}>
						{i18n.t('no_niyets_in_category')}
					</Animated.Text>
				</View>
			)}
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
								colorScheme === 'dark' ? colors.primary || '#6FE3C1' : '#fff',
						},
					]}
				>
					+ {i18n.t('add_niyet')}
				</Text>
			</Pressable>
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
						onPress={handleCreateNiyetPress}
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
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
		paddingTop: 20,
	},
	center: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		marginBottom: 20,
		textAlign: 'center',
	},
	tabsContainer: {
		flexDirection: 'row',
		paddingHorizontal: 8,
		paddingBottom: 8,
		marginBottom: 16,
	},
	tabButton: {
		paddingVertical: 4, // Уменьшенная высота
		paddingHorizontal: 24, // Немного уже, но не тесно
		borderRadius: 16, // Мягкая форма
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 8,
		height: 40, // Убираем minHeight, задаём фиксированную высоту
	},
	tabButtonText: {
		fontWeight: '500', // Чуть легче, чтобы не распухало
		fontSize: 14, // Меньше на 1pt
		lineHeight: 16, // Чуть плотнее
		textAlign: 'center',
	},
	cardOuterPressable: {
		marginBottom: 12,
	},
	card: {
		padding: 16,
		borderRadius: 12,
		marginBottom: 12,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 1,
	},
	badHabit: {
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 4,
	},
	goodHabit: {
		fontSize: 15,
		opacity: 0.8,
		marginBottom: 8,
	},
	infoRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 8,
	},
	infoText: {
		fontSize: 14,
		opacity: 0.7,
	},
	statusText: {
		fontSize: 13,
		fontWeight: '500',
		marginTop: 8,
		textAlign: 'right',
	},
	emptyStateContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	emptyStateText: {
		fontSize: 16,
		textAlign: 'center',
		opacity: 0.7,
	},
	createBtn: {
		borderRadius: 12,
		alignItems: 'center',
		padding: 14,
		marginTop: 12,
		marginBottom: 16,
	},
	createBtnText: { fontSize: 16, fontWeight: '600' },
});
