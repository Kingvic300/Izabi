import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = [
    { code: 'en', label: 'English' },
    { code: 'pidgin', label: 'Pidgin' },
    { code: 'igbo', label: 'Igbo' },
    { code: 'yoruba', label: 'Yoruba' },
    { code: 'hausa', label: 'Hausa' },
] as const;

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    const currentLabel =
        languages.find((l) => l.code === language)?.label || 'English';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-2.5 gap-1.5"
                >
                    <Globe size={16} />
                    <span className="text-sm hidden xl:inline">
                        {currentLabel}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
               
            >
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => {
                            setLanguage(lang.code).catch(() => {});
                        }}
                        className={`font-medium cursor-pointer ${
                            language === lang.code
                                ? 'bg-primary/10 text-primary'
                                : ''
                        }`}
                    >
                        {lang.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
