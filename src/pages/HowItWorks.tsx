'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Upload,
    Zap,
    BookOpen,
    Trophy,
    ArrowRight,
    CheckCircle,
    Binary,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLanguage } from '@/contexts/LanguageContext';

const HowItWorks = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

    useGSAP(
        () => {
            gsap.from('.step-card', {
                opacity: 0,
                x: (i) => (i % 2 === 0 ? -40 : 40),
                duration: 1,
                stagger: 0.2,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: '.steps-container',
                    start: 'top 80%',
                },
            });
        },
        { scope: containerRef },
    );

    const steps = [
        {
            icon: <Upload size={32} />,
            title: t('hiw.ingest_title'),
            description: t('hiw.ingest_desc'),
            details: [
                t('hiw.ingest_d1'),
                t('hiw.ingest_d2'),
                t('hiw.ingest_d3'),
                t('hiw.ingest_d4'),
            ],
            bg: 'bg-primary/10',
            color: 'text-primary',
        },
        {
            icon: <Zap size={32} />,
            title: t('hiw.neural_title'),
            description: t('hiw.neural_desc'),
            details: [
                t('hiw.neural_d1'),
                t('hiw.neural_d2'),
                t('hiw.neural_d3'),
                t('hiw.neural_d4'),
            ],
            bg: 'bg-primary/10',
            color: 'text-primary',
        },
        {
            icon: <BookOpen size={32} />,
            title: t('hiw.synth_title'),
            description: t('hiw.synth_desc'),
            details: [
                t('hiw.synth_d1'),
                t('hiw.synth_d2'),
                t('hiw.synth_d3'),
                t('hiw.synth_d4'),
            ],
            bg: 'bg-primary/10',
            color: 'text-primary',
        },
        {
            icon: <Trophy size={32} />,
            title: t('hiw.mastery_title'),
            description: t('hiw.mastery_desc'),
            details: [
                t('hiw.mastery_d1'),
                t('hiw.mastery_d2'),
                t('hiw.mastery_d3'),
                t('hiw.mastery_d4'),
            ],
            bg: 'bg-primary/10',
            color: 'text-primary',
        },
    ];

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-background relative overflow-hidden"
        >
            <Header />

            {/* Hero */}
            <section className="relative pt-32 sm:pt-40 lg:pt-44 pb-10 sm:pb-14">
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 relative z-10">
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8">
                        <div className="xl:col-span-8 rounded-[28px] sm:rounded-[36px] border border-foreground/10 bg-card/5 p-6 sm:p-10 lg:p-12 text-center xl:text-left">
                            <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 glass rounded-xl border border-foreground/10">
                                <Binary size={14} className="text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                                    {t('hiw.hero_tag')}
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-5 sm:mb-7 leading-[0.95] tracking-tighter">
                                {t('hiw.hero_title')}{' '}
                                <span className="text-primary">
                                    {t('hiw.hero_title_span')}
                                </span>
                            </h1>
                            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto xl:mx-0 font-medium leading-relaxed">
                                {t('hiw.hero_desc')}
                            </p>
                        </div>

                        <div className="xl:col-span-4 rounded-[28px] sm:rounded-[36px] border border-foreground/10 bg-primary/5 p-6 sm:p-8">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 mb-4">
                                Process Overview
                            </p>
                            <ul className="space-y-3">
                                {steps.map((step, i) => (
                                    <li
                                        key={step.title}
                                        className="min-h-11 rounded-xl border border-foreground/10 bg-background/40 px-4 flex items-center gap-3"
                                    >
                                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary text-xs font-black">
                                            {i + 1}
                                        </span>
                                        <span className="text-sm font-semibold text-foreground/80">
                                            {step.title}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Steps Container */}
            <section className="steps-container py-8 sm:py-12 lg:py-16 relative z-10">
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
                        {steps.map((step, i) => (
                            <Card
                                key={i}
                                className="step-card border border-foreground/10 bg-card/5 rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 lg:p-8"
                            >
                                <div className="space-y-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div
                                            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${step.bg} ${step.color} flex items-center justify-center shadow-xl shrink-0`}
                                        >
                                            {step.icon}
                                        </div>
                                        <span className="text-4xl sm:text-5xl font-black text-foreground/10 leading-none">
                                            {i + 1}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                                            {step.title}
                                        </h2>
                                        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-medium leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>

                                    <ul className="space-y-2.5">
                                        {step.details.map((detail, j) => (
                                            <li
                                                key={j}
                                                className="min-h-11 flex items-center gap-3 rounded-xl border border-foreground/10 bg-background/40 px-3 sm:px-4"
                                            >
                                                <CheckCircle
                                                    size={16}
                                                    className="text-primary shrink-0"
                                                />
                                                <span className="text-xs sm:text-sm font-semibold text-foreground/80 leading-snug">
                                                    {detail}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div
                                        className={`w-full h-28 sm:h-36 rounded-2xl border border-foreground/10 bg-background/40 flex items-center justify-center ${step.color} opacity-60`}
                                    >
                                        {step.icon}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Timeline */}
            <section className="py-14 sm:py-20 lg:py-24 bg-card/[0.01] border-y border-foreground/10">
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
                    <h2 className="text-2xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">
                        Typical Flow Time
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                        {[
                            { label: t('hiw.lat_setup'), time: '2 min' },
                            { label: t('hiw.lat_upload'), time: '1 min' },
                            { label: t('hiw.lat_neural'), time: '30 sec' },
                            { label: t('hiw.lat_mastery'), time: 'Instant' },
                        ].map((stat, i) => (
                            <Card
                                key={i}
                                className="border border-foreground/10 bg-card/5 p-4 sm:p-7 text-center rounded-2xl sm:rounded-[28px]"
                            >
                                <div className="text-xl sm:text-3xl font-black text-primary mb-1">
                                    {stat.time}
                                </div>
                                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-50">
                                    {stat.label}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-14 sm:py-20 lg:py-24 relative z-10">
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
                    <div className="text-center bg-primary/5 py-10 sm:py-14 rounded-[24px] sm:rounded-[36px] border border-foreground/10 px-4 sm:px-8">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 leading-tight text-foreground">
                            {t('hiw.cta_title')}
                        </h2>
                        <Link to="/signup">
                            <Button
                                size="lg"
                                className="h-14 sm:h-16 md:h-20 px-8 sm:px-12 rounded-[28px] bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base sm:text-lg md:text-xl shadow-glow group"
                            >
                                <span>{t('hiw.cta_btn')}</span>
                                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default HowItWorks;
