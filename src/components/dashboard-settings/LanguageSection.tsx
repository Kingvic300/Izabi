import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { languageOptions } from './settingsConstants';
import { useLanguage } from '@/contexts/LanguageContext';

type LanguageSectionProps = {
    language: string;
    isLanguageSaving: boolean;
    onLanguageChange: (value: string) => void;
};

export default function LanguageSection({
    language,
    isLanguageSaving,
    onLanguageChange,
}: LanguageSectionProps) {
    const { t } = useLanguage();
    return (
        <Card className="settings-card glass border-foreground/5 rounded-2xl shadow-2xl overflow-hidden">
            <CardHeader className="px-6 py-4 md:px-8 md:py-6 border-b border-foreground/5">
                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                    <Globe className="text-primary" />
                    {t('settings.language_title')}
                </CardTitle>
                <CardDescription>
                    {t('settings.language_desc')}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold uppercase tracking-wide">
                            {t('settings.preferred_language')}
                        </Label>
                        {isLanguageSaving && (
                            <Badge
                                variant="outline"
                                className="border-primary/50 text-primary bg-primary/10"
                            >
                                {t('settings.saving')}
                            </Badge>
                        )}
                    </div>
                    <Select
                        value={language}
                        onValueChange={onLanguageChange}
                        disabled={isLanguageSaving}
                    >
                        <SelectTrigger className="h-12 rounded-2xl border-foreground/10 bg-foreground/5">
                            <SelectValue placeholder={t('settings.select_language_placeholder')} />
                        </SelectTrigger>
                        <SelectContent className="glass border-foreground/10">
                            {languageOptions.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className="cursor-pointer"
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                        {t('settings.language_footnote')}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
