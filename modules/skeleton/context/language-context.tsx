"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { locales, type Language, type Translations } from '../i18n';

interface LanguageContextValue {
  language: Language;
  setLanguage: (l: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'es',
  setLanguage: () => {},
  t: locales.es,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    const stored = localStorage.getItem('app-language') as Language | null;
    if (stored === 'es' || stored === 'en') {
      setLanguageState(stored);
    } else {
      // Auto-detect from browser
      const detected: Language = navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
      setLanguageState(detected);
    }
  }, []);

  function setLanguage(l: Language) {
    setLanguageState(l);
    localStorage.setItem('app-language', l);
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: locales[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
export const useTranslation = () => useContext(LanguageContext).t;
