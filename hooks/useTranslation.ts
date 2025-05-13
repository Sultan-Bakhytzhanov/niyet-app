import { useLanguage } from '@/providers/LanguageProvider';
import i18n from '@/i18n';

export const useTranslation = () => {
	const { language } = useLanguage();

	return {
		t: i18n.t,
	};
};
