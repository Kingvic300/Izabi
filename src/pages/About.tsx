'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
    Users,
    Target,
    Lightbulb,
    Heart,
    Sparkles,
    Trophy,
    ArrowRight,
} from 'lucide-react';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const About = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            gsap.from('.about-section', {
                opacity: 0,
                y: 30,
                stagger: 0.1,
                duration: 1,
                ease: 'expo.out',
            });
        },
        { scope: containerRef },
    );

    const values = [
        {
            icon: <Target className="h-10 w-10" />,
            title: 'Mission',
            description:
                'Democratizing neural-level tutoring by making localized AI accessible to every scholar in the global south.',
            color: 'text-primary',
            bg: 'bg-primary/10',
        },
        {
            icon: <Lightbulb className="h-10 w-10" />,
            title: 'Innovation',
            description:
                'Pioneering the boundary of adaptive learning systems tailored specifically for local contexts.',
            color: 'text-primary',
            bg: 'bg-primary/10',
        },
        {
            icon: <Heart className="h-10 w-10" />,
            title: 'Scholar-First',
            description:
                'Every optimization is verified by the actual academic success of our student consortium.',
            color: 'text-primary',
            bg: 'bg-primary/10',
        },
        {
            icon: <Users className="h-10 w-10" />,
            title: 'Consortium',
            description:
                "Building the world's most intelligent collaborative learning network for peer-to-peer mastery.",
            color: 'text-primary',
            bg: 'bg-primary/10',
        },
    ];

    const team = [
        {
            name: 'Oladimeji Victor',
            role: 'Full Stack Engineer',
            bio: 'Builds and maintains Izabi across frontend, backend, and deployment.',
            initials: 'OV',
        },
        {
            name: 'Ayodeji Adesegun',
            role: 'AI and ML Engineer',
            bio: 'Designs and improves the AI and machine learning systems powering Izabi.',
            initials: 'AA',
        },
        {
            name: 'Opemipo Akinwumi',
            role: 'Product Manager',
            bio: 'Leads roadmap planning and product execution for student-focused outcomes.',
            initials: 'OA',
        },
        {
            name: 'Oluwa Pelumi Oyetade',
            role: 'Product Designer',
            bio: 'Designs clear, intuitive user experiences across Izabi interfaces.',
            initials: 'OO',
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
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8 items-stretch">
                        <div className="xl:col-span-8 rounded-[28px] sm:rounded-[36px] border border-foreground/10 bg-card/5 p-6 sm:p-10 lg:p-12 text-center xl:text-left">
                            <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 glass rounded-xl border border-foreground/10">
                                <Sparkles size={14} className="text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                                    Our Academic Manifesto
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-5 sm:mb-7 leading-[0.95] tracking-tighter">
                                The Future of{' '}
                                <span className="text-gradient">
                                    Scholastic Mastery
                                </span>
                            </h1>
                            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto xl:mx-0 font-medium leading-relaxed">
                                Redefining how the next generation of scholars
                                interacts with the sum of human knowledge.
                            </p>
                        </div>

                        <div className="xl:col-span-4 rounded-[28px] sm:rounded-[36px] border border-foreground/10 bg-primary/5 p-6 sm:p-8 flex flex-col justify-center">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 mb-4">
                                At a glance
                            </p>
                            <div className="space-y-3">
                                <div className="min-h-11 rounded-xl border border-foreground/10 bg-background/40 px-4 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-muted-foreground">
                                        Active Scholars
                                    </span>
                                    <span className="text-sm font-black text-primary">
                                        10,000+
                                    </span>
                                </div>
                                <div className="min-h-11 rounded-xl border border-foreground/10 bg-background/40 px-4 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-muted-foreground">
                                        Avg GPA Uplift
                                    </span>
                                    <span className="text-sm font-black text-primary">
                                        +1.2
                                    </span>
                                </div>
                                <div className="min-h-11 rounded-xl border border-foreground/10 bg-background/40 px-4 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-muted-foreground">
                                        Hours Saved
                                    </span>
                                    <span className="text-sm font-black text-primary">
                                        500+
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Manifesto Content */}
            <section className="about-section py-10 sm:py-14 relative z-10">
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8">
                        <div className="xl:col-span-8 glass p-6 sm:p-10 rounded-[28px] sm:rounded-[36px] border border-foreground/10 space-y-6 sm:space-y-8 shadow-2xl">
                            <div className="flex items-center gap-4">
                                <div className="w-1.5 h-12 bg-primary rounded-xl" />
                                <h2 className="text-2xl sm:text-4xl font-bold">
                                    Our Origin
                                </h2>
                            </div>
                            <div className="space-y-5 text-base sm:text-lg text-muted-foreground font-medium leading-[1.8] sm:leading-[1.95]">
                                <p>
                                    Izabi was born from a fundamental
                                    observation: the tools used by students were
                                    lagging behind their potential. We observed
                                    thousands of hours wasted on rote
                                    memorization rather than deep conceptual
                                    mastery.
                                </p>
                                <p>
                                    In 2023, the Izabi core team initiated the
                                    platform with one objective: leverage
                                    advanced AI to build a personalized,
                                    localized learning environment that adapts
                                    to the scholar, not the other way around.
                                </p>
                                <p>
                                    Today, Izabi supports over{' '}
                                    <span className="text-foreground">
                                        10,000 scholars across Africa
                                    </span>
                                    , with an average GPA increase of 1.2 points
                                    and over 500 hours saved annually per active
                                    learner.
                                </p>
                            </div>
                        </div>

                        <div className="xl:col-span-4 glass p-6 sm:p-8 rounded-[28px] sm:rounded-[36px] border border-foreground/10 shadow-2xl">
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] opacity-50 mb-5">
                                Why it matters
                            </h3>
                            <div className="space-y-3">
                                <div className="rounded-xl border border-foreground/10 bg-card/10 p-4">
                                    <p className="text-xs uppercase tracking-widest opacity-50 mb-2 font-bold">
                                        Better Revision
                                    </p>
                                    <p className="text-sm text-muted-foreground font-medium">
                                        Students get summaries and quizzes in
                                        minutes, not days.
                                    </p>
                                </div>
                                <div className="rounded-xl border border-foreground/10 bg-card/10 p-4">
                                    <p className="text-xs uppercase tracking-widest opacity-50 mb-2 font-bold">
                                        Clear Progress
                                    </p>
                                    <p className="text-sm text-muted-foreground font-medium">
                                        Learners track performance and close
                                        weak areas quickly.
                                    </p>
                                </div>
                                <div className="rounded-xl border border-foreground/10 bg-card/10 p-4">
                                    <p className="text-xs uppercase tracking-widest opacity-50 mb-2 font-bold">
                                        Local Context
                                    </p>
                                    <p className="text-sm text-muted-foreground font-medium">
                                        Study support is tailored for African
                                        curriculum and exam pathways.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="about-section py-14 sm:py-20 lg:py-24 relative z-10">
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
                    <h2 className="text-sm font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-center opacity-40 mb-12 sm:mb-16">
                        Core Principles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
                        {values.map((v, i) => (
                            <Card
                                key={i}
                                className="glass p-6 sm:p-10 border-foreground/5 hover-lift text-center group"
                            >
                                <div
                                    className={`w-16 h-16 rounded-xl ${v.bg} ${v.color} flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:scale-110 transition-transform`}
                                >
                                    {v.icon}
                                </div>
                                <h3 className="text-xl sm:text-2xl font-bold mb-4">
                                    {v.title}
                                </h3>
                                <p className="text-muted-foreground font-medium text-sm leading-loose">
                                    {v.description}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Neural Council */}
            <section className="about-section py-14 sm:py-20 lg:py-24 bg-card/[0.01] border-y border-foreground/10 relative z-10">
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
                    <div className="text-center mb-14 sm:mb-20">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                            The Neural Council
                        </h2>
                        <p className="text-base sm:text-xl text-muted-foreground font-medium">
                            The architects engineering the future of education.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
                        {team.map((member, i) => (
                            <Card
                                key={i}
                                className="glass p-6 sm:p-8 border-foreground/5 hover-lift relative overflow-hidden group"
                            >
                                <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center text-foreground font-bold text-2xl shadow-glow mb-6 group-hover:rotate-6 transition-transform">
                                    {member.initials}
                                </div>
                                <h3 className="text-xl font-bold mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-primary text-xs font-bold uppercase tracking-widest mb-4">
                                    {member.role}
                                </p>
                                <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                                    {member.bio}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Manifesto CTA */}
            <section className="about-section py-14 sm:py-20 lg:py-24 relative z-10">
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 text-center">
                    <div className="rounded-[28px] sm:rounded-[36px] border border-foreground/10 bg-primary/5 py-10 sm:py-14 px-4 sm:px-8">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-8 sm:mb-10 shadow-glow">
                            <Trophy className="text-primary" size={32} />
                        </div>
                        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-8 sm:mb-10 leading-none tracking-tighter">
                            Become Part of the <br /> Scholars Movement
                        </h2>
                        <Link to="/signup">
                            <Button
                                size="lg"
                                className="h-14 sm:h-16 md:h-20 px-8 sm:px-12 rounded-[28px] bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base sm:text-lg md:text-xl shadow-glow group"
                            >
                                <span>Create Account</span>
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

export default About;
