import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NiyetInfoCard from '@/components/NiyetInfoCard';
import { useScreenLayout } from '@/hooks/useScreenLayout';

type Niyet = {
	id: string;
	bad: string;
	good?: string;
	progress: number;
	streak: number;
	createdAt?: string;
	logs?: string[];
};

export default function NiyetDetailScreen() {
	const { colors, colorScheme } = useScreenLayout();
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const [niyet, setNiyet] = useState<Niyet | null>(null);
	const [logs, setLogs] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [logInput, setLogInput] = useState('');

	// Загружаем ниет по id
	useEffect(() => {
		setLoading(true);
		AsyncStorage.getItem('niyets').then(data => {
			if (data) {
				const arr: Niyet[] = JSON.parse(data);
				const found = arr.find(n => n.id === id);
				if (found) {
					setNiyet(found);
					setLogs(found.logs || []);
				}
			}
			setLoading(false);
		});
	}, [id]);

	// Добавление новой записи в журнал
	const addLog = async () => {
		if (!logInput.trim() || !niyet) return;
		const newLogs = [logInput.trim(), ...logs];
		setLogs(newLogs);
		setLogInput('');
		// Обновляем в AsyncStorage
		AsyncStorage.getItem('niyets').then(data => {
			if (data) {
				let arr: Niyet[] = JSON.parse(data);
				arr = arr.map(n => (n.id === niyet.id ? { ...n, logs: newLogs } : n));
				AsyncStorage.setItem('niyets', JSON.stringify(arr));
			}
		});
	};

	// Прогресс отмечания дня
	const onMarkDay = async () => {
		if (!niyet) return;
		const newStreak = (niyet.streak ?? 0) + 1;
		const newProgress = Math.min((niyet.progress ?? 0) + 5, 100);
		const updatedNiyet = { ...niyet, streak: newStreak, progress: newProgress };
		setNiyet(updatedNiyet);

		const data = await AsyncStorage.getItem('niyets');
		if (data) {
			let arr: Niyet[] = JSON.parse(data);
			arr = arr.map(n => (n.id === niyet.id ? updatedNiyet : n));
			await AsyncStorage.setItem('niyets', JSON.stringify(arr));
		}
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
				<Pressable onPress={() => router.back()} style={styles.backBtn}>
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
		>
			<ScrollView
				style={[styles.container, { backgroundColor: colors.background }]}
				contentContainerStyle={{ padding: 20 }}
				keyboardShouldPersistTaps='handled'
			>
				{/* Карточка ниета с прогрессом */}
				<NiyetInfoCard niyet={niyet} onMarkDay={onMarkDay} />

				<Text style={[styles.title, { color: colors.text, marginTop: 16 }]}>
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
					/>
					<Pressable
						style={[styles.addBtn, { backgroundColor: colors.primary }]}
						onPress={addLog}
						android_ripple={{ color: '#e0f5f0' }}
					>
						<Text style={{ color: '#fff', fontWeight: 'bold' }}>Добавить</Text>
					</Pressable>
				</View>

				{/* Список журналов */}
				{logs.length > 0 ? (
					logs.map((log, i) => (
						<View
							key={i}
							style={[
								styles.logItem,
								{
									backgroundColor:
										colorScheme === 'dark' ? colors.surface : '#f2f3fa',
									borderColor:
										colorScheme === 'dark'
											? colors.border || '#393955'
											: '#e2e2e2',
								},
							]}
						>
							<Text style={{ color: colors.text, fontSize: 15 }}>{log}</Text>
						</View>
					))
				) : (
					<Text style={[styles.value, { color: colors.text, opacity: 0.7 }]}>
						Записей пока нет.
					</Text>
				)}
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	center: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: { fontWeight: '700', fontSize: 15, marginTop: 16 },
	value: { fontSize: 16, marginTop: 4 },
	logInputBlock: {
		marginTop: 8,
		flexDirection: 'row',
		alignItems: 'flex-end',
		gap: 8,
	},
	input: {
		flex: 1,
		minHeight: 36,
		borderRadius: 10,
		paddingHorizontal: 10,
		paddingVertical: 6,
		fontSize: 15,
		borderWidth: 1,
	},
	addBtn: {
		paddingHorizontal: 14,
		paddingVertical: 10,
		borderRadius: 10,
		alignItems: 'center',
	},
	logItem: {
		marginTop: 10,
		padding: 10,
		borderRadius: 10,
		borderWidth: 1,
	},
	backBtn: {
		marginTop: 16,
		paddingHorizontal: 22,
		paddingVertical: 10,
		borderRadius: 10,
		backgroundColor: '#f3f6fa',
	},
});
