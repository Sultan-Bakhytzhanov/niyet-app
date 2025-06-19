import { useAuth } from '@/providers/AuthProvider';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
	const { session, loading } = useAuth();

	if (loading) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size='large' />
			</View>
		);
	}

	if (!session) {
		return <Redirect href='/(auth)/login' />;
	}

	return <Redirect href='/(tabs)/home' />;
}
