'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Sparkles, Trophy, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Pricing = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            gsap.from('.pricing-card', {
                opacity: 0,
                y: 40,
                stagger: 0.1,
                duration: 1,
                ease: 'expo.out',
            });
        },
        { scope: containerRef },
    );

    const plans = [
        {
            name: 'Free Scholar',
            price: '0',
            description: 'Start your learning journey.',
            features: [
                '5 Documents per day',
                '20 AI Messages per day',
                'Basic Summaries & Quizzes',
                'Multi-Language Support',
            ],
            cta: 'Choose Free Plan',
            highlighted: false,
        },
        {
            name: 'Pro Scholar',
            price: '1,999',
            description: 'For serious learners.',
            features: [
                '15 Documents per day',
                '30 AI Messages per day',
                'Advanced Summaries',
                'Unlimited Quizzes & Flashcards',
                'Multi-Language Support',
                'Audio Summaries (TTS)',
                'Priority Support',
            ],
            cta: 'Choose Pro Plan',
            highlighted: true,
        },
        {
            name: 'Premium Scholar',
            price: '2,999',
            description: 'Maximum productivity unlocked.',
            features: [
                '30 Documents per day',
                '45 AI Messages per day',
                'Everything in Pro',
                'JAMB/WAEC Simulations',
                'Performance Analytics',
                'Cloud Storage (5GB)',
                'Custom Study Plans',
            ],
            cta: 'Choose Premium Plan',
            highlighted: false,
        },
    ];

    const faqs = [
        {
            q: 'Can I cancel my enlistment anytime?',
            a: 'Absolutely. Scholar plans are flexible. You can terminate your subscription at any interval without penalties.',
        },
        {
            q: 'Is there a trial for the Pro modules?',
            a: 'Yes, once you initialize your account, you get a 7-day complimentary window to experience the Pro environment.',
        },
        {
            q: 'What payment gateways are supported?',
            a: 'We support major credit cards, Paystack, Flutterwave, and direct mobile bank transfers.',
        },
        {
            q: 'Do you offer group/school discounts?',
            a: 'We do. Institutions looking to deploy Izabi for 50+ scholars can contact our Academic Relations team.',
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
                        <Sparkles size={14} className="text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                            Investment in Intelligence
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-8 leading-none tracking-tighter">
                        Transparent{' '}
                        <span className="text-gradient">Scholar Economics</span>
                    </h1>
                    <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                        Choose the architecture that matches your academic
                        ambition.
                    </p>
                </div>
            </section>

            {/* Pricing Grid */}
            <section className="py-16 sm:py-20 relative z-10">
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 items-center w-full mx-auto">
                        {plans.map((plan, i) => (
                            <Card
                                key={i}
                                className={`pricing-card p-6 sm:p-10 transition-all relative overflow-hidden border-foreground/5 flex flex-col ${
                                    plan.highlighted
                                        ? 'glass shadow-[0_0_80px_rgba(59,130,246,0.15)] ring-2 ring-primary lg:scale-110 z-20 py-10 sm:py-16'
                                        : 'glass bg-card/[0.02]'
                                }`}
                            >
                                {plan.highlighted && (
                                    <div className="absolute top-6 right-6 bg-primary text-primary-foreground px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest animate-pulse">
                                        Most Popular
                                    </div>
                                )}
                                <div className="mb-10">
                                    <h3 className="text-2xl sm:text-3xl font-bold mb-2">
                                        {plan.name}
                                    </h3>
                                    <p className="text-xs font-bold opacity-40 mb-8 uppercase tracking-widest leading-none">
                                        {plan.description}
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold opacity-40">
                                            ₦
                                        </span>
                                        <span className="text-4xl sm:text-5xl font-bold text-foreground">
                                            {plan.price}
                                        </span>
                                        <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                                            /mo
                                        </span>
                                    </div>
                                </div>

                                <ul className="space-y-4 mb-10 flex-1">
                                    {plan.features.map((f, j) => (
                                        <li
                                            key={j}
                                            className="flex items-center gap-3 text-sm font-bold opacity-70"
                                        >
                                            <Check
                                                size={14}
                                                className="text-primary flex-shrink-0"
                                            />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link to="/signup">
                                    <Button
                                        className={`w-full h-14 rounded-xl font-bold text-lg transition-all ${
                                            plan.highlighted
                                                ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow'
                                                : 'bg-card/5 hover:bg-card/10 text-foreground border border-foreground/10'
                                        }`}
                                    >
                                        {plan.cta}
                                    </Button>
                                </Link>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Area */}
            <section className="py-20 sm:py-32 relative z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
                    <div className="flex items-center gap-4 mb-12 justify-center">
                        <div className="w-12 h-12 rounded-xl glass border border-foreground/10 flex items-center justify-center">
                            <HelpCircle className="text-primary" />
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-bold">
                            Neural Queries
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                        {faqs.map((faq, i) => (
                            <Card
                                key={i}
                                className="glass p-5 sm:p-8 border-foreground/5 hover:border-foreground/10 transition-colors"
                            >
                                <h3 className="text-lg sm:text-xl font-bold mb-3">
                                    {faq.q}
                                </h3>
                                <p className="text-muted-foreground font-medium leading-relaxed">
                                    {faq.a}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Secondary CTA */}
            <section className="py-16 sm:py-20 relative z-10 border-t border-foreground/5 bg-card/[0.01]">
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 text-center">
                    <h2 className="text-3xl font-bold mb-8">
                        Not sure which architecture to deploy?
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            variant="ghost"
                            className="font-bold text-lg h-14 px-8 rounded-xl glass border border-foreground/10"
                        >
                            <Link to="/features">Compare Modules</Link>
                        </Button>
                        <Button
                            asChild
                            variant="ghost"
                            className="font-bold text-lg h-14 px-8 rounded-xl text-primary hover:bg-primary/10"
                        >
                            <Link to="/contact">Contact Support</Link>
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Pricing;
