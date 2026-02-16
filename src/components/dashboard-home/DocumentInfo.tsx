'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Layers, RotateCcw, BarChart3, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DocumentInfoProps {
    fileName: string;
    userStats: any;
    onReset: () => void;
}

export const DocumentInfo = ({ fileName, userStats, onReset }: DocumentInfoProps) => {
    const { t } = useLanguage();

    return (
        <>
            <Card className="glass border-primary/20 rounded-[32px] overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                    <FileText size={100} />
                </div>
                <CardHeader className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-xl bg-primary/20 text-primary">
                            <FileText size={16} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                            Current Document
                        </span>
                    </div>
                    <CardTitle className="text-2xl font-bold truncate leading-tight">
                        {fileName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 font-bold text-primary">
                        <span>✨</span>
                        Ready to study
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8 space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-card/5 border border-foreground/5">
                        <div className="flex items-center gap-3">
                            <Layers size={18} className="text-primary/60" />
                            <span className="text-xs font-bold opacity-60">
                                Status
                            </span>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase">
                            Active
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={onReset}
                        className="w-full h-12 rounded-2xl border border-foreground/5 hover:bg-destructive/10 hover:text-destructive font-bold text-xs gap-2 transition-all"
                    >
                        <RotateCcw size={14} />
                        Change document
                    </Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
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
        </>
    );
};