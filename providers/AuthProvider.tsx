import { createContext, useContext, useEffect, useState } from 'react';
import React from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { Alert } from 'react-native';
import { router } from 'expo-router';

interface Profile {
	id: string;
	email: string;
	username: string;
	lang?: string;
	progress?: any;
	avatar_url?: string;
}

interface AuthContextType {
	session: Session | null;
	user: User | null;
	profile: Profile | null;
	loading: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (email: string, password: string, fullName: string) => Promise<void>;
	signOut: () => Promise<void>;
	fetchProfile: (userId: string) => Promise<void>;
}

const AuthContext = createContext<
	| (AuthContextType & { fetchProfile: (id: string) => Promise<void> })
	| undefined
>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [session, setSession] = useState<Session | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchProfile = async (userId: string) => {
		const { data, error } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', userId)
			.single();

		if (error) {
			console.error('Ошибка загрузки профиля:', error);
			setProfile(null);
		} else {
			setProfile(data);
		}
	};

	useEffect(() => {
		const getSession = async () => {
			const { data, error } = await supabase.auth.getSession();
			if (error) console.error(error);
			setSession(data.session);
			setUser(data.session?.user ?? null);
			if (data.session?.user) await fetchProfile(data.session.user.id);
			setLoading(false);
		};

		getSession();

		const { data: listener } = supabase.auth.onAuthStateChange(
			async (event, session) => {
				setSession(session);
				setUser(session?.user ?? null);

				if (event === 'SIGNED_OUT') {
					setProfile(null);
					router.replace('/(auth)/login');
				} else if (event === 'SIGNED_IN' && session?.user) {
					const { data: existingProfile, error: selectError } = await supabase
						.from('profiles')
						.select('id')
						.eq('id', session.user.id)
						.single();

					if (!existingProfile) {
						const { error: insertError } = await supabase
							.from('profiles')
							.insert([
								{
									id: session.user.id,
									email: session.user.email,
									username: session.user.user_metadata?.username || 'Без имени',
								},
							]);

						if (insertError) {
							console.error('Ошибка вставки профиля:', insertError.message);
						}
					}

					await fetchProfile(session.user.id);
					router.replace('/');
				}
			}
		);

		return () => {
			listener.subscription.unsubscribe();
		};
	}, []);

	const signIn = async (email: string, password: string) => {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) Alert.alert('Ошибка входа', error.message);
	};

	const signUp = async (email: string, password: string, fullName: string) => {
		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: { username: fullName },
			},
		});
		if (error) {
			Alert.alert('Ошибка регистрации', error.message);
		}
	};

	const signOut = async () => {
		await supabase.auth.signOut();
	};

	return (
		<AuthContext.Provider
			value={{
				session,
				user,
				profile,
				loading,
				signIn,
				signUp,
				signOut,
				fetchProfile,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error('useAuth must be used within an AuthProvider');
	return context;
};
