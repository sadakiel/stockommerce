import { useState, useEffect } from 'react';
import { translations, Translation } from '../types/settings';

export function useTranslation() {
  const [language, setLanguage] = useState<'es' | 'en'>('es');

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language] || translation.es || key;
  };

  const changeLanguage = (newLanguage: 'es' | 'en') => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'es' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  return { t, language, changeLanguage };
}