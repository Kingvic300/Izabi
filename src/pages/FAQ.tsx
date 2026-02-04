"use client"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, Sparkles } from "lucide-react"
import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

const FAQ = () => {
    const containerRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        gsap.from(".faq-section", {
            opacity: 0,
            y: 30,
            stagger: 0.1,
            duration: 1,
            ease: "expo.out"
        })
    }, { scope: containerRef })

    const faqs = [
        {
            category: "Portal Initialization",
            items: [
                {
                    q: "How do I initialize my scholar portal?",
                    a: "Enlist via the 'Get Started' portal. Enter your neural credentials and synchronize your email via the provided OTP code.",
                },
                {
                    q: "What data architectures do you support?",
                    a: "We currently support PDF, RAW Text, and High-Resolution Images (JPG, PNG). Our neural engine extracts data with 99.8% precision.",
                },
                {
                    q: "Are there volumetric constraints on uploads?",
                    a: "Neural scans are unlimited for Pro Scholars. Initiate plans have a 5-scan cap per solar cycle (month).",
                },
            ],
        },
        {
            category: "Neural Modules",
            items: [
                {
                    q: "How does the AI Synthesis engine operate?",
                    a: "Izabi identifies the core semantic nodes in your text and generates a structured summary that explains the 'Why', not just the 'What'.",
                },
                {
                    q: "Can I calibrate quiz difficulty?",
                    a: "Yes. The environment allows for 'Initiate', 'Scholastic', and 'Grandmaster' difficulty settings for all quizzes.",
                },
                {
                    q: "Is the Sonic Lexicon available for all dialects?",
                    a: "Currently, we support Academic English and Local Pidgin inflection. More linguistic modules are in the development pipeline.",
                },
            ],
        },
        {
            category: "Scholar Economics",
            items: [
                {
                    q: "How do I upgrade my architecture?",
                    a: "Navigate to the 'Pricing' terminal and select your preferred module. Upgrades are synchronized instantly across all devices.",
                },
                {
                    q: "Is my data sovereignty protected?",
                    a: "Yes. All note uploads are encrypted at the hardware level. We do not use user data to train global neural models.",
                },
                {
                    q: "Do you offer group-level licenses?",
                    a: "Academic institutions and study guilds can apply for Team Architectures via our specialized support portal.",
                },
            ],
        },
    ]

    return (
        <div ref={containerRef} className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Blobs */}
            <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

            <Header />

            {/* Hero */}
            <section className="relative pt-44 pb-20">
                <div className="w-full px-6 lg:px-12 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 glass rounded-full border border-white/10">
                        <HelpCircle size={14} className="text-secondary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Neural Support System</span>
                    </div>
                    <h1 className="text-6xl sm:text-7xl font-black mb-8 leading-none tracking-tighter">
                        Frequently Asked <span className="text-gradient">Neural Queries</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
                        Comprehensive answers for the modern AI Scholar.
                    </p>
                </div>
            </section>

            {/* FAQs */}
            <section className="py-20 relative z-10">
                <div className="w-full max-w-6xl mx-auto px-6 lg:px-12">
                    <div className="space-y-20">
                        {faqs.map((category, i) => (
                            <div key={i} className="faq-section">
                                <h2 className="text-sm font-black uppercase tracking-[0.3em] opacity-40 mb-8 px-1">{category.category}</h2>
                                <Accordion type="single" collapsible className="space-y-4">
                                    {category.items.map((item, index) => (
                                        <AccordionItem
                                            key={index}
                                            value={`${category.category}-${index}`}
                                            className="border border-white/5 bg-white/[0.02] rounded-[24px] px-8 shadow-2xl transition-all data-[state=open]:border-primary/30"
                                        >
                                            <AccordionTrigger className="hover:no-underline py-6">
                                                <span className="text-left font-bold text-lg">{item.q}</span>
                                            </AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground pb-8 font-medium leading-[1.8]">
                                                {item.a}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Support CTA */}
            <section className="py-32 relative z-10 border-t border-white/5">
                <div className="w-full max-w-6xl mx-auto px-6 lg:px-12 text-center bg-primary/5 py-24 rounded-[48px] border border-white/5">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-8">
                        <Sparkles className="text-primary" size={32} />
                    </div>
                    <h2 className="text-4xl font-black mb-6">Need a human link?</h2>
                    <p className="text-lg text-muted-foreground mb-10 font-medium">Our help descriptors are available for direct neural link support.</p>
                    <Link to="/contact">
                        <Button className="h-16 px-10 rounded-2xl bg-white text-black font-black text-lg hover:bg-white/90 shadow-glow">
                            Initialize Direct Link
                        </Button>
                    </Link>
                </div>
            </section>

            <Footer />

            <style>{`
                .glass {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                }
                .text-gradient {
                    background: linear-gradient(to right, #60a5fa, #a855f7, #ec4899);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .shadow-glow {
                    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
                }
            `}</style>
        </div>
    )
}

export default FAQ
