'use client';

import { Mail, Linkedin, Twitter, Sparkles } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Link } from 'react-router-dom';

import { useLanguage } from '@/contexts/LanguageContext';

export const Footer = () => {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        [t('nav.features')]: [
            { label: t('nav.features'), href: '/features' },
            { label: t('nav.pricing'), href: '/pricing' },
            { label: t('nav.how_it_works'), href: '/how-it-works' },
            { label: 'Achievements', href: '/dashboard/progress' },
        ],
        Resources: [
            { label: 'Study Tips', href: '/blog' },
            { label: 'Documentation', href: '/docs' },
            { label: 'Community', href: '/community' },
        ],
        Company: [
            { label: t('nav.about'), href: '/about' },
            { label: 'Contact', href: '/contact' },
            { label: 'Partnerships', href: '/partners' },
        ],
        Legal: [
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms', href: '/terms' },
            { label: 'Cookies', href: '/cookies' },
        ],
    };

    return (
        <footer className="relative bg-background pt-24 pb-12 overflow-hidden border-t border-foreground/10">
            <div className="w-full px-6 lg:px-12 relative">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 mb-20">
                    {/* Brand */}
                    <div className="col-span-2">
                        <Link to="/" className="flex items-center mb-6 group">
                            <Logo showText size={48} />
                        </Link>
                        <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-6 font-medium">
                            The world's most advanced AI-powered learning
                            environment designed specifically for the next
                            generation of scholars.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: Twitter, href: '#' },
                                { icon: Linkedin, href: '#' },
                                { icon: Mail, href: '#' },
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    className="w-10 h-10 rounded-xl bg-card/5 border border-foreground/10 flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all text-muted-foreground hover:text-primary-foreground"
                                >
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category} className="space-y-6">
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground opacity-40">
                                {category}
                            </h3>
                            <ul className="space-y-4">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.href}
                                            className="text-sm font-bold text-muted-foreground hover:text-primary transition-all flex items-center group"
                                        >
                                            <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300">
                                                •
                                            </span>
                                            <span className="group-hover:translate-x-1 transition-transform">
                                                {link.label}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-foreground/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground opacity-60">
                        <span>
                            {t('footer.copyright')}. Built for excellence.
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link
                            to="/privacy"
                            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Privacy
                        </Link>
                        <Link
                            to="/terms"
                            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Terms
                        </Link>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                            <Sparkles size={10} className="animate-pulse" />
                            <span>v2.0 Scholar</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
