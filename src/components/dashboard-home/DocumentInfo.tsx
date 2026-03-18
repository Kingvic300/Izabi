'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Layers, RotateCcw, BarChart3, Clock, Plus, Eye, Share2, Binary } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

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
        <div className="flex flex-col gap-6">
            <Card className="relative overflow-hidden rounded-[32px] border border-foreground/5 bg-card/30 backdrop-blur-xl shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <Binary size={120} className="text-primary" />
                </div>
                
                <CardHeader className="p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-4">
                       <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                           Active Stream
                       </span>
                    </div>
                    <CardTitle className="text-2xl font-black tracking-tight truncate mb-1">
                        {displayTitle}
                    </CardTitle>
                    <CardDescription className="text-[11px] font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-primary" />
                        Engine Synchronized
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-6 md:px-8 pb-8 space-y-6">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">
                            Source Registry
                        </span>
                        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                            {fileNames.map((name, idx) => (
                                <motion.div 
                                   key={idx} 
                                   initial={{ opacity: 0, x: -10 }}
                                   animate={{ opacity: 1, x: 0 }}
                                   transition={{ delay: idx * 0.1 }}
                                   className="group flex items-center justify-between p-3 rounded-2xl bg-foreground/5 border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <FileText size={16} className="text-primary/60 shrink-0" />
                                        <span className="text-[11px] font-bold truncate opacity-70 group-hover:opacity-100">{name}</span>
                                    </div>
                                    <button 
                                        onClick={() => onPreview(idx)}
                                        className="h-8 w-8 rounded-xl flex items-center justify-center text-primary/40 hover:text-primary hover:bg-primary/10 transition-all"
                                    >
                                        <Eye size={14} />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                        <Button
                            variant="default" 
                            onClick={onAddMore}
                            disabled={fileNames.length >= 5}
                            className="h-12 rounded-2xl bg-foreground text-background hover:bg-primary hover:text-white font-black text-xs gap-3 transition-all uppercase tracking-widest disabled:opacity-40"
                        >
                            <Plus size={16} />
                            Expand Set
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={onReset}
                            className="h-12 rounded-2xl border border-foreground/5 hover:bg-destructive/10 hover:text-destructive font-black text-xs gap-3 transition-all uppercase tracking-widest"
                        >
                            <RotateCcw size={16} />
                            Clear Buffer
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-[32px] border border-foreground/5 bg-card/30 backdrop-blur-xl p-6 space-y-3 group hover:bg-primary/5 transition-all duration-500">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                       <BarChart3 size={20} />
                    </div>
                    <div>
                       <div className="text-[9px] font-black opacity-40 uppercase tracking-widest">
                           Daily Flow
                       </div>
                       <div className="text-2xl font-black text-foreground antialiased italic">
                           +{userStats?.data?.dailyPoints || 0}
                       </div>
                    </div>
                </div>
                <div className="rounded-[32px] border border-foreground/5 bg-card/30 backdrop-blur-xl p-6 space-y-3 group hover:bg-primary/5 transition-all duration-500">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                       <Clock size={20} />
                    </div>
                    <div>
                       <div className="text-[9px] font-black opacity-40 uppercase tracking-widest">
                           Deep Focus
                       </div>
                       <div className="text-2xl font-black text-foreground antialiased italic">
                           {userStats?.data?.totalStudyMinutes || 0}m
                       </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
