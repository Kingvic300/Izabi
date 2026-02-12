'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Brain,
    FileText,
    Mic,
    Users,
    Zap,
    Globe,
    BarChart3,
    Lock,
    Smartphone,
    ArrowRight,
    Trophy,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Features = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            gsap.from('.feature-card', {
                opacity: 0,
                y: 30,
                stagger: 0.05,
                duration: 0.8,
                ease: 'expo.out',
            });
        },
        { scope: containerRef },
    );

    const features = [
        {
            icon: <FileText size={32} />,
            title: 'Neural Ingestion',
            description:
                'Advanced OCR and semantic analysis turns any PDF into a structured knowledge node.',
            benefits: [
                'Sub-second processing',
                'Image text extraction',
                'Contextual understanding',
            ],
            bg: 'bg-primary/10',
            color: 'text-primary',
        },
        {
            icon: <Brain size={32} />,
            title: 'Concept Synthesis',
            description:
                "Izabi doesn't just summarize; it synthesizes key relationships between topics for a 360 view.",
            benefits: [
                'Multi-document linking',
                'Key term extraction',
                'Flash card generation',
            ],
            bg: 'bg-primary/10',
            color: 'text-primary',
        },
        {
            icon: <Zap size={32} />,
            title: 'Adaptive Testing',
            description:
                'Quizzes that adjust difficulty based on your performance to bridge knowledge gaps.',
            benefits: [
                'Dynamic difficulty',
                'Spaced repetition',
                'Weakness targeting',
            ],
            bg: 'bg-primary/10',
            color: 'text-primary',
        },
        {
            icon: <Users size={32} />,
            title: 'Scholar Duels',
            description:
                'Competitive real-time multiplayer environments to test who mastered the material first.',
            benefits: [
                'Group leaderboards',
                'Achievement badges',
                'Live tournaments',
            ],
            bg: 'bg-primary/10',
            color: 'text-primary',
        },
        {
            icon: <Mic size={32} />,
            title: 'Sonic Lexicon',
            description:
                'High-fidelity AI voices that read your notes with natural inflection, even in local dialects.',
            benefits: [
                'Pidgin support',
                'Variable speeds',
                'Focus background music',
            ],
            bg: 'bg-primary/10',
            color: 'text-primary',
        },
        {
            icon: <Globe size={32} />,
            title: 'Localized Intelligence',
            description:
                'Switch seamlessly between Academic English and colloquial Pidgin for deeper clarity.',
            benefits: [
                'Instant translation',
                'Dialectal context',
                'Pidgin AI assistant',
            ],
            bg: 'bg-primary/10',
            color: 'text-primary',
        },
        {
            icon: <BarChart3 size={32} />,
            title: 'Success Analytics',
            description:
                'Pinpoint exactly when you are ready for the exam based on your interaction patterns.',
            benefits: [
                'Readiness score',
                'Time tracking',
                'Milestone prediction',
            ],
            bg: 'bg-primary/10',
            color: 'text-primary',
        },
        {
            icon: <Lock size={32} />,
            title: 'Vault Security',
            description:
                'Your intellectual property is protected by military-grade encryption systems.',
            benefits: [
                'Data sovereignty',
                'E2EE systems',
                'No training on your data',
            ],
            bg: 'bg-primary/10',
            color: 'text-primary',
        },
        {
            icon: <Smartphone size={32} />,
            title: 'Scholar Hub Mobile',
            description:
                'Access your entire neural laboratory from the palm of your hand, even in low bandwidth.',
            benefits: [
                'Edge computing',
                'Sync across devices',
                'Native experience',
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
            <section className="relative pt-32 sm:pt-40 lg:pt-44 pb-12 sm:pb-16">
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 relative z-10">
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8">
                        <div className="xl:col-span-8 rounded-[28px] sm:rounded-[36px] border border-foreground/10 bg-card/5 p-6 sm:p-10 lg:p-12 text-center xl:text-left">
                            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 glass rounded-xl border border-foreground/10">
                                <Trophy size={14} className="text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                                    Features built for excellence
                                </span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-[0.95] tracking-tighter">
                                Propel Your{' '}
                                <span className="text-primary">
                                    Academic Trajectory
                                </span>
                            </h1>
                            <p className="text-base sm:text-xl text-muted-foreground font-medium leading-relaxed max-w-none">
                                A comprehensive ecosystem designed to catalyze
                                how you process, retain, and master
                                information.
                            </p>
                        </div>

                        <div className="xl:col-span-4 rounded-[28px] sm:rounded-[36px] border border-foreground/10 bg-primary/5 p-6 sm:p-8">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 mb-4">
                                Core Modules
                            </p>
                            <ul className="space-y-3">
                                {features.slice(0, 5).map((feature, i) => (
                                    <li
                                        key={feature.title}
                                        className="min-h-11 rounded-xl border border-foreground/10 bg-background/40 px-4 flex items-center gap-3"
                                    >
                                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary text-xs font-black">
                                            {i + 1}
                                        </span>
                                        <span className="text-sm font-semibold text-foreground/80">
                                            {feature.title}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 sm:py-20 relative z-10">
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-7">
                        {features.map((feature, i) => (
                            <Card
                                key={i}
                                className="feature-card border border-foreground/10 bg-card/5 p-6 sm:p-8 hover-lift group overflow-hidden rounded-[24px] sm:rounded-[30px]"
                            >
                                <div
                                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6 sm:mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500`}
                                >
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold mb-4">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
                                    {feature.description}
                                </p>

                                <div className="space-y-3">
                                    {feature.benefits.map((benefit, j) => (
                                        <div
                                            key={j}
                                            className="flex items-center gap-3 text-xs font-bold opacity-60"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-xl bg-primary" />
                                            <span>{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 sm:py-32 bg-card/[0.01] border-y border-foreground/10 relative z-10 overflow-hidden">
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 text-center relative z-10">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 sm:mb-10 leading-none">
                        Study tools ready for your next session
                    </h2>
                    <Link to="/signup">
                        <Button
                            size="lg"
                            className="h-14 sm:h-16 md:h-20 px-8 sm:px-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base sm:text-lg md:text-xl shadow-glow group"
                        >
                            <span>Create Account</span>
                            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Features;
