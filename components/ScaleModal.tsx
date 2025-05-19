import React, { useRef, useEffect, ReactNode } from 'react';
import {
	Modal,
	View,
	Animated,
	StyleSheet,
	TouchableWithoutFeedback,
	KeyboardAvoidingView,
	Platform,
	StyleProp,
	ViewStyle,
} from 'react-native';

type ScaleModalProps = {
	visible: boolean;
	onClose: () => void;
	children: ReactNode;
	overlayColor?: string;
	containerStyle?: StyleProp<ViewStyle>;
	modalStyle?: StyleProp<ViewStyle>;
	closeOnOverlayPress?: boolean;
};

const ScaleModal: React.FC<ScaleModalProps> = ({
	visible,
	onClose,
	children,
	overlayColor = 'rgba(0,0,0,0.2)',
	containerStyle = {},
	modalStyle = {},
	closeOnOverlayPress = true,
}) => {
	const scale = useRef(new Animated.Value(0.7)).current;

	useEffect(() => {
		if (visible) {
			Animated.spring(scale, {
				toValue: 1,
				useNativeDriver: true,
				friction: 10, // Больше = плавнее (обычно 8–20)
				tension: 50,
			}).start();
		} else {
			scale.setValue(0.7);
		}
	}, [visible, scale]);

	return (
		<Modal
			visible={visible}
			transparent
			animationType='none'
			onRequestClose={onClose}
		>
			<KeyboardAvoidingView
				style={[
					styles.overlay,
					{ backgroundColor: overlayColor },
					containerStyle,
				]}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			>
				<TouchableWithoutFeedback
					onPress={closeOnOverlayPress ? onClose : undefined}
				>
					<View style={styles.overlayFill} />
				</TouchableWithoutFeedback>
				<Animated.View
					style={[styles.modal, { transform: [{ scale }] }, modalStyle]}
				>
					{children}
				</Animated.View>
			</KeyboardAvoidingView>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'relative',
	},
	overlayFill: {
		...StyleSheet.absoluteFillObject,
	},
	modal: {
		width: '87%',
		borderRadius: 22,
		paddingVertical: 28,
		paddingHorizontal: 22,
		backgroundColor: 'white',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.16,
		shadowRadius: 9,
		elevation: 8,
		zIndex: 2,
	},
});

export default ScaleModal;
