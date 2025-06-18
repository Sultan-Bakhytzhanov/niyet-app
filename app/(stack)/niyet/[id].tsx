import React, { useState, useEffect, useCallback } from 'react';
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
	Alert,
	TouchableOpacity,
	Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useScreenLayout } from '@/hooks/useScreenLayout';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/providers/AuthProvider';
import i18n from '@/i18n';
import { supabase } from '@/lib/supabase';
import type { Niyet, LogEntry } from '@/types/Niyet';
import NiyetInfoCard from '@/components/NiyetInfoCard';

const STORAGE_KEY = 'niyets';

export default function NiyetDetailScreen() {
	const { colors, colorScheme } = useScreenLayout();
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const { user } = useAuth(); // Используем user из контекста

	const [niyet, setNiyet] = useState<Niyet | null>(null);
	const [loading, setLoading] = useState(true);
	const [logInput, setLogInput] = useState('');
	const [editModalVisible, setEditModalVisible] = useState(false);
	const [badInput, setBadInput] = useState('');
	const [goodInput, setGoodInput] = useState('');

	// Функция для получения всех ниетов из AsyncStorage
	const getNiyetsFromStorage = useCallback(async (): Promise<Niyet[]> => {
		const data = await AsyncStorage.getItem(STORAGE_KEY);
		return data ? JSON.parse(data) : [];
	}, []);

	// Функция для обновления ниетов в AsyncStorage
	const updateNiyetsInStorage = useCallback(async (updatedNiyets: Niyet[]) => {
		await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNiyets));
	}, []);

	// Открытие модального окна для редактирования
	const openEditModal = () => {
		if (!niyet) return;
		setBadInput(niyet.bad);
		setGoodInput(niyet.good || '');
		setEditModalVisible(true);
	};

	// Сохранение отредактированного ниета
	const saveEditedNiyet = async () => {
		if (!niyet || !badInput.trim()) {
			Alert.alert('Ошибка', 'Название вредной привычки не может быть пустым.');
			return;
		}

		const updatedNiyet: Niyet = {
			...niyet,
			bad: badInput.trim(),
			good: goodInput.trim() ? goodInput.trim() : undefined,
		};

		setNiyet(updatedNiyet);
		setEditModalVisible(false);

		// Обновляем данные на сервере
		const { error } = await supabase
			.from('niyets')
			.update(updatedNiyet)
			.eq('id', id);

		if (error) {
			Alert.alert(
				'Ошибка обновления',
				'Не удалось обновить ниет: ' + error.message
			);
		} else {
			Alert.alert('Успех', 'Ниет обновлен');
		}
	};

	// Получение ниета из базы данных
	const fetchNiyet = useCallback(async () => {
		if (!user) return;
		setLoading(true);

		// Загружаем ниет с сервера
		const { data, error } = await supabase
			.from('niyets')
			.select('*')
			.eq('user_id', user.id)
			.eq('id', id)
			.single();

		if (error) {
			Alert.alert('Ошибка загрузки', error.message);
		} else {
			setNiyet(data);
		}
		setLoading(false);
	}, [user, id]);

	useEffect(() => {
		fetchNiyet();
	}, [fetchNiyet]);

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

		// Обновляем в Supabase
		const { error } = await supabase
			.from('niyets')
			.update({ logs: updatedLogs })
			.eq('id', id);

		if (error) {
			Alert.alert('Ошибка', 'Не удалось обновить журнал: ' + error.message);
		}
	};

	// Удаление записи из журнала
	const deleteLog = async (logIdToDelete: string) => {
		if (!niyet || !niyet.logs) return;

		Alert.alert(
			i18n.t('delete_log_title'), // "Удалить запись?"
			i18n.t('delete_log_message'), // "Вы уверены, что хотите удалить эту запись из журнала?"
			[
				{ text: i18n.t('cancel'), style: 'cancel' },
				{
					text: i18n.t('delete'),
					style: 'destructive',
					onPress: async () => {
						const updatedLogs = niyet.logs!.filter(
							log => log.id !== logIdToDelete
						);
						const updatedNiyet = { ...niyet, logs: updatedLogs };
						setNiyet(updatedNiyet);

						// Обновляем в Supabase
						const { error } = await supabase
							.from('niyets')
							.update({ logs: updatedLogs })
							.eq('id', id);

						if (error) {
							Alert.alert(
								'Ошибка удаления',
								'Не удалось удалить запись: ' + error.message
							);
						}
					},
				},
			]
		);
	};

	// Прогресс отмечания дня
	const onMarkDay = async () => {
		if (!niyet) return;

		const today = new Date();
		const todayStr = today.toISOString().slice(0, 10); // 'YYYY-MM-DD'

		const lastDateStr = niyet.lastMarkedDate;
		const alreadyMarkedToday = lastDateStr === todayStr;

		if (alreadyMarkedToday) {
			Alert.alert(
				i18n.t('already_marked_title'), // "Вы уже отмечались сегодня"
				i18n.t('already_marked_message'), // "Вы уверены, что хотите отметить ещё раз?"
				[
					{ text: i18n.t('cancel'), style: 'cancel' },
					{
						text: i18n.t('mark_again'),
						style: 'default',
						onPress: () => handleMarking(true, false),
					},
				]
			);
		} else {
			// Проверим, был ли пропущен день
			let missed = false;
			if (lastDateStr) {
				const lastDate = new Date(lastDateStr);
				const diffTime = today.getTime() - lastDate.getTime();
				const diffDays = diffTime / (1000 * 60 * 60 * 24);

				if (diffDays >= 2) {
					missed = true; // пропущено более суток
				}
			}
			handleMarking(false, missed);
		}
	};

	const handleMarking = async (forced: boolean, resetStreak: boolean) => {
		if (!niyet) return;

		const todayStr = new Date().toISOString().slice(0, 10);

		const newStreak = resetStreak ? 1 : (niyet.streak ?? 0) + 1;
		const newProgress = resetStreak
			? 0
			: Math.min((niyet.progress ?? 0) + 5, 100);

		const updatedNiyet: Niyet = {
			...niyet,
			streak: newStreak,
			progress: newProgress,
			lastMarkedDate: todayStr,
			status: 'active', // строгое значение, уже ожидаемое типом
		};

		setNiyet(updatedNiyet);

		// Обновляем в Supabase
		const { error } = await supabase
			.from('niyets')
			.update(updatedNiyet)
			.eq('id', id);

		if (error) {
			Alert.alert(
				'Ошибка обновления',
				'Не удалось обновить статус: ' + error.message
			);
		}
	};

	// Удаление Ниета
	const deleteNiyet = async () => {
		if (!niyet) return;

		Alert.alert(
			i18n.t('delete_niyet_title'), // 'Удалить Ниет?'
			i18n.t('delete_niyet_message', { bad: niyet.bad }), // шаблон с подстановкой
			[
				{ text: i18n.t('cancel'), style: 'cancel' },
				{
					text: i18n.t('delete'),
					style: 'destructive',
					onPress: async () => {
						// Удаление из базы данных Supabase
						const { error } = await supabase
							.from('niyets')
							.delete()
							.eq('id', id);

						if (error) {
							Alert.alert(
								'Ошибка удаления',
								'Не удалось удалить ниет: ' + error.message
							);
						} else {
							// Удаляем локально
							const allNiyets = await getNiyetsFromStorage();
							const newNiyetsArray = allNiyets.filter(n => n.id !== niyet.id);
							await updateNiyetsInStorage(newNiyetsArray);
							router.back(); // Возвращаемся назад
						}
					},
				},
			]
		);
	};

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
					style={[styles.backBtn, { backgroundColor: colors.surface }]}
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
					{i18n.t('thought_journal')}
				</Text>

				{/* Форма для добавления записи */}
				<View style={styles.logInputBlock}>
					<TextInput
						value={logInput}
						onChangeText={setLogInput}
						placeholder='Поделитесь мыслями, опытом или заметкой...'
						placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#888'}
						style={[styles.input, { backgroundColor: colors.surface }]}
						multiline
						textAlignVertical='top'
					/>
					<TouchableOpacity
						style={[styles.addBtn, { backgroundColor: colors.primary }]}
						onPress={addLog}
						disabled={!logInput.trim()}
					>
						<Ionicons name='add-circle-outline' size={24} color='#fff' />
					</TouchableOpacity>
				</View>

				{/* Список журналов */}
				{(niyet.logs?.length ?? 0) > 0 ? (
					niyet.logs!.map(log => (
						<View
							key={log.id}
							style={[styles.logItem, { backgroundColor: colors.surface }]}
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
										color={colors.error}
									/>
								</TouchableOpacity>
							</View>
						</View>
					))
				) : (
					<Text style={[styles.value, { color: colors.textSecondary }]}>
						{i18n.t('no_logs')}
					</Text>
				)}
			</ScrollView>

			{/* Кнопки действий для Ниета */}
			<View style={styles.niyetActionsContainer}>
				<TouchableOpacity
					style={[styles.actionButton, { borderColor: colors.primary }]}
					onPress={openEditModal}
				>
					<Ionicons name='create-outline' size={20} color={colors.primary} />
					<Text style={[styles.actionButtonText, { color: colors.primary }]}>
						{i18n.t('edit')}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.actionButton, { borderColor: colors.error }]}
					onPress={deleteNiyet}
				>
					<Ionicons name='trash-outline' size={20} color={colors.error} />
					<Text style={[styles.actionButtonText, { color: colors.error }]}>
						{i18n.t('delete_niyet')}
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
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	modalContainer: {
		width: '100%',
		maxWidth: 400,
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 20,
		elevation: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 8,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: '700',
		marginBottom: 14,
		textAlign: 'center',
	},
	modalInput: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 10,
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 16,
		backgroundColor: '#f9f9f9',
		color: '#222',
	},
	modalButtons: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginTop: 20,
	},
	modalButton: {
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 8,
		marginLeft: 10,
	},
	modalCancel: {
		backgroundColor: '#e0e0e0',
	},
	modalSave: {
		backgroundColor: '#00A877',
	},
	modalButtonText: {
		color: '#fff',
		fontWeight: 'bold',
	},
	modalCancelText: {
		color: '#333',
		fontWeight: 'bold',
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
		// justifyContent: 'space-around',
		marginTop: 20,
		marginBottom: 10,
		gap: 10,
	},
	actionButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 10,
		paddingHorizontal: 12,
		borderRadius: 20,
		borderWidth: 1.5,
		marginHorizontal: 5, // небольшое пространство между кнопками
	},
	actionButtonText: {
		marginLeft: 8,
		fontWeight: '600',
		fontSize: 14,
	},
});
