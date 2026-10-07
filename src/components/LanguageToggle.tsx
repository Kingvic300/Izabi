import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, Languages } from 'lucide-react';
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
    { code: 'yoruba', label: 'Yorùbá' },
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
                    className="h-9 gap-1.5 px-2.5 font-normal text-muted-foreground hover:text-foreground"
                >
                    <Languages size={16} />
                    <span className="text-sm">{currentLabel}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[10rem]">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => {
                            setLanguage(lang.code).catch(() => {});
                        }}
                        className="cursor-pointer justify-between"
                    >
                        {lang.label}
                        {language === lang.code && (
                            <Check className="h-4 w-4" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
