import { en } from './en';
import { pidgin } from './pidgin';
import { igbo } from './igbo';
import { yoruba } from './yoruba';
import { hausa } from './hausa';

export type Language = 'en' | 'pidgin' | 'igbo' | 'yoruba' | 'hausa';

export const translations: Record<Language, Record<string, string>> = {
    en,
    pidgin,
    igbo,
    yoruba,
    hausa,
};
