"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Brain,
    FileText,
    Mic,
    Users,
    Zap,
    Globe,
    ArrowRight,
    CheckCircle,
    BookOpen,
    BarChart3,
    HelpCircle,
    Users2,
    Info,
    Sparkles,
    Trophy,
} from "lucide-react"
import { Link } from "react-router-dom"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { useLanguage } from "@/contexts/LanguageContext"

gsap.registerPlugin(ScrollTrigger)

const Home = () => {
    const { t } = useLanguage()
    const containerRef = useRef<HTMLDivElement>(null)
    useGSAP(() => {
        const tl = gsap.timeline()
        tl.from(".hero-content > *", { 
            opacity: 0, 
            y: 40, 
            stagger: 0.15, 
            duration: 1, 
            ease: "expo.out" 
        })
        tl.from(".hero-stats", { 
            opacity: 0, 
            scale: 0.9, 
            duration: 0.8, 
            ease: "back.out(1.7)" 
        }, "-=0.5")

        gsap.from(".feature-card", {
            scrollTrigger: {
                trigger: ".features-grid",
                start: "top 80%",
            },
            opacity: 0,
            y: 30,
            stagger: 0.1,
            duration: 0.8,
            ease: "power2.out"
        })
    }, { scope: containerRef })

    const features = [
        {
            icon: <FileText size={32} />,
            title: "Smart Scan",
            description: "Upload PDFs and notes - our system understands the context instantly.",
            color: "text-primary",
            bg: "bg-primary/10"
        },
        {
            icon: <Brain size={32} />,
            title: "Smart Summaries",
            description: "Get clear summaries that explain the 'Why' behind every concept.",
            color: "text-primary",
            bg: "bg-primary/10"
        },
        {
            icon: <Zap size={32} />,
            title: "Practice Quiz",
            description: "Auto-generate practice quizzes with instant feedback.",
            color: "text-primary",
            bg: "bg-primary/10"
        },
        {
            icon: <Users size={32} />,
            title: "Scholar Battles",
            description: "Engage in real-time knowledge duels with fellow students.",
            color: "text-primary",
            bg: "bg-primary/10"
        },
        {
            icon: <Mic size={32} />,
            title: "Audio Lexicon",
            description: "Convert any lesson into interactive audio tailored to your learning style.",
            color: "text-primary",
            bg: "bg-primary/10"
        },
        {
            icon: <Globe size={32} />,
            title: "Dialect Support",
            description: "Fluent across Academic English and Local Dialects (Pidgin) for better clarity.",
            color: "text-primary",
            bg: "bg-primary/10"
        },
    ]
    return (
        <ErrorBoundary>
            <div ref={containerRef} className="min-h-screen bg-background relative overflow-hidden">

                <Header />

                {/* Hero Section */}
                <section className="relative pt-44 pb-32 lg:pt-56 lg:pb-48">
                    <div className="w-full px-6 lg:px-12 relative z-10">
                        <div className="hero-content text-center w-full max-w-[1400px] mx-auto">
                            <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 glass rounded-xl border border-foreground/10 shadow-glow">
                                <Trophy size={16} className="text-yellow-500" />
                                <span className="text-xs font-bold uppercase tracking-widest text-foreground/60">{t("hero.trusted")}</span>
                            </div>
                            
                            <h1 className="text-6xl sm:text-8xl font-bold mb-8 leading-[0.9] tracking-tighter text-foreground">
                                {t("hero.title_top")} <br />
                                <span className="text-gradient">{t("hero.title_bottom")}</span>
                            </h1>
                            
                            <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                                {t("hero.tagline").split('. ')[0]}. 
                                <span className="text-foreground"> {t("hero.tagline").split('. ')[1]}</span>
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
                                <Link to="/signup">
                                    <Button size="lg" className="h-16 px-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-glow-primary group">
                                        <span>{t("hero.cta")}</span>
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <a href="#how-it-works">
                                    <Button variant="ghost" size="lg" className="h-16 px-10 rounded-xl font-bold text-lg glass border border-foreground/10 hover:bg-foreground/5 text-foreground">
                                        {t("hero.view_env")}
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-32 relative">
                    <div className="w-full px-6 lg:px-12">
                        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8 text-center md:text-left">
                            <div className="w-full">
                                <h2 className="text-5xl font-bold mb-6 leading-none tracking-tight text-foreground">
                                    {t("features.title")} <br />
                                    <span className="text-gradient">{t("features.title_gradient")}</span>
                                </h2>
                                <p className="text-lg text-muted-foreground font-medium">
                                    {t("features.subtitle")}
                                </p>
                            </div>
                            <Link to="/features" className="group">
                                <div className="flex items-center gap-3 font-bold text-primary group-hover:gap-5 transition-all">
                                    <span>Explore All Modules</span>
                                    <ArrowRight size={20} />
                                </div>
                            </Link>
                        </div>

                        <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, i) => (
                                <Card
                                    key={i}
                                    className="feature-card glass-card hover-lift border-foreground/5 p-8 relative group overflow-hidden"
                                >
                                    <div className={`w-16 h-16 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-xl`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed font-medium">{feature.description}</p>
                                    
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Showcase */}
                <section id="how-it-works" className="py-32 bg-foreground/5 border-y border-foreground/5">
                    <div className="w-full px-6 lg:px-12 text-center">
                        <div className="mb-20">
                            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-4 block">{t("how.title")}</span>
                            <h2 className="text-5xl font-bold text-foreground">{t("how.subtitle")}</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
                            {/* Connector Line */}
                            <div className="hidden lg:block absolute top-[60px] left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
                            
                            {[
                                { step: "01", title: "Upload", desc: "Upload your PDFs, notes, or raw texts.", icon: <FileText /> },
                                { step: "02", title: "Analyze", desc: "Izabi identifies key patterns and explains them.", icon: <Zap /> },
                                { step: "03", title: "Learn", desc: "Simulate exams and master the curriculum.", icon: <Sparkles /> },
                            ].map((item, i) => (
                                <div key={i} className="relative group">
                                    <div className="w-32 h-32 glass rounded-2xl border border-foreground/10 flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:border-primary/50 transition-colors">
                                        <span className="text-4xl">{item.icon}</span>
                                        <div className="absolute -top-4 -right-4 w-12 h-12 rounded-xl bg-primary flex items-center justify-center font-bold text-white shadow-glow text-xl">
                                            {item.step}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-foreground">{item.title}</h3>
                                    <p className="text-muted-foreground font-medium max-w-xs mx-auto leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section id="testimonials" className="py-32 relative overflow-hidden">
                    <div className="w-full px-6 lg:px-12 relative z-10">
                        <div className="text-center mb-24">
                            <h2 className="text-5xl font-bold mb-6">Voice of the <span className="text-gradient">Nex-Gen Scholar</span></h2>
                            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                                Join students across the continent transforming their academic legacy.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    name: "Chioma Okafor",
                                    role: "University Student",
                                    quote: "Izabi helped me save 15 hours per week. Reduced my study fatigue and spiked my GPA to 4.8!",
                                    avatar: "CO",
                                    grad: "bg-blue-600"
                                },
                                {
                                    name: "Tunde Adeyemi",
                                    role: "Candidate",
                                    quote: "The auto-generated mock exams are terrifyingly accurate to actual exam patterns. Worth every kobo.",
                                    avatar: "TA",
                                    grad: "bg-emerald-600"
                                },
                                {
                                    name: "Zainab Hassan",
                                    role: "Secondary Scholar",
                                    quote: "Swapping between English and Pidgin mode made complex Biology concepts finally click for me.",
                                    avatar: "ZH",
                                    grad: "bg-blue-700"
                                },
                            ].map((testimonial, i) => (
                                <Card key={i} className="glass shadow-2xl border-foreground/5 p-10 hover-lift relative group">
                                    <div className="flex items-center gap-5 mb-8">
                                        <div className={`w-14 h-14 rounded-xl ${testimonial.grad} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{testimonial.name}</h4>
                                            <p className="text-xs uppercase tracking-widest font-bold opacity-40">{testimonial.role}</p>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground font-medium leading-[1.8] italic">"{testimonial.quote}"</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Showcase */}
                <section id="pricing" className="py-32 relative z-10">
                    <div className="w-full px-6 lg:px-12">
                        <div className="text-center mb-24">
                            <h2 className="text-5xl font-bold mb-6 text-foreground">{t("pricing.title")} <span className="text-gradient">{t("pricing.title_gradient")}</span></h2>
                            <p className="text-xl text-muted-foreground font-medium">{t("pricing.subtitle")}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center w-full">
                            {[
                                {
                                    name: "Initiate",
                                    price: "₦0",
                                    desc: "Explore the environment",
                                    feat: ["5 Smart Scans/month", "Basic Summarization", "Standard Quizzes", "Web Access Only"],
                                    hot: false
                                },
                                {
                                    name: "Pro Scholar",
                                    price: "₦2,999",
                                    desc: "Unlock full potential",
                                    feat: ["Unlimited Scans", "Detailed Summaries", "Audio Lessons", "Pidgin AI Integration", "Smart Memory"],
                                    hot: true
                                },
                                {
                                    name: "Academic Elite",
                                    price: "₦9,999",
                                    desc: "Get the best results",
                                    feat: ["Everything in Pro", "Scholar Battle Pass", "WAEC/JAMB Predictions", "Priority Access", "1-on-1 AI Tutoring"],
                                    hot: false
                                },
                            ].map((plan, i) => (
                                <Card
                                    key={i}
                                    className={`p-10 border-foreground/5 transition-all relative overflow-hidden flex flex-col ${
                                        plan.hot
                                            ? "glass shadow-[0_0_80px_rgba(59,130,246,0.15)] ring-2 ring-primary scale-110 z-20 py-16"
                                            : "glass bg-foreground/5 opacity-80"
                                    }`}
                                >
                                    {plan.hot && (
                                        <div className="absolute top-6 right-6 bg-primary text-white px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest animate-pulse">Most Popular</div>
                                    )}
                                    <div className="mb-10">
                                        <h3 className="text-3xl font-bold mb-2 text-foreground">{plan.name}</h3>
                                        <p className="text-sm font-bold opacity-40 mb-6 uppercase tracking-wider text-foreground">{plan.desc}</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                                            <span className="text-xs font-bold opacity-40 text-foreground">/MONTH</span>
                                        </div>
                                    </div>
                                    
                                    <ul className="space-y-4 mb-10 flex-1">
                                        {plan.feat.map((f, j) => (
                                            <li key={j} className="flex items-center gap-3 text-sm font-bold opacity-80">
                                                <CheckCircle size={14} className="text-primary" />
                                                <span>{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    
                                    <Link to={`/signup?plan=${plan.name.toLowerCase().replace(' ', '-')}`} className="w-full">
                                        <Button
                                            className={`w-full h-14 rounded-xl font-bold text-lg transition-all ${
                                                plan.hot 
                                                    ? "bg-primary hover:bg-primary/90 text-white shadow-glow" 
                                                    : "bg-foreground/5 hover:bg-foreground/10 text-white border border-foreground/10"
                                            }`}
                                        >
                                            Get Started
                                        </Button>
                                    </Link>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Brief */}
                <section id="about" className="py-32 bg-foreground/5">
                    <div className="w-full px-6 lg:px-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                            <div>
                                <h2 className="text-5xl font-bold mb-8 leading-tight">Our Mission: <br /> <span className="text-gradient">Equal Access.</span></h2>
                                <p className="text-lg text-muted-foreground font-medium leading-[1.8] mb-8">
                                    We believe that every student in Africa deserves an unfair advantage. 
                                    Izabi was engineered to democratize elite-level academic tutoring through 
                                    accessible, localized, and intelligent technology.
                                </p>
                                <Button variant="ghost" className="font-bold p-0 hover:bg-transparent text-primary hover:gap-3 transition-all">
                                    Read Our Full Manifesto <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: "Students", val: "10K+" },
                                    { label: "Accuracy", val: "99.8%" },
                                    { label: "Papers", val: "50M+" },
                                    { label: "Hours Saved", val: "200K" }
                                ].map((stat, i) => (
                                    <div key={i} className="glass p-8 rounded-2xl border border-foreground/10 text-center hover-lift">
                                        <div className="text-3xl font-bold text-primary mb-1">{stat.val}</div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-44 relative">
                    <div className="w-full px-6 lg:px-12 text-center relative z-10">
                        <div className="inline-block p-1 rounded-xl bg-gradient-hero mb-8 shadow-glow transition-transform hover:scale-105">
                            <div className="bg-background rounded-xl px-6 py-2 flex items-center gap-2">
                                <Sparkles size={14} className="text-primary animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-widest">Enrollment Open</span>
                            </div>
                        </div>
                        <h2 className="text-6xl sm:text-7xl font-bold mb-8 tracking-tighter text-foreground">{t("cta.upgrade")}</h2>
                        <p className="text-xl text-muted-foreground mb-12 font-medium">
                            {t("cta.tagline").includes('. ') 
                                ? t("cta.tagline").split('. ').join('. \n')
                                : t("cta.tagline")
                            }
                        </p>
                        <Link to="/signup">
                            <Button size="lg" className="h-20 px-14 rounded-[28px] bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-2xl shadow-glow-primary group">
                                <span>{t("nav.get_early_access")}</span>
                                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </section>

                <Footer />
            </div>

            <style>{`
                .glass {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                }
                .glass-card {
                    background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                }
                .shadow-glow {
                    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
                }
                .shadow-glow-primary {
                    box-shadow: 0 10px 40px -10px rgba(59, 130, 246, 0.5);
                }
            `}</style>
        </ErrorBoundary>
    )
}

export default Home
