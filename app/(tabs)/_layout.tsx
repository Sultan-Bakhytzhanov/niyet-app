// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { TouchableOpacity, View, Image } from 'react-native';
import { House, ListTodo, User, Settings } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import i18n from '@/i18n';
import { useLanguage } from '@/providers/LanguageProvider';

export default function TabLayout() {
	const { colorScheme } = useColorScheme() as { colorScheme: 'light' | 'dark' };
	const colors = Colors[colorScheme];
	const router = useRouter();
	useLanguage();

	const HeaderLeft = () => (
		<View
			style={{
				marginLeft: 8,
				width: 28,
				height: 28,
				borderRadius: 6,
				overflow: 'hidden',
				backgroundColor: colors.surface,
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Image
				source={require('@/assets/images/logo.png')}
				style={{ width: 24, height: 24 }}
				resizeMode='contain'
			/>
		</View>
	);
	const HeaderRight = () => (
		<TouchableOpacity
			onPress={() => router.push('/settings')}
			style={{ marginRight: 16 }}
		>
			<Settings size={24} color={colors.text} />
		</TouchableOpacity>
	);

	return (
		<Tabs
			screenOptions={{
				headerStyle: {
					backgroundColor: colors.surface,
					borderBottomColor: colors.border,
					borderBottomWidth: 1,
				},
				headerTitle: () => null,
				headerLeft: HeaderLeft,
				headerRight: HeaderRight,
				headerShown: false,
				tabBarStyle: {
					backgroundColor: colors.surface,
					borderTopColor: colors.border,
					height: 64,
					paddingHorizontal: 24,
				},
				tabBarActiveTintColor: colors.primary,
				tabBarInactiveTintColor: colors.tabIconDefault,
				tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
			}}
		>
			<Tabs.Screen
				name='home'
				options={{
					title: i18n.t('tab_home'),
					tabBarIcon: ({ color }) => <House size={24} color={color} />,
					headerShown: true,
				}}
			/>

			<Tabs.Screen
				name='niyets'
				options={({ route }) => {
					const nested = getFocusedRouteNameFromRoute(route);
					return {
						title: i18n.t('tab_niyets'),
						tabBarIcon: ({ color }) => <ListTodo size={24} color={color} />,
						headerShown: nested == null,
					};
				}}
			/>

			<Tabs.Screen
				name='profile'
				options={{
					title: i18n.t('tab_profile'),
					tabBarIcon: ({ color }) => <User size={24} color={color} />,
					headerShown: true,
				}}
			/>
		</Tabs>
	);
}
