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
            role: 'University Student',
            initials: 'CO',
            text: 'This app really helped me understand my courses better. I stopped cramming and actually started getting the concepts. My grades improved a lot.',
            rating: 5,
        },
        {
            name: 'Tunde Adeyemi',
            role: 'UTME Candidate',
            initials: 'TA',
            text: 'I use it mostly when I’m on the move. Being able to listen and study at the same time helped me stay consistent. I saw real improvement in my scores.',
            rating: 5,
        },
        {
            name: 'Zainab Hassan',
            role: 'Secondary School Student',
            initials: 'ZH',
            text: 'The quiz and challenge parts make it more interesting. It doesn’t feel boring like normal studying, so I actually stick with it.',
            rating: 5,
        },
        {
            name: 'Emeka Nwosu',
            role: 'Postgraduate Student',
            initials: 'EN',
            text: 'The summaries save me a lot of time. I can quickly understand materials and focus more on analysis instead of reading everything word for word.',
            rating: 5,
        },
        {
            name: 'Amara Obi',
            role: 'Language Student',
            initials: 'AO',
            text: 'I like how it explains things in simpler terms when needed. It makes tough topics easier to understand without feeling overwhelmed.',
            rating: 5,
        },
        {
            name: 'Seun Oluwaseun',
            role: 'Exam Candidate',
            initials: 'SO',
            text: 'The progress tracking helped me know when I was actually ready. I went into my exams feeling more confident than usual.',
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
            <section className="relative pt-32 sm:pt-40 lg:pt-44 pb-16 sm:pb-20">
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 glass rounded-xl border border-foreground/10">
                        <Sparkles size={14} className="text-secondary" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                            Voices of the Consortium
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-8 leading-none tracking-tighter">
                        Validated by{' '}
                        <span className="text-gradient">100+ Scholars</span>
                    </h1>
                    <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                        The objective impact of the Izabi Neural Protocol on
                        academic trajectories.
                    </p>
                </div>
            </section>

            {/* Testimonials Grid */}
            <section className="py-16 sm:py-20 relative z-10">
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
                        {testimonials.map((t, i) => (
                            <Card
                                key={i}
                                className="testimonial-card glass p-6 sm:p-10 border-foreground/5 hover-lift relative group overflow-hidden"
                            >
                                <Quote
                                    className="absolute top-6 right-8 text-primary/10"
                                    size={60}
                                />
                                <div className="flex items-center gap-4 mb-8">
                                    <Avatar className="w-14 h-14 border-2 border-primary/20 bg-primary/20">
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

                                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Testimonials;
