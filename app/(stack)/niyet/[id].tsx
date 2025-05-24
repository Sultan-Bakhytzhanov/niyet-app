import React, { useEffect, useState, useCallback } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	ActivityIndicator,
	TextInput,
	Pressable,
	KeyboardAvoidingView,
	Platform,
	Alert, // Для подтверждений
	TouchableOpacity, // Для лучшего UX на кнопках
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NiyetInfoCard from '@/components/NiyetInfoCard'; // Предполагаем, что этот компонент отображает всю инфо
import { useScreenLayout } from '@/hooks/useScreenLayout';
// Импортируем иконки (пример, можно использовать expo-vector-icons)
import { Ionicons } from '@expo/vector-icons';
import type { Niyet, LogEntry } from '@/types/Niyet';
// Обновим тип для логов, чтобы включить ID и timestamp

const STORAGE_KEY = 'niyets';

export default function NiyetDetailScreen() {
	const { colors, colorScheme } = useScreenLayout();
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const [niyet, setNiyet] = useState<Niyet | null>(null);
	// logs теперь не нужен как отдельный state, будем брать из niyet.logs
	const [loading, setLoading] = useState(true);
	const [logInput, setLogInput] = useState('');

	// Функция для обновления ниетов в AsyncStorage
	const updateNiyetsInStorage = useCallback(async (updatedNiyets: Niyet[]) => {
		await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNiyets));
	}, []);

	// Функция для получения всех ниетов
	const getNiyetsFromStorage = useCallback(async (): Promise<Niyet[]> => {
		const data = await AsyncStorage.getItem(STORAGE_KEY);
		return data ? JSON.parse(data) : [];
	}, []);

	// Загружаем ниет по id
	useEffect(() => {
		const loadNiyet = async () => {
			setLoading(true);
			const allNiyets = await getNiyetsFromStorage();
			const foundNiyet = allNiyets.find(n => n.id === id);
			if (foundNiyet) {
				setNiyet(foundNiyet);
			}
			setLoading(false);
		};
		loadNiyet();
	}, [id, getNiyetsFromStorage]);

	// Добавление новой записи в журнал
	const addLog = async () => {
		if (!logInput.trim() || !niyet) return;

		const newLog: LogEntry = {
			id: Date.now().toString(), // Уникальный ID для лога
			text: logInput.trim(),
			createdAt: new Date().toISOString(),
		};

		const updatedLogs = [newLog, ...(niyet.logs || [])];
		const updatedNiyet = { ...niyet, logs: updatedLogs };
		setNiyet(updatedNiyet); // Обновляем локальное состояние
		setLogInput('');

		// Обновляем в AsyncStorage
		const allNiyets = await getNiyetsFromStorage();
		const newNiyetsArray = allNiyets.map(n =>
			n.id === niyet.id ? updatedNiyet : n
		);
		await updateNiyetsInStorage(newNiyetsArray);
	};

	// Удаление записи из журнала
	const deleteLog = async (logIdToDelete: string) => {
		if (!niyet || !niyet.logs) return;

		Alert.alert(
			'Удалить запись?',
			'Вы уверены, что хотите удалить эту запись из журнала?',
			[
				{ text: 'Отмена', style: 'cancel' },
				{
					text: 'Удалить',
					style: 'destructive',
					onPress: async () => {
						const updatedLogs = niyet.logs!.filter(
							log => log.id !== logIdToDelete
						);
						const updatedNiyet = { ...niyet, logs: updatedLogs };
						setNiyet(updatedNiyet);

						const allNiyets = await getNiyetsFromStorage();
						const newNiyetsArray = allNiyets.map(n =>
							n.id === niyet.id ? updatedNiyet : n
						);
						await updateNiyetsInStorage(newNiyetsArray);
					},
				},
			]
		);
	};

	// Прогресс отмечания дня
	const onMarkDay = async () => {
		if (!niyet) return;
		// TODO: Добавить логику проверки lastMarkedDate для сброса серии, если нужно
		const newStreak = (niyet.streak ?? 0) + 1;
		const newProgress = Math.min((niyet.progress ?? 0) + 5, 100); // Увеличиваем на 5%, максимум 100%
		const updatedNiyet = {
			...niyet,
			streak: newStreak,
			progress: newProgress,
			// lastMarkedDate: new Date().toISOString().split('T')[0], // сохраняем только дату
		};
		setNiyet(updatedNiyet);

		const allNiyets = await getNiyetsFromStorage();
		const newNiyetsArray = allNiyets.map(n =>
			n.id === niyet.id ? updatedNiyet : n
		);
		await updateNiyetsInStorage(newNiyetsArray);
	};

	// Удаление Ниета
	const deleteNiyet = async () => {
		if (!niyet) return;
		Alert.alert(
			'Удалить Ниет?',
			`Вы уверены, что хотите удалить ниет "${niyet.bad}"? Это действие необратимо.`,
			[
				{ text: 'Отмена', style: 'cancel' },
				{
					text: 'Удалить',
					style: 'destructive',
					onPress: async () => {
						const allNiyets = await getNiyetsFromStorage();
						const newNiyetsArray = allNiyets.filter(n => n.id !== niyet.id);
						await updateNiyetsInStorage(newNiyetsArray);
						router.back(); // Возвращаемся на предыдущий экран
					},
				},
			]
		);
	};

	// Навигация на экран редактирования (предполагается, что такой экран будет)
	// const navigateToEdit = () => {
	// 	if (!niyet) return;
	// 	router.push(`/niyets/edit/${niyet.id}`); // Пример пути
	// };

	if (loading) {
		return (
			<View style={[styles.center, { backgroundColor: colors.background }]}>
				<ActivityIndicator size='large' color={colors.primary} />
			</View>
		);
	}

	if (!niyet) {
		return (
			<View style={[styles.center, { backgroundColor: colors.background }]}>
				<Text style={{ fontSize: 18, color: colors.error || '#F66' }}>
					Ниет не найден
				</Text>
				<Pressable
					onPress={() => router.back()}
					style={[
						styles.backBtn,
						{
							backgroundColor:
								colorScheme === 'dark' ? colors.surface : '#e9e9ed',
						},
					]}
				>
					<Text style={{ color: colors.primary, fontWeight: 'bold' }}>
						Назад
					</Text>
				</Pressable>
			</View>
		);
	}

	return (
		<KeyboardAvoidingView
			style={{ flex: 1, backgroundColor: colors.background }}
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
		>
			<ScrollView
				style={[styles.container, { backgroundColor: colors.background }]}
				contentContainerStyle={styles.scrollContentContainer}
				keyboardShouldPersistTaps='handled'
			>
				{/* Карточка ниета с прогрессом */}
				<NiyetInfoCard niyet={niyet} onMarkDay={onMarkDay} />

				<Text style={[styles.title, { color: colors.text, marginTop: 24 }]}>
					Журнал мыслей:
				</Text>

				{/* Форма для добавления записи */}
				<View style={styles.logInputBlock}>
					<TextInput
						value={logInput}
						onChangeText={setLogInput}
						placeholder='Поделитесь мыслями, опытом или заметкой...'
						placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
						style={[
							styles.input,
							{
								backgroundColor:
									colorScheme === 'dark' ? colors.surface : '#f3f6fa',
								color: colors.text,
								borderColor:
									colorScheme === 'dark'
										? colors.border || '#393955'
										: '#e2e7ee',
							},
						]}
						multiline
						textAlignVertical='top' // Для Android, чтобы текст начинался сверху в multiline
					/>
					<TouchableOpacity
						style={[styles.addBtn, { backgroundColor: colors.primary }]}
						onPress={addLog}
						disabled={!logInput.trim()} // Делаем кнопку неактивной, если инпут пуст
					>
						<Ionicons name='add-circle-outline' size={24} color='#fff' />
						{/* <Text style={{ color: '#fff', fontWeight: 'bold' }}>Добавить</Text> */}
					</TouchableOpacity>
				</View>

				{/* Список журналов */}
				{(niyet.logs?.length ?? 0) > 0 ? (
					niyet.logs!.map(log => (
						<View
							key={log.id}
							style={[
								styles.logItem,
								{
									backgroundColor:
										colorScheme === 'dark' ? colors.surface : '#f8f9fd',
									borderColor:
										colorScheme === 'dark'
											? colors.border || '#393955'
											: '#e8eaf0',
								},
							]}
						>
							<Text style={[styles.logText, { color: colors.text }]}>
								{log.text}
							</Text>
							<View style={styles.logMeta}>
								<Text
									style={[styles.logTimestamp, { color: colors.textSecondary }]}
								>
									{new Date(log.createdAt).toLocaleString('ru-RU', {
										day: '2-digit',
										month: 'short',
										year: 'numeric',
										hour: '2-digit',
										minute: '2-digit',
									})}
								</Text>
								<TouchableOpacity onPress={() => deleteLog(log.id)}>
									<Ionicons
										name='trash-bin-outline'
										size={20}
										color={colors.error || '#F66'}
									/>
								</TouchableOpacity>
							</View>
						</View>
					))
				) : (
					<Text
						style={[
							styles.value,
							{
								color: colors.textSecondary,
								marginTop: 10,
								textAlign: 'center',
							},
						]}
					>
						Записей пока нет. Добавьте свою первую мысль!
					</Text>
				)}
			</ScrollView>
			{/* Кнопки действий для Ниета */}
			<View style={styles.niyetActionsContainer}>
				<TouchableOpacity
					style={[styles.actionButton, { borderColor: colors.primary }]}
					//onPress={navigateToEdit}
				>
					<Ionicons name='create-outline' size={20} color={colors.primary} />
					<Text style={[styles.actionButtonText, { color: colors.primary }]}>
						Редактировать
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.actionButton, { borderColor: colors.error }]}
					onPress={deleteNiyet}
				>
					<Ionicons name='trash-outline' size={20} color={colors.error} />
					<Text style={[styles.actionButtonText, { color: colors.error }]}>
						Удалить Ниет
					</Text>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	scrollContentContainer: {
		padding: 20,
		paddingBottom: 40, // Добавим отступ снизу
	},
	center: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	goodHabitContainer: {
		marginTop: 16,
		padding: 12,
		borderRadius: 8,
		backgroundColor: 'rgba(0,0,0,0.03)', // Нейтральный фон
	},
	label: {
		fontSize: 13,
		fontWeight: '600',
		opacity: 0.7,
		marginBottom: 2,
	},
	title: { fontWeight: '700', fontSize: 18, marginBottom: 8 }, // Увеличил размер и добавил отступ
	value: { fontSize: 16, marginTop: 4 },
	logInputBlock: {
		marginTop: 8,
		flexDirection: 'row',
		alignItems: 'flex-start', // Изменили на flex-start для multiline input
		gap: 8,
	},
	input: {
		flex: 1,
		minHeight: 50, // Увеличил минимальную высоту
		maxHeight: 120, // Ограничил максимальную высоту
		borderRadius: 10,
		paddingHorizontal: 12,
		paddingVertical: 10, // Увеличил padding
		fontSize: 15,
		borderWidth: 1,
	},
	addBtn: {
		padding: 12, // Сделал кнопку квадратной для иконки
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		height: 50, // Фиксированная высота, как у инпута
		aspectRatio: 1, // Для квадратности, если только иконка
	},
	logItem: {
		marginTop: 12,
		padding: 12,
		borderRadius: 10,
		borderWidth: 1,
		shadowColor: '#000', // Легкая тень для карточек
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
		elevation: 1,
	},
	logText: {
		fontSize: 15,
		lineHeight: 22,
	},
	logMeta: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 10,
	},
	logTimestamp: {
		fontSize: 12,
		opacity: 0.6,
	},
	backBtn: {
		marginTop: 20,
		paddingHorizontal: 22,
		paddingVertical: 10,
		borderRadius: 20, // Более скругленная
	},
	niyetActionsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around', // Или 'flex-end' и gap, если нужно справа
		marginTop: 20,
		marginBottom: 10,
		gap: 10, // Пространство между кнопками
	},
	actionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 20, // Скругленные кнопки
		borderWidth: 1.5,
		// flex: 1, // Если нужно, чтобы кнопки занимали всю доступную ширину поровну
	},
	actionButtonText: {
		marginLeft: 8,
		fontWeight: '600',
		fontSize: 14,
	},
});
