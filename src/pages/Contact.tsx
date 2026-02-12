'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MessageCircle, HelpCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact = () => {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            <Header />

            <section className="pt-32 sm:pt-40 lg:pt-44 pb-16 sm:pb-20">
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 space-y-4 text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter leading-tight">
                        Contact <span className="text-gradient">Support</span>
                    </h1>
                    <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                        Need help with your account or study tools? Reach out to
                        us directly.
                    </p>
                </div>
            </section>

            <section className="pb-20 sm:pb-24">
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 space-y-6 sm:space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="glass border-foreground/5 rounded-[32px] overflow-hidden shadow-xl">
                            <CardHeader className="p-5 sm:p-8 pb-3 sm:pb-4">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                                    <Mail size={28} />
                                </div>
                                <CardTitle className="text-2xl font-bold">
                                    Email Support
                                </CardTitle>
                                <CardDescription className="text-base font-medium">
                                    Send us a message and we will respond as
                                    quickly as possible.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-5 sm:p-8 pt-2 space-y-4">
                                <div className="p-4 rounded-2xl bg-card/5 border border-foreground/5 font-mono text-sm md:text-base font-bold truncate">
                                    victor7ishola@gmail.com
                                </div>
                                <Button
                                    asChild
                                    className="w-full h-12 rounded-xl font-bold gap-2"
                                >
                                    <a href="mailto:victor7ishola@gmail.com">
                                        <Mail size={16} />
                                        Send Email
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="glass border-foreground/5 rounded-[32px] overflow-hidden shadow-xl">
                            <CardHeader className="p-5 sm:p-8 pb-3 sm:pb-4">
                                <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 text-green-500">
                                    <MessageCircle size={28} />
                                </div>
                                <CardTitle className="text-2xl font-bold">
                                    WhatsApp Support
                                </CardTitle>
                                <CardDescription className="text-base font-medium">
                                    Chat with us directly on WhatsApp for
                                    faster support.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-5 sm:p-8 pt-2 space-y-4">
                                <div className="p-4 rounded-2xl bg-card/5 border border-foreground/5 font-mono text-sm md:text-base font-bold truncate">
                                    +234 814 478 2521
                                </div>
                                <Button
                                    asChild
                                    className="w-full h-12 rounded-xl font-bold gap-2 bg-green-600 hover:bg-green-500 text-white"
                                >
                                    <a
                                        href="https://wa.me/2348144782521"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <MessageCircle size={16} />
                                        Chat on WhatsApp
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="bg-card/5 border border-foreground/5 rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
                        <div className="space-y-2 text-center md:text-left">
                            <h3 className="text-2xl font-bold flex items-center justify-center md:justify-start gap-3">
                                <HelpCircle className="text-primary" />
                                Common Questions
                            </h3>
                            <p className="text-muted-foreground font-medium">
                                Check the FAQ for quick answers about account,
                                billing, and study features.
                            </p>
                        </div>
                        <Button
                            asChild
                            variant="outline"
                            className="h-14 px-8 rounded-2xl text-base font-bold gap-2 hover:bg-card/10 border-foreground/10 shrink-0"
                        >
                            <Link to="/faq">
                                Visit FAQ Center <ExternalLink size={16} />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;
