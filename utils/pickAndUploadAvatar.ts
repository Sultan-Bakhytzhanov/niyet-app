import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { supabase } from '../lib/supabase';
import { Alert } from 'react-native';

/**
 *
 * @param userId
 * @param fetchProfile
 */
export const pickAndUploadAvatar = async (
	userId: string,
	fetchProfile: (id: string) => Promise<void>
) => {
	console.log('[AVATAR] Функция вызвана');

	const result = await ImagePicker.launchImageLibraryAsync({
		mediaTypes: ImagePicker.MediaTypeOptions.Images,
		allowsEditing: true,
		aspect: [1, 1],
		quality: 0.8,
		base64: true,
	});

	console.log('[AVATAR] Результат выбора:', result);

	if (result.canceled || !result.assets?.[0]) {
		console.log('[AVATAR] Выбор отменён');
		return;
	}

	const asset = result.assets[0];
	const fileExt = asset.uri.split('.').pop();
	const filePath = `${userId}.${fileExt}`;
	await supabase.storage.from('profile-pictures').remove([filePath]);
	const { error: uploadError } = await supabase.storage
		.from('profile-pictures')
		.upload(filePath, decode(asset.base64!), {
			contentType: 'image/jpeg',
			upsert: true,
		});

	if (uploadError) {
		console.log('[AVATAR] Ошибка загрузки:', uploadError.message);
		Alert.alert('Ошибка загрузки', uploadError.message);
		return;
	}

	const { data } = supabase.storage
		.from('profile-pictures')
		.getPublicUrl(filePath);
	const publicUrl = data.publicUrl;

	console.log('[AVATAR] Ссылка на файл:', publicUrl);

	const { error: updateError } = await supabase
		.from('profiles')
		.update({ avatar_url: publicUrl })
		.eq('id', userId);

	if (updateError) {
		console.log('[AVATAR UPDATE] Ошибка обновления:', updateError.message);
		Alert.alert('Ошибка обновления профиля', updateError.message);
	} else {
		console.log('[AVATAR UPDATE] Успешно!');
		await fetchProfile(userId);
	}
};
