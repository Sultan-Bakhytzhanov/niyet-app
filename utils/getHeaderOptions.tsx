import { Image } from 'react-native';

export function getDefaultHeaderOptions(
	colorScheme: 'light' | 'dark',
	withLogo = true
) {
	return {
		headerStyle: {
			backgroundColor: colorScheme === 'dark' ? '#121212' : '#ffffff',
			borderBottomColor: colorScheme === 'dark' ? '#333333' : '#e0e0e0',
			borderBottomWidth: 1,
		},
		headerTitle: '',
		headerLeft: withLogo
			? () => (
					<Image
						source={require('@/assets/images/logo.png')}
						style={{
							width: 32,
							height: 32,
							resizeMode: 'contain',
							marginLeft: 12,
						}}
					/>
			  )
			: undefined,
		headerTitleStyle: {
			color: colorScheme === 'dark' ? '#ffffff' : '#000000',
		},
		headerTintColor: '#00C853',
	};
}
