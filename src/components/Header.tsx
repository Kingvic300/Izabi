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
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: t('nav.features'), href: '/features' },
        { name: t('nav.how_it_works'), href: '/how-it-works' },
        { name: t('nav.pricing'), href: '/pricing' },
        { name: t('nav.about'), href: '/about' },
    ].filter((link) => PRICING_ENABLED || link.href !== '/pricing');

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-colors',
                scrolled || isOpen
                    ? 'bg-background/95 border-b border-border'
                    : 'bg-transparent border-b border-transparent',
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-6 h-16">
                    <Link to="/" className="flex items-center shrink-0">
                        <Logo size={150} height={56} />
                    </Link>

                    {/* Desktop links */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                className={cn(
                                    'px-3 py-2 text-sm font-medium whitespace-nowrap rounded-md transition-colors',
                                    location.pathname === link.href
                                        ? 'text-foreground'
                                        : 'text-muted-foreground hover:text-foreground',
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop actions */}
                    <div className="hidden lg:flex items-center gap-2 shrink-0">
                        <LanguageToggle />
                        <ThemeToggle />
                        <Link to="/login">
                            <Button variant="ghost" size="sm">
                                {t('nav.client_portal')}
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button size="sm" className="whitespace-nowrap">
                                {t('nav.get_early_access')}
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="lg:hidden border-t border-border bg-background px-4 sm:px-6 py-4 space-y-4">
                    <div className="flex flex-col">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                onClick={() => setIsOpen(false)}
                                className="py-2.5 text-base font-medium"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Link to="/login" onClick={() => setIsOpen(false)}>
                            <Button variant="outline" className="w-full">
                                {t('nav.client_portal')}
                            </Button>
                        </Link>
                        <Link to="/signup" onClick={() => setIsOpen(false)}>
                            <Button className="w-full">
                                {t('nav.get_started')}
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};
