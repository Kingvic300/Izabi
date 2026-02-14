'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Brain,
    FileText,
    Zap,
    ArrowRight,
    CheckCircle,
    Trophy,
    MessageSquare,
    Layers,
    Target,
    Upload,
    Bot,
    ChartNoAxesColumn,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PRICING_ENABLED } from '@/config/featureFlags';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    const { t } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            gsap.from('.hero-animate > *', {
                opacity: 0,
                y: 28,
                stagger: 0.12,
                duration: 0.8,
                ease: 'power2.out',
            });

            gsap.from('.hero-step', {
                opacity: 0,
                x: 18,
                stagger: 0.08,
                duration: 0.6,
                ease: 'power2.out',
                delay: 0.2,
            });

            gsap.from('.feature-card', {
                scrollTrigger: {
                    trigger: '#features',
                    start: 'top 80%',
                },
                opacity: 0,
                y: 24,
                stagger: 0.06,
                duration: 0.7,
                ease: 'power2.out',
            });

            gsap.from('.workflow-card', {
                scrollTrigger: {
                    trigger: '#how-it-works',
                    start: 'top 82%',
                },
                opacity: 0,
                y: 24,
                stagger: 0.08,
                duration: 0.7,
                ease: 'power2.out',
            });

            gsap.from('.testimonial-card', {
                scrollTrigger: {
                    trigger: '#testimonials',
                    start: 'top 82%',
                },
                opacity: 0,
                y: 24,
                stagger: 0.08,
                duration: 0.7,
                ease: 'power2.out',
            });

            gsap.from('.pricing-card', {
                scrollTrigger: {
                    trigger: '#pricing',
                    start: 'top 82%',
                },
                opacity: 0,
                y: 24,
                stagger: 0.08,
                duration: 0.7,
                ease: 'power2.out',
            });

            gsap.from('.about-card', {
                scrollTrigger: {
                    trigger: '#about',
                    start: 'top 82%',
                },
                opacity: 0,
                y: 24,
                duration: 0.7,
                ease: 'power2.out',
            });

            gsap.from('.about-stat', {
                scrollTrigger: {
                    trigger: '#about',
                    start: 'top 78%',
                },
                opacity: 0,
                y: 18,
                stagger: 0.08,
                duration: 0.6,
                ease: 'power2.out',
            });

            gsap.from('.cta-panel', {
                scrollTrigger: {
                    trigger: '.cta-panel',
                    start: 'top 85%',
                },
                opacity: 0,
                y: 24,
                duration: 0.8,
                ease: 'power2.out',
            });
        },
        { scope: containerRef },
    );

    const features = [
        {
            icon: <FileText size={26} />,
            title: 'Upload Notes & Textbooks',
            description:
                'Upload PDF, DOCX, text, images, and more to start studying.',
        },
        {
            icon: <Brain size={26} />,
            title: 'Summaries & Study Guides',
            description:
                'Generate clear summaries and structured study guides instantly.',
        },
        {
            icon: <Zap size={26} />,
            title: 'Quizzes & Flashcards',
            description:
                'Create practice quizzes and flashcards from your uploaded material.',
        },
        {
            icon: <MessageSquare size={26} />,
            title: 'AI Study Assistant',
            description:
                'Chat with AI to ask questions and revise your notes faster.',
        },
        {
            icon: <Target size={26} />,
            title: 'Daily Practice',
            description:
                'Stay consistent with daily Brain Drop challenges and practice drills.',
        },
        {
            icon: <Layers size={26} />,
            title: 'Audio + Multi-language',
            description:
                'Listen to summaries and study in English, Pidgin, Igbo, Yoruba, or Hausa.',
        },
    ];

    const workflow = [
        {
            step: '01',
            title: 'Upload',
            desc: 'Add a note, textbook, or topic from your device.',
            icon: <Upload size={22} />,
        },
        {
            step: '02',
            title: 'Generate',
            desc: 'Create summaries, guides, quizzes, and flashcards instantly.',
            icon: <Bot size={22} />,
        },
        {
            step: '03',
            title: 'Improve',
            desc: 'Practice every day, monitor progress, and close weak areas.',
            icon: <ChartNoAxesColumn size={22} />,
        },
    ];

    const testimonials = [
        {
            name: 'Chioma Okafor',
            role: 'University Student',
            quote: 'I use the summaries and quizzes after every lecture. Revision is now much faster.',
            avatar: 'CO',
        },
        {
            name: 'Tunde Adeyemi',
            role: 'Candidate',
            quote: 'Flashcards and daily practice helped me stay consistent this term.',
            avatar: 'TA',
        },
        {
            name: 'Zainab Hassan',
            role: 'Secondary Scholar',
            quote: 'Switching language and listening to summaries made difficult topics easier for me.',
            avatar: 'ZH',
        },
    ];

    const plans = [
        {
            name: 'Free Scholar',
            price: '₦0',
            desc: 'Start your learning journey',
            features: [
                '5 Documents per day',
                '20 AI Messages per day',
                'Basic Summaries & Quizzes',
                'Multi-Language Support',
            ],
            featured: false,
        },
        {
            name: 'Pro Scholar',
            price: '₦1,999',
            desc: 'For serious learners',
            features: [
                '15 Documents per day',
                '30 AI Messages per day',
                'Advanced Summaries',
                'Unlimited Quizzes & Flashcards',
                'Multi-Language Support',
                'Audio Summaries (TTS)',
                'Priority Support',
            ],
            featured: true,
        },
        {
            name: 'Premium Scholar',
            price: '₦2,999',
            desc: 'Maximum productivity',
            features: [
                '30 Documents per day',
                '45 AI Messages per day',
                'Everything in Pro',
                'JAMB/WAEC Simulations',
                'Performance Analytics',
                'Cloud Storage (5GB)',
                'Custom Study Plans',
            ],
            featured: false,
        },
    ];

    const heroTagline = t('hero.tagline');
    const [heroTaglineLead, ...heroTaglineRest] = heroTagline.split('. ');

    return (
        <ErrorBoundary>
            <div
                ref={containerRef}
                className="min-h-screen bg-background relative overflow-x-hidden"
            >
                <Header />

                <section className="relative pt-32 sm:pt-40 lg:pt-44 pb-10 sm:pb-14">
                    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8 hero-animate">
                            <div className="xl:col-span-8 rounded-[28px] sm:rounded-[36px] border border-foreground/10 bg-card/5 p-6 sm:p-10 lg:p-12 text-center xl:text-left">
                                <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-xl border border-foreground/10 bg-background/40">
                                    <Trophy size={14} className="text-primary" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                                        Study tools built for real student workflows
                                    </span>
                                </div>

                                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-5 sm:mb-7 leading-[0.95] tracking-tighter text-foreground">
                                    {t('hero.title_top')} <br />
                                    <span className="text-primary">
                                        {t('hero.title_bottom')}
                                    </span>
                                </h1>

                                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground font-medium leading-relaxed max-w-none">
                                    {heroTaglineLead}.
                                    {heroTaglineRest.length > 0 && (
                                        <span className="text-foreground">
                                            {' '}
                                            {heroTaglineRest.join('. ')}
                                        </span>
                                    )}
                                </p>

                                <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center xl:justify-start">
                                    <Link to="/signup">
                                        <Button
                                            size="lg"
                                            className="min-h-11 sm:min-h-14 px-6 sm:px-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm sm:text-base group"
                                        >
                                            <span>{t('hero.cta')}</span>
                                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                    <a href="#how-it-works">
                                        <Button
                                            variant="ghost"
                                            size="lg"
                                            className="min-h-11 sm:min-h-14 px-6 sm:px-10 rounded-xl font-bold text-sm sm:text-base border border-foreground/10 hover:bg-foreground/5 text-foreground"
                                        >
                                            {t('hero.view_env')}
                                        </Button>
                                    </a>
                                </div>
                            </div>

                            <div className="xl:col-span-4 rounded-[28px] sm:rounded-[36px] border border-foreground/10 bg-primary/5 p-6 sm:p-8">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 mb-4">
                                    In One Session
                                </p>
                                <ul className="space-y-3">
                                    {[
                                        'Upload one topic and generate a summary',
                                        'Create quiz questions and flashcards',
                                        'Listen to audio revision in your language',
                                        'Track what to revise next',
                                    ].map((item, index) => (
                                        <li
                                            key={item}
                                            className="hero-step min-h-11 rounded-xl border border-foreground/10 bg-background/40 px-4 flex items-center gap-3"
                                        >
                                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary text-xs font-black shrink-0">
                                                {index + 1}
                                            </span>
                                            <span className="text-sm font-semibold text-foreground/80 leading-snug">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="features" className="py-10 sm:py-14 lg:py-16">
                    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
                        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
                            <div>
                                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                                    {t('features.title')}{' '}
                                    <span className="text-primary">
                                        {t('features.title_gradient')}
                                    </span>
                                </h2>
                                <p className="mt-3 text-sm sm:text-base text-muted-foreground font-medium">
                                    {t('features.subtitle')}
                                </p>
                            </div>
                            <Link
                                to="/features"
                                className="inline-flex items-center gap-2 text-sm font-bold text-primary"
                            >
                                <span>Explore all modules</span>
                                <ArrowRight size={16} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4 sm:gap-5">
                            {features.map((feature) => (
                                <Card
                                    key={feature.title}
                                    className="feature-card border border-foreground/10 bg-card/5 p-5 sm:p-6 rounded-2xl"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold mb-2 text-foreground">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                        {feature.description}
                                    </p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <section
                    id="how-it-works"
                    className="py-14 sm:py-16 lg:py-20 bg-card/[0.02] border-y border-foreground/10"
                >
                    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
                        <div className="text-center mb-8 sm:mb-10">
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary">
                                {t('how.title')}
                            </span>
                            <h2 className="mt-3 text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                                {t('how.subtitle')}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                            {workflow.map((item) => (
                                <Card
                                    key={item.step}
                                    className="workflow-card border border-foreground/10 bg-background/60 p-5 sm:p-6 rounded-2xl"
                                >
                                    <div className="flex items-start justify-between gap-4 mb-5">
                                        <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                            {item.icon}
                                        </div>
                                        <span className="inline-flex h-8 px-3 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-black">
                                            {item.step}
                                        </span>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                                        {item.desc}
                                    </p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="testimonials" className="py-14 sm:py-16 lg:py-20">
                    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
                        <div className="text-center mb-8 sm:mb-10">
                            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                                Voice of the
                                <span className="text-primary"> modern scholar</span>
                            </h2>
                            <p className="mt-3 text-sm sm:text-base text-muted-foreground font-medium">
                                Real feedback from students using Izabi daily.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                            {testimonials.map((item) => (
                                <Card
                                    key={item.name}
                                    className="testimonial-card border border-foreground/10 bg-card/5 p-5 sm:p-6 rounded-2xl"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black text-sm">
                                            {item.avatar}
                                        </div>
                                        <div>
                                            <h4 className="text-sm sm:text-base font-bold text-foreground leading-tight">
                                                {item.name}
                                            </h4>
                                            <p className="text-[10px] sm:text-xs uppercase tracking-widest opacity-60">
                                                {item.role}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
                                        "{item.quote}"
                                    </p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {PRICING_ENABLED && (
                    <section
                        id="pricing"
                        className="py-14 sm:py-16 lg:py-20 border-y border-foreground/10 bg-card/[0.02]"
                    >
                        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
                            <div className="text-center mb-8 sm:mb-10">
                                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                                    {t('pricing.title')}{' '}
                                    <span className="text-primary">
                                        {t('pricing.title_gradient')}
                                    </span>
                                </h2>
                                <p className="mt-3 text-sm sm:text-base text-muted-foreground font-medium">
                                    {t('pricing.subtitle')}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
                                {plans.map((plan) => (
                                    <Card
                                        key={plan.name}
                                        className={`pricing-card rounded-2xl p-5 sm:p-6 border bg-background/70 flex flex-col ${
                                            plan.featured
                                                ? 'border-primary ring-1 ring-primary/50'
                                                : 'border-foreground/10'
                                        }`}
                                    >
                                        {plan.featured && (
                                            <div className="inline-flex h-8 items-center rounded-lg bg-primary px-3 text-xs font-bold text-primary-foreground uppercase tracking-widest mb-4">
                                                Most Popular
                                            </div>
                                        )}

                                        <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                                            {plan.name}
                                        </h3>
                                        <p className="text-xs uppercase tracking-widest opacity-60 mt-1">
                                            {plan.desc}
                                        </p>
                                        <div className="mt-4 mb-5">
                                            <span className="text-3xl sm:text-4xl font-black text-foreground">
                                                {plan.price}
                                            </span>
                                            <span className="text-xs opacity-60">
                                                {' '}
                                                /month
                                            </span>
                                        </div>

                                        <ul className="space-y-2.5 flex-1 mb-6">
                                            {plan.features.map((item) => (
                                                <li
                                                    key={item}
                                                    className="min-h-11 flex items-center gap-2 text-sm text-foreground/85"
                                                >
                                                    <CheckCircle
                                                        size={15}
                                                        className="text-primary shrink-0"
                                                    />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <Link
                                            to={`/signup?plan=${plan.name.toLowerCase().replace(/\s+/g, '-')}`}
                                            className="w-full"
                                        >
                                            <Button
                                                className={`w-full min-h-11 rounded-xl font-bold text-sm ${
                                                    plan.featured
                                                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                                                        : 'bg-card hover:bg-card/80 border border-foreground/10 text-foreground'
                                                }`}
                                            >
                                                Choose Plan
                                            </Button>
                                        </Link>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <section id="about" className="py-14 sm:py-16 lg:py-20">
                    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8 items-stretch">
                            <div className="about-card xl:col-span-7 rounded-[28px] sm:rounded-[36px] border border-foreground/10 bg-card/5 p-6 sm:p-10 lg:p-12">
                                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
                                    Our Mission:{' '}
                                    <span className="text-primary">
                                        Equal Access
                                    </span>
                                </h2>
                                <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-muted-foreground font-medium leading-relaxed">
                                    Izabi helps students turn notes into study tools they can use immediately: summaries, quizzes, flashcards, and guided revision.
                                </p>
                                <Link to="/about" className="inline-flex mt-6 sm:mt-8">
                                    <Button
                                        variant="ghost"
                                        className="min-h-11 px-0 font-bold text-primary hover:bg-transparent"
                                    >
                                        About Izabi
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>

                            <div className="xl:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
                                {[
                                    { label: 'Summaries', val: 'Smart' },
                                    { label: 'Quizzes', val: 'Instant' },
                                    { label: 'Flashcards', val: 'Auto' },
                                    { label: 'AI Chat', val: 'Interactive' },
                                ].map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="about-stat border border-foreground/10 bg-background/60 rounded-2xl p-4 sm:p-6 flex flex-col justify-center text-center"
                                    >
                                        <div className="text-xl sm:text-2xl font-black text-primary">
                                            {stat.val}
                                        </div>
                                        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-60 mt-1">
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-14 sm:py-16 lg:py-20">
                    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
                        <div className="cta-panel text-center bg-primary/5 py-10 sm:py-14 rounded-[24px] sm:rounded-[36px] border border-foreground/10 px-4 sm:px-8">
                            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground">
                                {t('cta.upgrade')}
                            </h2>
                            <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-muted-foreground font-medium leading-relaxed">
                                {t('cta.tagline')}
                            </p>
                            <Link to="/signup" className="inline-flex mt-6 sm:mt-8">
                                <Button
                                    size="lg"
                                    className="min-h-11 sm:min-h-14 px-8 sm:px-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm sm:text-base group"
                                >
                                    <span>{t('nav.get_early_access')}</span>
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </ErrorBoundary>
    );
};

export default Home;
