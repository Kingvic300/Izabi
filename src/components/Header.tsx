import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { PRICING_ENABLED } from '@/config/featureFlags';

export const Header = () => {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 8);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    const navLinks = [
        { name: t('nav.features'), href: '/features' },
        { name: t('nav.how_it_works'), href: '/how-it-works' },
        { name: t('nav.pricing'), href: '/pricing' },
        { name: t('nav.about'), href: '/about' },
    ].filter((link) => PRICING_ENABLED || link.href !== '/pricing');

    return (
        <header
            className={cn(
                'fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200',
                scrolled || isOpen
                    ? 'border-border bg-background/95 supports-[backdrop-filter]:bg-background/85 supports-[backdrop-filter]:'
                    : 'border-transparent bg-background',
            )}
        >
            <div className="page-gutter flex h-16 items-center gap-8">
                <Link
                    to="/"
                    className="-ml-2 flex shrink-0 items-center rounded-md"
                    aria-label="Izabi home"
                >
                    <Logo height={30} />
                </Link>

                <nav
                    aria-label="Main"
                    className="hidden items-center gap-1 lg:flex"
                >
                    {navLinks.map((link) => {
                        const active = location.pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                to={link.href}
                                aria-current={active ? 'page' : undefined}
                                className={cn(
                                    'rounded-md px-3 py-2 text-[15px] transition-colors',
                                    active
                                        ? 'text-foreground underline decoration-sheet decoration-2 underline-offset-[10px]'
                                        : 'text-muted-foreground hover:text-foreground',
                                )}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="ml-auto hidden items-center gap-1 lg:flex">
                    <LanguageToggle />
                    <ThemeToggle />
                    <span className="mx-2 h-5 w-px bg-border" aria-hidden />
                    <Button asChild variant="ghost" size="sm">
                        <Link to="/login">{t('nav.client_portal')}</Link>
                    </Button>
                    <Button asChild size="sm" className="ml-1">
                        <Link to="/signup">{t('nav.get_started')}</Link>
                    </Button>
                </div>

                <button
                    className="-mr-2 ml-auto rounded-md p-2 text-foreground hover:bg-muted lg:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isOpen}
                >
                    {isOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </button>
            </div>

            {isOpen && (
                <div className="page-gutter border-t border-border bg-background pb-6 pt-2 lg:hidden">
                    <nav aria-label="Main" className="flex flex-col">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                className="border-b border-border py-3.5 font-display text-xl"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-4 flex items-center gap-1">
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        <Button asChild variant="outline">
                            <Link to="/login">{t('nav.client_portal')}</Link>
                        </Button>
                        <Button asChild>
                            <Link to="/signup">{t('nav.get_started')}</Link>
                        </Button>
                    </div>
                </div>
            )}
        </header>
    );
};
