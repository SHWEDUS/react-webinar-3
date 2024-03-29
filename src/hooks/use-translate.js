import { useEffect, useMemo, useState } from 'react'
import useServices from './use-services'

/**
 * Хук возвращает функцию для локализации текстов, код языка и функцию его смены
 */
export default function useTranslate() {
  const service = useServices().i18n;

  const [language, setLanguage] = useState(service.lang);

  const handleChangeLang = (language) => {
    setLanguage(language);
  };

  const i18n = useMemo(() => ({
    language: service.lang,
    setLanguage: (lang) => service.setLanguage(lang),
    t: (text, number) => service.translate(language, text, number)
  }), [language]);

  useEffect(() => {
    const unsubscribe = service.subscribe(handleChangeLang);
    return () => {
      unsubscribe();
    };
  }, [service]);

  return i18n;
}
