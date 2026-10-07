import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';

type HistorySearchBarProps = {
    searchQuery: string;
    onSearchChange: (value: string) => void;
};

export default function HistorySearchBar({
    searchQuery,
    onSearchChange,
}: HistorySearchBarProps) {
    const { t } = useLanguage();
    return (
        <div className="relative">
            <Search
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
            />
            <Input
                placeholder={t('history.search_placeholder')}
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                aria-label={t('history.search_placeholder')}
                className="h-11 pl-10 text-base"
            />
        </div>
    );
}
