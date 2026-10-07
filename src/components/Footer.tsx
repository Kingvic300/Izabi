import { Logo } from '@/components/Logo';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { PRICING_ENABLED } from '@/config/featureFlags';

export const Footer = () => {
    const { t } = useLanguage();

    const columns = [
        {
            title: 'Product',
            links: [
                { label: t('nav.features'), href: '/features' },
                { label: t('nav.how_it_works'), href: '/how-it-works' },
                ...(PRICING_ENABLED
                    ? [{ label: t('nav.pricing'), href: '/pricing' }]
                    : []),
                { label: 'Leaderboard', href: '/leaderboard' },
            ],
        },
        {
            title: 'Company',
            links: [
                { label: t('nav.about'), href: '/about' },
                { label: 'Student stories', href: '/testimonials' },
                { label: 'Contact', href: '/contact' },
                { label: 'FAQ', href: '/faq' },
            ],
        },
        {
            title: 'Account',
            links: [
                { label: t('nav.client_portal'), href: '/login' },
                { label: t('nav.get_started'), href: '/signup' },
            ],
        },
    ];

    return (
        <footer className="border-t border-border bg-background">
            <div className="page-gutter grid grid-cols-1 gap-12 py-14 sm:py-16 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-5">
                    <Link
                        to="/"
                        className="inline-flex rounded-md"
                        aria-label="Izabi home"
                    >
                        <Logo height={30} />
                    </Link>
                    <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
                        Summaries, quizzes and flashcards made from your own
                        notes, in English, Pidgin, Yorùbá, Igbo and Hausa.
                    </p>
                </div>

                <nav
                    aria-label="Footer"
                    className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7"
                >
                    {columns.map((col) => (
                        <div key={col.title}>
                            <h2 className="font-sans text-sm font-bold">
                                {col.title}
                            </h2>
                            <ul className="mt-3 space-y-0.5">
                                {col.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            to={link.href}
                                            className="inline-flex min-h-9 items-center text-[15px] text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>
            </div>
            <div className="page-gutter border-t border-border py-6 text-sm text-muted-foreground">
                <p>{t('footer.copyright')}</p>
            </div>
        </footer>
    );
};
