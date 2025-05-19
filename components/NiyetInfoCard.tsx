import type { Niyet } from '@/types/Niyet';
import React from 'react';
import {
	View,
	Text,
	Pressable,
	StyleSheet,
	useColorScheme,
	Animated,
} from 'react-native';
import { Flame, BarChart, Calendar, CheckCircle } from 'lucide-react-native';

export default function NiyetInfoCard({
	niyet,
	onMarkDay,
}: {
	niyet: Niyet;
	onMarkDay: () => void;
}) {
	const scheme = useColorScheme();
	const isDark = scheme === 'dark';

	const cardBg = isDark ? '#232536' : '#fff';
	const cardText = isDark ? '#fff' : '#222';
	const accent = isDark ? '#6FE3C1' : '#00A877';

	return (
		<View
			style={[
				styles.card,
				{ backgroundColor: cardBg, shadowColor: isDark ? '#000' : '#ddd' },
			]}
		>
			<Text style={[styles.bad, { color: accent }]}>{niyet.bad}</Text>
			{niyet.good ? <Text style={styles.good}>→ {niyet.good}</Text> : null}
			<View style={styles.infoRow}>
				<Flame size={18} color='#FF8936' style={styles.icon} />
				<Text style={styles.infoText}>Стрик: {niyet.streak}</Text>
				<BarChart size={18} color={accent} style={styles.icon} />
				<Text style={styles.infoText}>Прогресс: {niyet.progress}%</Text>
				<Calendar size={18} color='#57B6F6' style={styles.icon} />
			</View>
			{/* Прогресс-бар */}
			<View style={styles.progressBarBg}>
				<View
					style={[
						styles.progressBarFill,
						{ width: `${niyet.progress}%`, backgroundColor: accent },
					]}
				/>
			</View>
			{/* Кнопка "Отметиться" */}
			<Pressable
				style={[styles.markBtn, { backgroundColor: accent }]}
				onPress={onMarkDay}
			>
				<CheckCircle size={20} color='#fff' style={{ marginRight: 6 }} />
				<Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
					Отметиться
				</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		borderRadius: 18,
		padding: 18,
		marginBottom: 12,
		shadowOpacity: 0.11,
		shadowRadius: 10,
		elevation: 2,
	},
	bad: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
	good: { fontSize: 16, color: '#b6efde', marginBottom: 10 },
	infoRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
		gap: 8,
	},
	infoText: { fontSize: 15, color: '#b3b3b3', marginRight: 10 },
	icon: { marginRight: 2 },
	progressBarBg: {
		height: 7,
		borderRadius: 3.5,
		backgroundColor: '#36384c33',
		marginVertical: 10,
		overflow: 'hidden',
	},
	progressBarFill: {
		height: 7,
		borderRadius: 3.5,
	},
	markBtn: {
		marginTop: 8,
		alignSelf: 'flex-start',
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 10,
		flexDirection: 'row',
		alignItems: 'center',
		shadowOpacity: 0.08,
		shadowRadius: 4,
		elevation: 1,
	},
});
