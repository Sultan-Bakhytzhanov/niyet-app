import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Localization from 'expo-localization';
import i18n from '../i18n';

export type Language = 'en' | 'ru' | 'kz';

interface LanguageContextProps {
	language: Language;
	setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextProps>({
	language: 'ru',
	setLanguage: () => {},
});

export const LanguageProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const defaultLang =
		(Localization.getLocales()[0]?.languageCode as Language) || 'ru';
	const [language, setLang] = useState<Language>(defaultLang);

	useEffect(() => {
		i18n.locale = language;
	}, [language]);

	const setLanguage = (lang: Language) => {
		setLang(lang);
		i18n.locale = lang;
	};

	return (
		<LanguageContext.Provider value={{ language, setLanguage }}>
			{children}
		</LanguageContext.Provider>
	);
};

export const useLanguage = () => useContext(LanguageContext);
