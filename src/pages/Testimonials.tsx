'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote, Sparkles } from 'lucide-react';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Testimonials = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            gsap.from('.testimonial-card', {
                opacity: 0,
                scale: 0.9,
                duration: 0.8,
                stagger: 0.1,
                ease: 'expo.out',
            });
        },
        { scope: containerRef },
    );

    const testimonials = [
        {
            name: 'Chioma Okafor',
            role: 'University Scholar',
            initials: 'CO',
            text: 'Izabi completely recalibrated how I ingest information. I went from surviving my neural load to acing my honors. The synthesis engine is a masterwork.',
            rating: 5,
        },
        {
            name: 'Tunde Adeyemi',
            role: 'UTME Candidate',
            initials: 'TA',
            text: 'The Sonic Lexicon module is indispensable. I synchronize my commute with my study protocols. My performance metric rose by 35% in just one cycle.',
            rating: 5,
        },
        {
            name: 'Zainab Hassan',
            role: 'Secondary Scholar',
            initials: 'ZH',
            text: 'The Scholar Duels provide a competitive incentive that makes information retrieval natural. Learning no longer feels like labor.',
            rating: 5,
        },
        {
            name: 'Emeka Nwosu',
            role: 'Postgrad Scholar',
            initials: 'EN',
            text: 'Contextual summaries save me hours of manual extraction. I can now focus on high-level analysis rather than raw transcription.',
            rating: 5,
        },
        {
            name: 'Amara Obi',
            role: 'Linguistic Scholar',
            initials: 'AO',
            text: 'Localized Pidgin support is a breakthrough for clarity. It breaks down the cognitive barrier of purely academic syntax.',
            rating: 5,
        },
        {
            name: 'Seun Oluwaseun',
            role: 'Exam Candidate',
            initials: 'SO',
            text: "The readiness tracking indicates exactly when I've achieved 100% mastery. I entered my exams with absolute confidence.",
            rating: 5,
        },
    ];

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-background relative overflow-hidden"
        >
            <Header />

            {/* Hero */}
            <section className="relative pt-44 pb-20">
                <div className="w-full px-6 lg:px-12 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 glass rounded-xl border border-foreground/10">
                        <Sparkles size={14} className="text-secondary" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                            Voices of the Consortium
                        </span>
                    </div>
                    <h1 className="text-6xl sm:text-7xl font-bold mb-8 leading-none tracking-tighter">
                        Validated by{' '}
                        <span className="text-gradient">10,000+ Scholars</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                        The objective impact of the Izabi Neural Protocol on
                        academic trajectories.
                    </p>
                </div>
            </section>

            {/* Testimonials Grid */}
            <section className="py-20 relative z-10">
                <div className="w-full px-6 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <Card
                                key={i}
                                className="testimonial-card glass p-10 border-foreground/5 hover-lift relative group overflow-hidden"
                            >
                                <Quote
                                    className="absolute top-6 right-8 text-primary/10"
                                    size={60}
                                />
                                <div className="flex items-center gap-4 mb-8">
                                    <Avatar className="w-14 h-14 border-2 border-primary/20 bg-gradient-hero">
                                        <AvatarFallback className="font-bold text-foreground">
                                            {t.initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-bold text-foreground">
                                            {t.name}
                                        </h3>
                                        <p className="text-xs font-bold uppercase tracking-widest text-primary/60">
                                            {t.role}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-1 mb-6">
                                    {Array.from({ length: t.rating }).map(
                                        (_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                className="fill-primary text-primary"
                                            />
                                        ),
                                    )}
                                </div>
                                <p className="text-muted-foreground font-medium leading-loose italic">
                                    "{t.text}"
                                </p>

                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Metrics */}
            <section className="py-32 relative z-10 border-y border-foreground/5 bg-card/[0.01]">
                <div className="w-full px-6 lg:px-12">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                        {[
                            {
                                val: '10K+',
                                label: 'Active Nodes',
                                color: 'text-primary',
                            },
                            {
                                val: '4.9/5',
                                label: 'Protocol Rating',
                                color: 'text-primary',
                            },
                            {
                                val: '40%',
                                label: 'Grade Yield',
                                color: 'text-primary',
                            },
                            {
                                val: '50K+',
                                label: 'Syntheses Generated',
                                color: 'text-primary',
                            },
                        ].map((stat, i) => (
                            <div key={i} className="text-center space-y-2">
                                <div
                                    className={`text-5xl font-bold ${stat.color} tracking-tighter`}
                                >
                                    {stat.val}
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Testimonials;
