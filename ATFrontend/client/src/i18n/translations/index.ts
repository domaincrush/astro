import { en } from './en';
import { hi } from './hi';
import { ta } from './ta';
import { te } from './te';

export const translations = {
  en,
  hi,
  ta,
  te
};

export type SupportedLanguage = keyof typeof translations;