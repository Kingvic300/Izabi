"use client"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Zap, BookOpen, Trophy, ArrowRight, CheckCircle, Sparkles, Binary } from "lucide-react"
import { Link } from "react-router-dom"
import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useLanguage } from "@/contexts/LanguageContext"

const HowItWorks = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const { t } = useLanguage()

    useGSAP(() => {
        gsap.from(".step-card", {
            opacity: 0,
            x: (i) => i % 2 === 0 ? -40 : 40,
            duration: 1,
            stagger: 0.2,
            ease: "expo.out",
            scrollTrigger: {
                trigger: ".steps-container",
                start: "top 80%"
            }
        })
    }, { scope: containerRef })

    const steps = [
        {
            icon: <Upload size={32} />,
            title: t("hiw.ingest_title"),
            description: t("hiw.ingest_desc"),
            details: [
                t("hiw.ingest_d1"),
                t("hiw.ingest_d2"),
                t("hiw.ingest_d3"),
                t("hiw.ingest_d4"),
            ],
            bg: "bg-primary/10",
            color: "text-primary"
        },
        {
            icon: <Zap size={32} />,
            title: t("hiw.neural_title"),
            description: t("hiw.neural_desc"),
            details: [
                t("hiw.neural_d1"),
                t("hiw.neural_d2"),
                t("hiw.neural_d3"),
                t("hiw.neural_d4"),
            ],
            bg: "bg-purple-500/10",
            color: "text-purple-500"
        },
        {
            icon: <BookOpen size={32} />,
            title: t("hiw.synth_title"),
            description: t("hiw.synth_desc"),
            details: [
                t("hiw.synth_d1"),
                t("hiw.synth_d2"),
                t("hiw.synth_d3"),
                t("hiw.synth_d4"),
            ],
            bg: "bg-primary/10",
            color: "text-primary"
        },
        {
            icon: <Trophy size={32} />,
            title: t("hiw.mastery_title"),
            description: t("hiw.mastery_desc"),
            details: [
                t("hiw.mastery_d1"),
                t("hiw.mastery_d2"),
                t("hiw.mastery_d3"),
                t("hiw.mastery_d4"),
            ],
            bg: "bg-yellow-500/10",
            color: "text-yellow-500"
        },
    ]

    return (
        <div ref={containerRef} className="min-h-screen bg-background relative overflow-hidden">

            <Header />

            {/* Hero */}
            <section className="relative pt-44 pb-24">
                <div className="w-full px-6 lg:px-12 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 glass rounded-xl border border-foreground/10">
                        <Binary size={14} className="text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">{t("hiw.hero_tag")}</span>
                    </div>
                    <h1 className="text-6xl sm:text-7xl font-bold mb-8 leading-none tracking-tighter">
                        {t("hiw.hero_title")} <span className="text-gradient">{t("hiw.hero_title_span")}</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                        {t("hiw.hero_desc")}
                    </p>
                </div>
            </section>

            {/* Steps Container */}
            <section className="steps-container py-20 relative z-10">
                <div className="w-full px-6 lg:px-12">
                    <div className="space-y-32">
                        {steps.map((step, i) => (
                            <div key={i} className={`step-card flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-20`}>
                                <div className="flex-1 space-y-8">
                                    <div className={`w-20 h-20 rounded-2xl ${step.bg} ${step.color} flex items-center justify-center shadow-2xl group`}>
                                        {step.icon}
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <span className="text-5xl font-bold opacity-10">{i + 1}</span>
                                            <h2 className="text-4xl font-bold text-foreground">{step.title}</h2>
                                        </div>
                                        <p className="text-xl text-muted-foreground font-medium leading-relaxed">{step.description}</p>
                                    </div>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {step.details.map((detail, j) => (
                                            <li key={j} className="flex items-center gap-3 glass p-4 rounded-xl border border-foreground/5">
                                                <CheckCircle size={18} className="text-primary flex-shrink-0" />
                                                <span className="text-sm font-bold opacity-80">{detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex-1 w-full aspect-square glass rounded-xl border border-foreground/5 relative overflow-hidden group shadow-2xl">
                                    <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center p-20">
                                       <div className="w-full h-full bg-card/5 rounded-xl animate-pulse border border-foreground/10 flex items-center justify-center text-primary/20">
                                            {step.icon}
                                       </div>
                                    </div>
                                    <div className="absolute top-8 right-8 text-primary opacity-20 group-hover:opacity-100 transition-opacity">
                                        <Sparkles size={40} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Timeline */}
            <section className="py-32 bg-card/[0.01] border-y border-foreground/5">
                <div className="w-full px-6 lg:px-12">
                    <h2 className="text-4xl font-bold text-center mb-16">Deployment Latency</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: t("hiw.lat_setup"), time: "2 min" },
                            { label: t("hiw.lat_upload"), time: "1 min" },
                            { label: t("hiw.lat_neural"), time: "30 sec" },
                            { label: t("hiw.lat_mastery"), time: "Instant" }
                        ].map((stat, i) => (
                            <Card key={i} className="glass p-10 border-foreground/5 hover-lift text-center group">
                                <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">{stat.time}</div>
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">{stat.label}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-44 relative z-10">
                <div className="w-full px-6 lg:px-12 text-center bg-gradient-hero/5 py-24 rounded-[64px] border border-foreground/5 relative overflow-hidden">
                    <h2 className="text-5xl font-bold mb-8 leading-tight text-foreground">{t("hiw.cta_title")}</h2>
                    <Link to="/signup">
                        <Button size="lg" className="h-20 px-12 rounded-[28px] bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xl shadow-glow group">
                            <span>{t("hiw.cta_btn")}</span>
                            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </section>

            <Footer />

        </div>
    )
}

export default HowItWorks
