import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

import en from '../locales/en.json';
import ru from '../locales/ru.json';
import kz from '../locales/kz.json';

const i18n = new I18n({
	en,
	ru,
	kz,
});

const locales = Localization.getLocales();
i18n.locale = locales[0]?.languageCode || 'en';
i18n.enableFallback = true;

export default i18n;
export const setLanguage = (lang: 'en' | 'ru' | 'kz') => {
	i18n.locale = lang;
};
