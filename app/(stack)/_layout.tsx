import { Stack } from 'expo-router';
import { useScreenLayout } from '@/hooks/useScreenLayout';

export default function StackLayout() {
	const { colors } = useScreenLayout();
	return (
		<Stack
			screenOptions={{
				headerStyle: { backgroundColor: colors.background },
				headerTintColor: colors.text,
				headerTitle: '',
				headerShadowVisible: false,
			}}
		/>
	);
}
