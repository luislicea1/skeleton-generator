"use client"

import { useAppTheme } from '../context/theme-context';
import { useTranslation } from '../context/language-context';

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useAppTheme();
  const t = useTranslation();
  const isDark = theme === 'dark';

  return (
    <label className="relative inline-flex items-center cursor-pointer gap-2">
      
      <input
        type="checkbox"
        checked={isDark}
        onChange={toggleTheme}
        className="sr-only peer"
        role="switch"
        aria-label={isDark ? t.theme.switchToLight : t.theme.switchToDark}
      />
      <div className="w-9 h-5 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 hover:peer-checked:bg-indigo-700" />
    </label>
  );
}