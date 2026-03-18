'use client';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cpu, Upload, CheckCircle2, Sparkles, ShieldCheck, Database, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import PDFUploadSection from '@/components/pdf/PDFUploadSection';
import { motion } from 'framer-motion';

interface UploadPromptProps {
    onSelectionComplete: (data: any) => void;
    onReadyToLearn: () => void;
}

export const UploadPrompt = ({ onSelectionComplete, onReadyToLearn }: UploadPromptProps) => {
    const { t } = useLanguage();

    return (
        <Card
            id="upload-section"
            className="relative overflow-hidden rounded-[32px] border border-foreground/5 bg-card/30 backdrop-blur-xl shadow-2xl transition-all duration-500"
        >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <Database size={160} className="text-primary" />
            </div>

            <CardHeader className="p-8 md:p-12 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary/10 text-primary px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] border border-primary/20"
                    >
                        <Zap size={14} fill="currentColor" />
                        Intake Portal
                    </motion.div>
                    <div className="inline-flex items-center gap-2 rounded-xl bg-foreground/5 text-muted-foreground/60 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] border border-foreground/10">
                        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                        Secure Layer
                    </div>
                </div>

                <div className="space-y-4">
                    <CardTitle className="text-4xl md:text-6xl font-black tracking-tight leading-none italic">
                        Knowledge <span className="text-primary not-italic">Ingestion</span>
                    </CardTitle>
                    <CardDescription className="text-lg md:text-xl font-medium text-muted-foreground max-w-2xl leading-relaxed opacity-70">
                        {t('dashboard.upload_desc') ||
                            'Connect your documents to the Auralis Engine for real-time neural synthesis and adaptive study material generation.'}
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="px-8 md:px-12 pb-12">
                <div className="rounded-[32px] border border-foreground/5 bg-background/40 backdrop-blur-md p-2 shadow-inner group">
                    <div className="p-6 md:p-8 space-y-8">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">
                                    Phase 01
                                </span>
                                <h3 className="text-xl font-black tracking-tight">
                                    Source Registration
                                </h3>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onReadyToLearn}
                                className="h-12 rounded-2xl border-foreground/10 bg-card/40 px-6 text-[11px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300"
                            >
                                <Upload size={16} />
                                <span>System Files</span>
                            </Button>
                        </div>

                        <div className="relative">
                            <PDFUploadSection
                                onSelectionComplete={onSelectionComplete}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export const UploadSidebar = ({ onReadyToLearn }: { onReadyToLearn: () => void }) => {
    const { t } = useLanguage();

    return (
        <Card className="relative overflow-hidden rounded-[32px] border border-foreground/5 bg-card/30 backdrop-blur-xl p-8 md:p-12 flex flex-col items-center text-center space-y-10 shadow-2xl">
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <div className="relative w-24 h-24 rounded-[32px] bg-primary/10 flex items-center justify-center border border-primary/20 shadow-2xl rotate-3 group hover:rotate-0 transition-all duration-500">
                    <Cpu size={48} className="text-primary animate-float" />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-3xl font-black tracking-tight uppercase italic">
                    Fast <span className="text-primary not-italic">Sync</span>
                </h3>
                <p className="text-base font-medium text-muted-foreground leading-relaxed max-w-[280px] opacity-70">
                    {t('dashboard.init_desc') ||
                        'Register a source document to activate the neural synthesis engine.'}
                </p>
            </div>

            <div className="w-full space-y-3">
                {[
                    'Neural Source Analysis',
                    'Custom Study Parameterization',
                    'Real-time Result Compilation',
                ].map((item, i) => (
                    <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-4 rounded-2xl bg-foreground/5 px-4 py-3 border border-foreground/5 text-left group hover:bg-primary/5 transition-all duration-300"
                    >
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-[11px] font-bold opacity-70 group-hover:opacity-100">{item}</span>
                    </motion.div>
                ))}
            </div>

            <div className="w-full pt-4">
                <Button
                    type="button"
                    variant="default"
                    onClick={onReadyToLearn}
                    className="w-full h-14 rounded-2xl bg-foreground text-background hover:bg-primary hover:text-white font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-xl shadow-black/10 hover:shadow-primary/20"
                >
                    <Upload size={18} />
                    <span>Activate Link</span>
                </Button>
            </div>
        </Card>
    );
};
