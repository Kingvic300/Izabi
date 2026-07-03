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
        <div className="relative group">
            <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                size={20}
            />
            <Input
                placeholder={t('history.search_placeholder')}
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                className="h-14 pl-12 bg-card/5 border-foreground/10 rounded-2xl focus-visible:ring-primary/20 text-lg shadow-sm"
            />
        </div>
    );
}
