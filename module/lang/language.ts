import { create } from "zustand";
import langs from './translates';

export type Language = 'es' | 'en' | 'ja';

export interface ILanguageContext {
    language: Language;
    setLanguage: (language: Language) => void;
    translate: (section: keyof typeof langs, key: keyof typeof langs[typeof section]['ja']) => string;
}

export const useLanguage = create<ILanguageContext>((set, get) => ({
    language: 'es',
    setLanguage: (language: Language) => set(() => ({ language })),
    translate: (section, key,) => {
        const language = get().language;
        return langs[section][language][key] ?? '';
    },
}));