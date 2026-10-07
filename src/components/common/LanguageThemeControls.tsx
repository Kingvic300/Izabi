import React, { useState, useRef, useEffect } from 'react';
import { Globe, Moon, Sun, ChevronDown, Check } from 'lucide-react';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { useTheme } from '@/components/theme-provider';

// Matches the languages actually supported by Izabi's LanguageContext/translations.
const SUPPORTED_LANGUAGES: Array<{ code: Language; name: string; nativeName: string; flag: string }> = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'pidgin', name: 'Pidgin', nativeName: 'Naija Pidgin', flag: '🇳🇬' },
    { code: 'yoruba', name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬' },
    { code: 'hausa', name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬' },
    { code: 'igbo', name: 'Igbo', nativeName: 'Igbo', flag: '🇳🇬' },
];

interface LanguageThemeControlsProps {
    className?: string;
}

export const LanguageThemeControls: React.FC<LanguageThemeControlsProps> = ({ className = '' }) => {
    const { language, setLanguage } = useLanguage();
    const { theme, setTheme } = useTheme();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentOption =
        SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
    const isLight = theme === 'light';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleTheme = () => setTheme(isLight ? 'dark' : 'light');

    return (
        <div className={`flex items-center gap-2 sm:gap-2.5 ${className}`}>
            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer font-medium text-xs sm:text-sm text-foreground/80 hover:text-foreground hover:bg-muted/50 border border-transparent hover:border-border"
                    aria-expanded={dropdownOpen}
                    aria-label="Select Language"
                >
                    <Globe className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-semibold tracking-tight">{currentOption.name}</span>
                    <ChevronDown
                        className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${
                            dropdownOpen ? 'rotate-180 text-primary' : ''
                        }`}
                    />
                </button>

                {dropdownOpen && (
                    <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-64 rounded-2xl p-1.5 shadow-float z-50 border bg-card border-border text-foreground">
                        <div className="px-3 py-2 border-b border-border mb-1">
                            <span className="text-[11px] font-bold text-muted-foreground block">
                                Select Language
                            </span>
                        </div>

                        <div className="space-y-0.5">
                            {SUPPORTED_LANGUAGES.map((lang) => {
                                const isSelected = lang.code === language;
                                return (
                                    <button
                                        key={lang.code}
                                        type="button"
                                        onClick={() => {
                                            setLanguage(lang.code);
                                            setDropdownOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer text-xs ${
                                            isSelected
                                                ? 'bg-primary/15 text-primary font-bold'
                                                : 'hover:bg-muted/60 text-foreground/80'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-sm">{lang.flag}</span>
                                            <span className="font-semibold block leading-tight">
                                                {lang.nativeName}
                                            </span>
                                        </div>
                                        {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center text-foreground/80 hover:text-foreground hover:bg-muted/50 border border-transparent hover:border-border"
                aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
                title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
            >
                {isLight ? (
                    <Sun className="w-4 h-4 text-urgent transition-transform hover:rotate-45" />
                ) : (
                    <Moon className="w-4 h-4 text-foreground/80 hover:text-foreground transition-transform hover:-rotate-12" />
                )}
            </button>
        </div>
    );
};

export default LanguageThemeControls;
