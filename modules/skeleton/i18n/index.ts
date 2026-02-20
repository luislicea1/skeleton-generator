export type { Language, Translations } from './types';
import es from './es';
import en from './en';
import type { Language, Translations } from './types';

export const locales: Record<Language, Translations> = { es, en };
