import SettingsSection from './SettingsSection';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
        <SettingsSection
            title={t('settings.language_title')}
            description={t('settings.language_desc')}
        >
            <div className="max-w-md space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="settings-language" className="text-sm font-bold">
                        {t('settings.preferred_language')}
                    </Label>
                    {isLanguageSaving && (
                        <span className="text-sm text-muted-foreground" role="status">
                            {t('settings.saving')}
                        </span>
                    )}
                </div>
                <Select
                    value={language}
                    onValueChange={onLanguageChange}
                    disabled={isLanguageSaving}
                >
                    <SelectTrigger id="settings-language" className="h-11">
                        <SelectValue placeholder={t('settings.select_language_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
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
                <p className="text-sm text-muted-foreground">
                    {t('settings.language_footnote')}
                </p>
            </div>
        </SettingsSection>
    );
}
