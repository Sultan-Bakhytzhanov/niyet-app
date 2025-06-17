import { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	Button,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../providers/AuthProvider';
import { Feather } from '@expo/vector-icons';

export default function LoginScreen() {
	const { signIn, signUp } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [fullName, setFullName] = useState('');
	const [isSignUp, setIsSignUp] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleSubmit = () => {
		if (isSignUp) {
			if (!fullName || !email || !password || !confirmPassword) return;
			if (password !== confirmPassword) {
				alert('Пароли не совпадают');
				return;
			}
			signUp(email, password, fullName);
		} else {
			if (!email || !password) return;
			signIn(email, password);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{isSignUp ? 'Регистрация' : 'Вход'}</Text>

			{isSignUp && (
				<TextInput
					style={styles.input}
					placeholder='Имя'
					value={fullName}
					onChangeText={setFullName}
				/>
			)}

			<TextInput
				style={styles.input}
				placeholder='Email'
				value={email}
				onChangeText={setEmail}
				autoCapitalize='none'
			/>

			<View style={styles.passwordContainer}>
				<TextInput
					style={styles.passwordInput}
					placeholder='Пароль'
					value={password}
					onChangeText={setPassword}
					secureTextEntry={!showPassword}
				/>
				<TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
					<Feather
						name={showPassword ? 'eye-off' : 'eye'}
						size={20}
						color='#007AFF'
						style={styles.icon}
					/>
				</TouchableOpacity>
			</View>

			{isSignUp && (
				<View style={styles.passwordContainer}>
					<TextInput
						style={styles.passwordInput}
						placeholder='Подтвердите пароль'
						value={confirmPassword}
						onChangeText={setConfirmPassword}
						secureTextEntry={!showConfirmPassword}
					/>
					<TouchableOpacity
						onPress={() => setShowConfirmPassword(!showConfirmPassword)}
					>
						<Feather
							name={showConfirmPassword ? 'eye-off' : 'eye'}
							size={20}
							color='#007AFF'
							style={styles.icon}
						/>
					</TouchableOpacity>
				</View>
			)}

			<Button
				title={isSignUp ? 'Создать аккаунт' : 'Войти'}
				onPress={handleSubmit}
			/>

			<Text style={styles.switchMode} onPress={() => setIsSignUp(!isSignUp)}>
				{isSignUp
					? 'Уже есть аккаунт? Войти'
					: 'Нет аккаунта? Зарегистрироваться'}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, justifyContent: 'center' },
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
		textAlign: 'center',
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 6,
		padding: 10,
		marginBottom: 10,
	},
	icon: {
		paddingHorizontal: 10,
	},
	passwordContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 6,
		marginBottom: 10,
	},
	passwordInput: {
		flex: 1,
		padding: 10,
	},
	toggle: {
		color: '#007AFF',
		paddingHorizontal: 10,
		fontWeight: 'bold',
	},
	switchMode: {
		marginTop: 15,
		color: '#007AFF',
		textAlign: 'center',
	},
});
