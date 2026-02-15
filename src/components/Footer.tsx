'use client';

import { Sparkles } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { PRICING_ENABLED } from '@/config/featureFlags';

export const Footer = () => {
    const { t } = useLanguage();

    const footerLinks = {
        Platform: [
            { label: t('nav.features'), href: '/features' },
            { label: t('nav.how_it_works'), href: '/how-it-works' },
            ...(PRICING_ENABLED
                ? [{ label: t('nav.pricing'), href: '/pricing' }]
                : []),
            { label: 'Testimonials', href: '/testimonials' },
        ],
        Company: [
            { label: t('nav.about'), href: '/about' },
            { label: 'Contact', href: '/contact' },
            { label: 'FAQ', href: '/faq' },
        ],
        Account: [
            { label: t('nav.client_portal'), href: '/login' },
            { label: t('nav.get_started'), href: '/signup' },
        ],
    };

    return (
        <footer className="relative bg-background border-t border-foreground/10">
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 pt-10 sm:pt-14 pb-2 sm:pb-4">
                <div className="rounded-3xl border border-foreground/10 bg-card/5 p-6 sm:p-8 lg:p-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                        <div className="lg:col-span-5 space-y-5">
                            <Link to="/" className="inline-flex items-center">
                                <Logo size={180} />
                            </Link>
                            <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed max-w-md">
                                Turn class notes and textbooks into clear
                                summaries, quizzes, flashcards, and guided
                                revision you can use immediately.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 pt-1">
                                <Link
                                    to="/signup"
                                    className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
                                >
                                    {t('nav.get_started')}
                                </Link>
                                <Link
                                    to="/login"
                                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-foreground/10 px-5 text-sm font-bold text-foreground hover:bg-card/10 transition-colors"
                                >
                                    {t('nav.client_portal')}
                                </Link>
                            </div>
                        </div>

                        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                            {Object.entries(footerLinks).map(
                                ([category, links]) => (
                                    <div key={category} className="space-y-4">
                                        <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-foreground/50">
                                            {category}
                                        </h3>
                                        <ul className="space-y-1.5">
                                            {links.map((link) => (
                                                <li key={link.label}>
                                                    <Link
                                                        to={link.href}
                                                        className="inline-flex min-h-11 items-center text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                                                    >
                                                        {link.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>

                    <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-foreground/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
                        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                            {t('footer.copyright')}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                            <Link
                                to="/contact"
                                className="inline-flex min-h-11 items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                            >
                                Contact
                            </Link>
                            <Link
                                to="/faq"
                                className="inline-flex min-h-11 items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                            >
                                FAQ
                            </Link>
                            <div className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-3 text-[10px] font-bold uppercase tracking-widest text-primary">
                                <Sparkles size={11} />
                                <span>v2.0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
