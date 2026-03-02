'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Layers, RotateCcw, BarChart3, Clock, Plus, Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DocumentInfoProps {
    fileNames: string[];
    userStats: any;
    onReset: () => void;
    onAddMore: () => void;
    onPreview: (index: number) => void;
}

export const DocumentInfo = ({ fileNames, userStats, onReset, onAddMore, onPreview }: DocumentInfoProps) => {
    const { t } = useLanguage();
    
    const displayTitle = fileNames.length > 1 
        ? `${fileNames.length} Documents`
        : fileNames[0] || 'Untitled Document';

    return (
        <div className="flex flex-col gap-4">
            <Card className="glass border-primary/20 rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                    <FileText size={100} />
                </div>
                <CardHeader className="p-4 sm:p-6 md:p-8">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                        <div className="p-1.5 sm:p-2 rounded-xl bg-primary/20 text-primary">
                            <Layers size={14} className="sm:w-4 sm:h-4" />
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest opacity-40">
                            {fileNames.length > 1 ? 'Active Study Set' : 'Current Document'}
                        </span>
                    </div>
                    <CardTitle className="text-xl sm:text-2xl font-bold truncate leading-tight mb-1" title={fileNames.join(', ')}>
                        {displayTitle}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 font-bold text-primary text-[10px] sm:text-xs">
                        <span className="animate-pulse">✨</span>
                        ANALYSIS READY
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-card/5 border border-foreground/5">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Layers size={16} className="text-primary/60" />
                            <span className="text-[10px] sm:text-xs font-bold opacity-60 uppercase tracking-wider">
                                System State
                            </span>
                        </div>
                        <div className="px-2 sm:px-3 py-1 rounded-full bg-primary/10 text-primary text-[9px] sm:text-[10px] font-bold tracking-widest uppercase border border-primary/20">
                            Synced
                        </div>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2 max-h-[140px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                        <div className="text-[8px] font-bold uppercase tracking-[0.2em] opacity-30 mb-1 ml-1">
                            Source Documents
                        </div>
                        {fileNames.map((name, idx) => (
                            <div key={idx} className="group flex items-center justify-between p-2 rounded-lg sm:rounded-xl bg-card/5 border border-foreground/5 text-[9px] sm:text-[10px] font-bold transition-all hover:border-primary/20">
                                <span className="truncate flex-1 pr-2 opacity-60 group-hover:opacity-100 transition-all">{name}</span>
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg hover:bg-primary/20 text-primary shrink-0 transition-colors"
                                    onClick={() => onPreview(idx)}
                                    title="View Source"
                                >
                                    <Eye size={12} />
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-1">
                        <Button
                            variant="default" 
                            onClick={onAddMore}
                            disabled={fileNames.length >= 5}
                            className="h-10 sm:h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-[10px] sm:text-xs gap-2 transition-all shadow-lg shadow-primary/20 active:scale-95 uppercase tracking-widest disabled:opacity-40"
                        >
                            <Plus size={14} />
                            Add More
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={onReset}
                            className="h-10 sm:h-11 rounded-xl border border-foreground/5 hover:bg-destructive/10 hover:text-destructive font-bold text-[10px] sm:text-xs gap-2 transition-all active:scale-95 uppercase tracking-widest"
                        >
                            <RotateCcw size={14} />
                            Reset Node
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <Card className="glass border-foreground/5 p-6 rounded-[28px] group hover:bg-primary/5 transition-all">
                    <BarChart3 size={20} className="text-primary mb-3 group-hover:scale-110 transition-transform" />
                    <div className="text-[9px] font-bold opacity-40 uppercase tracking-widest">
                        {t('dashboard.stats_eff')}
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                        +{userStats?.data?.dailyPoints || 0}
                    </div>
                </Card>
                <Card className="glass border-foreground/5 p-6 rounded-[28px] group hover:bg-primary/5 transition-all">
                    <Clock size={20} className="text-primary mb-3 group-hover:scale-110 transition-transform" />
                    <div className="text-[9px] font-bold opacity-40 uppercase tracking-widest">
                        {t('dashboard.stats_time')}
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                        {userStats?.data?.totalStudyMinutes || 0}m
                    </div>
                </Card>
            </div>
        </div>
    );
};