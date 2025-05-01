import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
	const { colorScheme } = useColorScheme();

	return (
		<Tabs
			screenOptions={({ route }) => ({
				tabBarShowLabel: false,
				tabBarStyle: {
					position: 'absolute',
					bottom: 24,
					left: 24,
					right: 24,
					height: 48,
					borderRadius: 28,
					backgroundColor:
						colorScheme === 'dark' ? 'rgba(18,18,18,0.9)' : '#ffffff',
					borderTopWidth: 0,
				},
				tabBarItemStyle: {
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
				},
				tabBarIcon: ({ focused }) => {
					const iconsMap = {
						home: 'home-outline',
						niyets: 'list-outline',
						profile: 'person-outline',
					} as const;

					const iconName =
						iconsMap[route.name as keyof typeof iconsMap] || 'home-outline';

					if (focused) {
						return (
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									backgroundColor: '#00C853',
									paddingHorizontal: 12,
									paddingVertical: 6,
									borderRadius: 20,
									flex: 1, // активная кнопка РАСТЯГИВАЕТСЯ на ширину вкладки
									justifyContent: 'center',
								}}
							>
								<Ionicons name={iconName} size={24} color='#000' />
								<Text
									style={{
										color: '#000',
										fontWeight: 'bold',
										marginLeft: 6,
										fontSize: 14,
									}}
								>
									{route.name.charAt(0).toUpperCase() + route.name.slice(1)}
								</Text>
							</View>
						);
					} else {
						return (
							<Ionicons
								name={iconName}
								size={26}
								color={colorScheme === 'dark' ? '#888' : '#666'}
							/>
						);
					}
				},
			})}
		/>
	);
}
