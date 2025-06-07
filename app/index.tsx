import { Redirect } from 'expo-router';
console.log('App loaded');

export default function Index() {
	return <Redirect href='/(tabs)/home' />;
}
