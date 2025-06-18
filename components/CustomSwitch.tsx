import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
	useSharedValue,
	withTiming,
	useAnimatedStyle,
} from 'react-native-reanimated';

interface Props {
	value: boolean;
	onToggle: () => void;
}

export default function CustomSwitch({ value, onToggle }: Props) {
	const offset = useSharedValue(value ? 1 : 0);

	React.useEffect(() => {
		offset.value = withTiming(value ? 1 : 0, { duration: 200 });
	}, [value]);

	const animatedThumbStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: offset.value * 16 }],
	}));

	return (
		<TouchableOpacity
			onPress={onToggle}
			style={[
				styles.switch,
				{ backgroundColor: value ? '#00C853' : '#767577' },
			]}
			activeOpacity={0.8}
		>
			<Animated.View style={[styles.thumb, animatedThumbStyle]} />
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	switch: {
		width: 40,
		height: 24,
		borderRadius: 14,
		padding: 2,
		justifyContent: 'center',
	},
	thumb: {
		width: 20,
		height: 20,
		borderRadius: 12,
		backgroundColor: '#fff',
	},
});
