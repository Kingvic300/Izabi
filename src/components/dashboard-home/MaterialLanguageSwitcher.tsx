import { Loader2, Languages } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { languageOptions } from '@/components/dashboard-settings/settingsConstants';
import { useContentLanguage } from '@/hooks/useContentLanguage';

/**
 * Small language picker meant to live right next to already-generated
 * study material (flashcards/quiz/summary). Lets a student preview a
 * translation without leaving the page or opening full settings.
 *
 * Reuses the same on-demand-translate-and-cache flow as the settings
 * page toggle (via useContentLanguage), so the first switch to a given
 * language calls the backend and every switch after that is served from
 * the backend's cache.
 */
export const MaterialLanguageSwitcher = () => {
    const { language, isChanging, changeLanguage } = useContentLanguage();

    return (
        <div className="flex items-center gap-2 bg-foreground/5 border border-foreground/5 rounded-2xl px-3 py-2">
            <div className="h-8 w-8 shrink-0 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                {isChanging ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <Languages size={16} />
                )}
            </div>
            <div className="min-w-0">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                    View in
                </div>
                <Select
                    value={language}
                    onValueChange={(value) => {
                        changeLanguage(value).catch(() => {
                            // useContentLanguage already reverts the
                            // toggle and surfaces a toast on failure.
                        });
                    }}
                    disabled={isChanging}
                >
                    <SelectTrigger className="h-7 border-none bg-transparent px-0 shadow-none text-xs font-bold focus:ring-0">
                        <SelectValue placeholder="Language" />
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
            </div>
        </div>
    );
};
