"use client"

import { useAppTheme } from '../context/theme-context';
import { useTranslation } from '../context/language-context';

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useAppTheme();
  const t = useTranslation();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative w-9 h-5 rounded-full transition-colors duration-300 cursor-pointer"
      style={{ backgroundColor: isDark ? '#4f46e5' : '#e5e7eb' }}
      aria-label={isDark ? t.theme.switchToLight : t.theme.switchToDark}
    >
      <span
        className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300"
        style={{ transform: isDark ? 'translateX(100%)' : 'translateX(0)' }}
      />
    </button>
  );
}