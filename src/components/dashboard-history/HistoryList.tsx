import { AnimatePresence, motion } from 'framer-motion';
import {
    Brain,
    ChevronRight,
    Clock,
    FileText,
    MessageSquare,
    Search,
    Trophy,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

type HistoryListProps = {
    items: any[];
    onSelect: (item: any) => void;
};

const getIcon = (type: string) => {
    switch (type) {
        case 'generation':
            return <Brain className="text-purple-400" />;
        case 'quiz':
            return <Trophy className="text-yellow-400" />;
        case 'note':
            return <FileText className="text-blue-400" />;
        case 'chat':
            return <MessageSquare className="text-green-400" />;
        default:
            return <Clock />;
    }
};

export default function HistoryList({ items, onSelect }: HistoryListProps) {
    const { t } = useLanguage();
    return (
        <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card
                            onClick={() => onSelect(item)}
                            className="group glass border-foreground/5 hover:border-primary/20 transition-all cursor-pointer overflow-hidden relative"
                        >
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-all" />

                            <CardContent className="p-4 sm:p-5 flex items-center gap-4 sm:gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                                    {getIcon(item.hType)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-bold text-lg truncate uppercase tracking-tight">
                                            {item.title}
                                        </h3>
                                        <Badge
                                            variant="outline"
                                            className="text-[10px] font-black uppercase opacity-60"
                                        >
                                            {item.hType === 'generation'
                                                ? t('history.ai_material')
                                                : item.hType}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs font-bold opacity-40 uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5">
                                            <Clock size={12} />{' '}
                                            {new Date(
                                                item.hDate,
                                            ).toLocaleDateString()}
                                        </span>
                                        {item.hType === 'generation' && (
                                            <span>
                                                {item.questions?.length || 0}{' '}
                                                {t('history.questions_suffix')}
                                            </span>
                                        )}
                                        {item.hType === 'note' && (
                                            <span>
                                                {item.content?.length || 0}{' '}
                                                {t('history.chars_suffix')}
                                            </span>
                                        )}
                                        {item.hType === 'quiz' && (
                                            <span>
                                                {item.correctAnswers}/
                                                {item.totalQuestions} {t('history.correct_suffix')}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {item.score !== undefined && (
                                    <div className="px-3 sm:px-6 py-2 rounded-2xl bg-primary/5 border border-primary/10 text-center">
                                        <div className="text-xl font-black text-primary">
                                            {Math.round(item.score)}%
                                        </div>
                                        <div className="text-[10px] uppercase font-black opacity-40">
                                            {t('history.score_label')}
                                        </div>
                                    </div>
                                )}

                                <div className="w-10 h-10 rounded-full border border-foreground/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 bg-card/50">
                                    <ChevronRight size={18} />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </AnimatePresence>

            {items.length === 0 && (
                <div className="text-center py-20 bg-card/5 rounded-[32px] border-2 border-dashed border-foreground/5">
                    <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="text-muted-foreground" size={32} />
                    </div>
                    <h3 className="text-xl font-bold">{t('history.no_items_found')}</h3>
                    <p className="text-muted-foreground">
                        {t('history.adjust_filters')}
                    </p>
                </div>
            )}
        </div>
    );
}
