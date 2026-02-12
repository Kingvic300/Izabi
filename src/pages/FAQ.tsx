'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle, Sparkles } from 'lucide-react';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const FAQ = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            gsap.from('.faq-section', {
                opacity: 0,
                y: 30,
                stagger: 0.1,
                duration: 1,
                ease: 'expo.out',
            });
        },
        { scope: containerRef },
    );

    const faqs = [
        {
            category: 'Getting Started',
            items: [
                {
                    q: 'How do I create an account?',
                    a: 'Go to the Sign Up page, enter your details, and verify your email with the OTP code.',
                },
                {
                    q: 'What file types can I upload?',
                    a: 'You can upload PDF, DOCX, TXT, and image files like JPG and PNG.',
                },
                {
                    q: 'Are there upload limits?',
                    a: 'Yes. Upload limits depend on your plan, and higher plans allow more daily uploads.',
                },
            ],
        },
        {
            category: 'Study Tools',
            items: [
                {
                    q: 'How does summary generation work?',
                    a: 'Izabi analyzes your uploaded content and creates a clear, structured summary for revision.',
                },
                {
                    q: 'Can I change quiz difficulty?',
                    a: 'Yes. You can choose a difficulty level before generating practice questions.',
                },
                {
                    q: 'Which languages are supported?',
                    a: 'Izabi supports English, Nigerian Pidgin, Igbo, Yoruba, and Hausa for key study features.',
                },
            ],
        },
        {
            category: 'Billing & Security',
            items: [
                {
                    q: 'How do I upgrade my plan?',
                    a: 'Open the Pricing page, choose a plan, and complete payment. Your account updates immediately.',
                },
                {
                    q: 'Is my data secure?',
                    a: 'Yes. Uploaded files are protected, and your personal data is handled according to our privacy policy.',
                },
                {
                    q: 'Do you offer school or group plans?',
                    a: 'Yes. Contact support for institution and group pricing options.',
                },
            ],
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
                        <div className="xl:col-span-8 rounded-[28px] sm:rounded-[36px] border border-foreground/10 bg-card/5 p-6 sm:p-10 lg:p-12">
                            <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 glass rounded-xl border border-foreground/10">
                                <HelpCircle size={14} className="text-secondary" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                                    Help Center
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-5 sm:mb-7 leading-[0.95] tracking-tighter">
                                Frequently Asked{' '}
                                <span className="text-gradient">Questions</span>
                            </h1>
                            <p className="text-base sm:text-xl text-muted-foreground max-w-3xl font-medium leading-relaxed">
                                Clear answers about account setup, study tools,
                                uploads, and billing.
                            </p>
                        </div>

                        <div className="xl:col-span-4 rounded-[28px] sm:rounded-[36px] border border-foreground/10 bg-primary/5 p-6 sm:p-8 flex flex-col justify-center">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 mb-4">
                                Quick Guide
                            </p>
                            <ul className="space-y-3">
                                {faqs.map((category) => (
                                    <li
                                        key={category.category}
                                        className="min-h-11 rounded-xl border border-foreground/10 bg-background/40 px-4 flex items-center text-sm font-semibold text-foreground/80"
                                    >
                                        {category.category}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section className="py-8 sm:py-12 lg:py-16 relative z-10">
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                        {faqs.map((category, i) => (
                            <div
                                key={i}
                                className="faq-section rounded-[24px] sm:rounded-[32px] border border-foreground/10 bg-card/5 p-4 sm:p-6 lg:p-8"
                            >
                                <h2 className="text-xs font-bold uppercase tracking-[0.2em] opacity-50 mb-4 sm:mb-6 px-1">
                                    {category.category}
                                </h2>
                                <Accordion
                                    type="single"
                                    collapsible
                                    className="space-y-3 sm:space-y-4"
                                >
                                    {category.items.map((item, index) => (
                                        <AccordionItem
                                            key={index}
                                            value={`${category.category}-${index}`}
                                            className="border border-foreground/10 bg-background/40 rounded-xl px-4 sm:px-5 transition-all data-[state=open]:border-primary/30"
                                        >
                                            <AccordionTrigger className="hover:no-underline py-4 sm:py-5">
                                                <span className="text-left font-bold text-sm sm:text-base leading-snug">
                                                    {item.q}
                                                </span>
                                            </AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground pb-5 sm:pb-6 text-sm sm:text-base font-medium leading-relaxed">
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
            <section className="py-14 sm:py-20 relative z-10 border-t border-foreground/10">
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
                    <div className="text-center bg-primary/5 py-10 sm:py-16 rounded-[24px] sm:rounded-[36px] border border-foreground/10 px-4 sm:px-8">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-6 sm:mb-8">
                            <Sparkles className="text-primary" size={30} />
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">
                            Need help?
                        </h2>
                        <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 font-medium">
                            Contact support and we will help you quickly.
                        </p>
                        <Link to="/contact">
                            <Button className="h-12 sm:h-14 px-6 sm:px-10 rounded-xl bg-card text-black font-bold text-sm sm:text-base hover:bg-card/5 shadow-glow">
                                Contact Support
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default FAQ;
