import React, { useState, useEffect, useCallback } from 'react';
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
	ScrollView,
	Alert,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useScreenLayout } from '@/hooks/useScreenLayout';
import i18n from '@/i18n';
import { useLanguage } from '@/providers/LanguageProvider';
import { getMotivationalQuote } from '@/api/getMotivationalQuote';
import { useRouter } from 'expo-router';
import ScaleModal from '@/components/ScaleModal';
import { useFocusEffect } from '@react-navigation/native';
import type { Niyet } from '@/types/Niyet';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';

const backgrounds = [
	{ img: require('@/assets/images/bg1.png'), isDark: true },
	{ img: require('@/assets/images/bg2.jpg'), isDark: true },
	{ img: require('@/assets/images/bg3.jpg'), isDark: true },
];

export default function HomeScreen() {
	const { language } = useLanguage();
	const { user, profile } = useAuth();
	const router = useRouter();
	const { backgroundColor, textColor, colors, colorScheme } = useScreenLayout({
		withLogo: true,
		showSettings: true,
	});

	const [niyets, setNiyets] = useState<Niyet[]>([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [badInput, setBadInput] = useState('');
	const [goodInput, setGoodInput] = useState('');

	useFocusEffect(
		useCallback(() => {
			const fetchNiyets = async () => {
				if (!user) return;
				const { data, error } = await supabase
					.from('niyets')
					.select('*')
					.eq('user_id', user.id)
					.order('created_at', { ascending: false });
				if (error) {
					console.error('Ошибка загрузки ниетов:', error.message);
				} else {
					setNiyets(data);
				}
			};
			fetchNiyets();
		}, [user])
	);

	const createNiyet = async () => {
		if (!badInput.trim() || !user) return;

		const newNiyet: Partial<Niyet> = {
			bad: badInput.trim(),
			good: goodInput.trim() || undefined,

			progress: 0,
			streak: 0,
			status: 'active',
			user_id: user.id,
		};

		const { data, error } = await supabase
			.from('niyets')
			.insert(newNiyet)
			.select();
		if (error) {
			Alert.alert('Ошибка', 'Не удалось создать ниет: ' + error.message);
			return;
		}
		if (data) {
			setNiyets(prev => [data[0], ...prev]);
			closeModal();
		}
	};

	const openModal = () => setModalVisible(true);
	const closeModal = () => {
		setModalVisible(false);
		setBadInput('');
		setGoodInput('');
	};

	const [bg, setBg] = useState(backgrounds[0]);
	const [quote, setQuote] = useState('');
	const [author, setAuthor] = useState('');
	const [loading, setLoading] = useState(true);

	const rerenderQuoteBlock = async () => {
		setLoading(true);
		setBg(backgrounds[Math.floor(Math.random() * backgrounds.length)]);
		try {
			const res = await getMotivationalQuote(language);
			setQuote(res.quote);
			setAuthor(res.author);
		} catch {
			setQuote(
				'Каждый маленький шаг — это прогресс. Твои намерения формируют твою реальность.'
			);
			setAuthor('Народная мудрость');
		}
		setLoading(false);
	};

	useEffect(() => {
		rerenderQuoteBlock();
	}, [language]);

	const lastNiyet = niyets[0] || null;
	const topStreaks = [...niyets]
		.sort((a, b) => b.streak - a.streak)
		.slice(0, 3);

	return (
		<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
			<StatusBar
				backgroundColor={colors.background}
				barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
			/>

			<Animated.View style={[styles.container, backgroundColor]}>
				<ImageBackground
					source={bg.img}
					style={styles.banner}
					imageStyle={{ borderRadius: 16 }}
				>
					<View style={styles.overlay} />
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
							{i18n.t('update_quote')}
						</Text>
					</Pressable>
				</ImageBackground>

				<View style={styles.section}>
					<Text style={[styles.sectionTitle, { color: colors.text }]}>
						{i18n.t('latest_niyet')}
					</Text>
					{lastNiyet ? (
						<Pressable
							onPress={() =>
								router.push({
									pathname: '/(stack)/niyet/[id]',
									params: { id: lastNiyet.id },
								})
							}
						>
							<NiyetCard
								niyet={lastNiyet}
								colors={colors}
								colorScheme={colorScheme}
							/>
						</Pressable>
					) : (
						<Text
							style={{
								color: colors.secondary,
								textAlign: 'center',
								marginVertical: 12,
							}}
						>
							{i18n.t('no_niyets')}
						</Text>
					)}

					<Text
						style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}
					>
						{i18n.t('top_streaks')}
					</Text>
					{topStreaks.length > 0 ? (
						topStreaks.map(niyet => (
							<Pressable
								key={niyet.id}
								onPress={() =>
									router.push({
										pathname: '/(stack)/niyet/[id]',
										params: { id: niyet.id },
									})
								}
							>
								<NiyetCard
									niyet={niyet}
									colors={colors}
									colorScheme={colorScheme}
								/>
							</Pressable>
						))
					) : (
						<Text
							style={{
								color: colors.secondary,
								textAlign: 'center',
								marginVertical: 12,
							}}
						>
							{i18n.t('no_top_niyets')}
						</Text>
					)}
				</View>

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
						style={{
							color:
								colorScheme === 'dark' ? colors.primary || '#6FE3C1' : '#fff',
							fontWeight: '600',
							fontSize: 16,
						}}
					>
						+ {i18n.t('add_niyet')}
					</Text>
				</Pressable>

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
						{i18n.t('add_niyet')}
					</Text>
					<Text
						style={{ color: colors.secondary, fontSize: 14, marginBottom: 4 }}
					>
						{i18n.t('bad_habit')}*
					</Text>
					<TextInput
						value={badInput}
						onChangeText={setBadInput}
						placeholder={i18n.t('habit_example')}
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
						style={{ color: colors.secondary, fontSize: 14, marginBottom: 4 }}
					>
						{i18n.t('good_habit')}
					</Text>
					<TextInput
						value={goodInput}
						onChangeText={setGoodInput}
						placeholder={i18n.t('good_example')}
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
								{i18n.t('create')}
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
								{i18n.t('cancel')}
							</Text>
						</Pressable>
					</View>
				</ScaleModal>
			</Animated.View>
		</ScrollView>
	);
}

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
					🔥 {niyet.streak}
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
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
	card: { borderRadius: 12, padding: 12, marginBottom: 12 },
	bad: { fontSize: 16, fontWeight: '600' },
	good: { fontSize: 15, marginTop: 2 },
	progressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
	progressBarContainer: { flex: 1, height: 6, borderRadius: 3 },
	progressBar: { height: 6, borderRadius: 3 },
	streak: { fontSize: 12, marginLeft: 8 },
	createBtn: {
		borderRadius: 12,
		alignItems: 'center',
		padding: 14,
		marginTop: 12,
		marginBottom: 16,
	},
});
