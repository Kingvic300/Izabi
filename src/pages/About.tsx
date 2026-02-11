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
            name: 'Chioma Okafor',
            role: 'Founder & Chief Architect',
            bio: 'EdTech visionary with 10+ years in AI neural laboratories.',
            initials: 'CO',
        },
        {
            name: 'Tunde Adeyemi',
            role: 'CTO & Systems Lead',
            bio: 'AI researcher focusing on localized linguistic models.',
            initials: 'TA',
        },
        {
            name: 'Zainab Hassan',
            role: 'Head of Experience',
            bio: 'Interaction designer specializing in cognitive load reduction.',
            initials: 'ZH',
        },
        {
            name: 'Emeka Nwosu',
            role: 'Academic Relations',
            bio: 'Curriculum expert ensuring zero-gap syllabus alignment.',
            initials: 'EN',
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
                        <Sparkles size={14} className="text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                            Our Academic Manifesto
                        </span>
                    </div>
                    <h1 className="text-6xl sm:text-7xl font-bold mb-8 leading-none tracking-tighter">
                        The Future of{' '}
                        <span className="text-gradient">
                            Scholastic Mastery
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                        Redefining how the next generation of scholars interacts
                        with the sum of human knowledge.
                    </p>
                </div>
            </section>

            {/* Manifesto Content */}
            <section className="about-section py-20 relative z-10">
                <div className="w-full max-w-6xl mx-auto px-6 lg:px-12">
                    <div className="glass p-12 rounded-[48px] border border-foreground/5 space-y-10 shadow-2xl">
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 h-12 bg-primary rounded-xl" />
                            <h2 className="text-4xl font-bold">Our Origin</h2>
                        </div>
                        <div className="space-y-6 text-lg text-muted-foreground font-medium leading-[2]">
                            <p>
                                Izabi was born from a fundamental observation:
                                the tools used by students were lagging behind
                                their potential. We observed thousands of hours
                                wasted on rote memorization rather than deep
                                conceptual mastery.
                            </p>
                            <p>
                                In 2023, our chief architect{' '}
                                <span className="text-foreground">
                                    Chioma Okafor
                                </span>{' '}
                                initiated Izabi with a singular objective: To
                                leverage the power of advanced neural models to
                                create a personalized, localized learning
                                environment that adapts to the scholar—not the
                                other way around.
                            </p>
                            <p>
                                Today, Izabi stands as the primary neural
                                laboratory for over{' '}
                                <span className="text-foreground">
                                    10,000 scholars across Africa
                                </span>
                                , yielding an average GPA increase of 1.2 points
                                and reclaiming 500+ study hours annually for our
                                users.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="about-section py-32 relative z-10">
                <div className="w-full px-6 lg:px-12">
                    <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-center opacity-40 mb-16">
                        Core Principles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((v, i) => (
                            <Card
                                key={i}
                                className="glass p-10 border-foreground/5 hover-lift text-center group"
                            >
                                <div
                                    className={`w-16 h-16 rounded-xl ${v.bg} ${v.color} flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:scale-110 transition-transform`}
                                >
                                    {v.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4">
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
            <section className="about-section py-32 bg-card/[0.01] border-y border-foreground/5 relative z-10">
                <div className="w-full px-6 lg:px-12">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl font-bold mb-6">
                            The Neural Council
                        </h2>
                        <p className="text-xl text-muted-foreground font-medium">
                            The architects engineering the future of education.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, i) => (
                            <Card
                                key={i}
                                className="glass p-8 border-foreground/5 hover-lift relative overflow-hidden group"
                            >
                                <div className="w-16 h-16 bg-gradient-hero rounded-xl flex items-center justify-center text-foreground font-bold text-2xl shadow-glow mb-6 group-hover:rotate-6 transition-transform">
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
            <section className="about-section py-44 relative z-10">
                <div className="w-full px-6 lg:px-12 text-center">
                    <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-10 shadow-glow">
                        <Trophy className="text-primary" size={32} />
                    </div>
                    <h2 className="text-6xl font-bold mb-10 leading-none tracking-tighter">
                        Become Part of the <br /> Scholars Movement
                    </h2>
                    <Link to="/signup">
                        <Button
                            size="lg"
                            className="h-20 px-12 rounded-[28px] bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xl shadow-glow group"
                        >
                            <span>Initialize Enlistment</span>
                            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
