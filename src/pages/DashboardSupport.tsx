'use client';

import { useRef } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Mail,
    Phone,
    MessageCircle,
    HelpCircle,
    ExternalLink,
} from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function DashboardSupport() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const tl = gsap.timeline();
            tl.fromTo(
                '.page-header',
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' },
            ).fromTo(
                '.contact-card',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    stagger: 0.1,
                    duration: 1,
                    ease: 'expo.out',
                },
                '-=0.4',
            );
        },
        { scope: containerRef },
    );

    return (
        <div
            ref={containerRef}
            className="space-y-8 w-full pb-20 px-4 md:px-8 lg:px-12 pt-6 md:pt-12"
        >
            {/* Header Section */}
            <div className="page-header space-y-4">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
                    Contact <span className="text-gradient">Support</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
                    Need help or have questions? Reach out to our support team
                    directly. We are here to assist you.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email Support Card */}
                <Card className="contact-card glass border-foreground/5 rounded-[32px] overflow-hidden shadow-xl hover:shadow-2xl transition-all group">
                    <CardHeader className="p-8 pb-4">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                            <Mail size={28} />
                        </div>
                        <CardTitle className="text-2xl font-bold">
                            Email Support
                        </CardTitle>
                        <CardDescription className="text-base font-medium">
                            Send us a detailed message and we'll get back to you
                            shortly.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-2 space-y-4">
                        <div className="p-4 rounded-2xl bg-card/5 border border-foreground/5 font-mono text-sm md:text-base font-bold truncate">
                            victor7ishola@gmail.com
                        </div>
                        <Button
                            className="w-full h-12 rounded-xl font-bold gap-2"
                            onClick={() =>
                                window.open('mailto:victor7ishola@gmail.com')
                            }
                        >
                            <Mail size={16} />
                            Send Email
                        </Button>
                    </CardContent>
                </Card>

                {/* WhatsApp Support Card */}
                <Card className="contact-card glass border-foreground/5 rounded-[32px] overflow-hidden shadow-xl hover:shadow-2xl transition-all group">
                    <CardHeader className="p-8 pb-4">
                        <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 text-green-500 group-hover:scale-110 transition-transform">
                            <MessageCircle size={28} />
                        </div>
                        <CardTitle className="text-2xl font-bold">
                            WhatsApp Support
                        </CardTitle>
                        <CardDescription className="text-base font-medium">
                            Chat with us directly on WhatsApp for quicker
                            responses.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-2 space-y-4">
                        <div className="p-4 rounded-2xl bg-card/5 border border-foreground/5 font-mono text-sm md:text-base font-bold truncate">
                            +234 814 478 2521
                        </div>
                        <Button
                            className="w-full h-12 rounded-xl font-bold gap-2 bg-green-600 hover:bg-green-500 text-white"
                            onClick={() =>
                                window.open(
                                    'https://wa.me/2348144782521',
                                    '_blank',
                                )
                            }
                        >
                            <MessageCircle size={16} />
                            Chat on WhatsApp
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Info / FAQ Link could go here */}
            <div className="contact-card bg-card/5 border border-foreground/5 rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-2xl font-bold flex items-center justify-center md:justify-start gap-3">
                        <HelpCircle className="text-primary" />
                        Common Questions
                    </h3>
                    <p className="text-muted-foreground font-medium">
                        Check our FAQ section for quick answers to common
                        questions about accounts, exams, and AI features.
                    </p>
                </div>
                <Button
                    variant="outline"
                    className="h-14 px-8 rounded-2xl text-base font-bold gap-2 hover:bg-card/10 border-foreground/10 shrink-0"
                >
                    Visit FAQ Center <ExternalLink size={16} />
                </Button>
            </div>
        </div>
    );
}
