"use client"

import { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useLanguage } from '../context/language-context';
import type { Language } from '../i18n';

const LANGS: { code: Language; flag: string; label: string }[] = [
  { code: 'es', flag: '🇪🇸', label: 'Español' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const current = LANGS.find(l => l.code === language)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer
          bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700
          text-gray-600 dark:text-gray-300
          hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
      >
        <Icon icon="lucide:globe" className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
        <span>{current.flag}</span>
        <span className="uppercase tracking-wide">{current.code}</span>
        <Icon
          icon="lucide:chevron-down"
          className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-1.5 w-36 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg shadow-black/10 dark:shadow-black/30 overflow-hidden z-20"
        >
          {LANGS.map(lang => (
            <button
              key={lang.code}
              role="option"
              aria-selected={language === lang.code}
              onClick={() => { setLanguage(lang.code); setOpen(false); }}
              className={[
                'w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left cursor-pointer',
                language === lang.code
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60',
              ].join(' ')}
            >
              <span className="text-base leading-none">{lang.flag}</span>
              <span className="font-medium">{lang.label}</span>
              {language === lang.code && (
                <Icon icon="lucide:check" className="w-3.5 h-3.5 ml-auto text-indigo-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
