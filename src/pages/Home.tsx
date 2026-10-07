import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Bubble } from '@/components/ui/bubble';
import { AnswerSheetDemo } from '@/components/home/AnswerSheetDemo';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations, type Language } from '@/contexts/translations';
import { PRICING_ENABLED } from '@/config/featureFlags';
import { TESTIMONIALS } from '@/config/testimonials';
import { PricingTable } from '@/components/marketing/PricingTable';
import { cn } from '@/lib/utils';

const LANGUAGE_SAMPLES: { code: Language; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'pidgin', name: 'Pidgin' },
    { code: 'yoruba', name: 'Yorùbá' },
    { code: 'igbo', name: 'Igbo' },
    { code: 'hausa', name: 'Hausa' },
];



// 21 days ending today; the last nine are a running streak.
const STREAK_DAYS = Array.from({ length: 21 }, (_, i) => ({
    studied: i >= 12 || i === 3 || i === 4 || i === 7 || i === 9,
    today: i === 20,
}));

function SectionHeading({
    id,
    title,
    body,
    className,
}: {
    id?: string;
    title: string;
    body?: string;
    className?: string;
}) {
    return (
        <div className={cn('max-w-[34rem]', className)}>
            <h2
                id={id}
                className="text-[2rem] leading-[1.1] sm:text-[2.5rem]"
            >
                {title}
            </h2>
            {body && (
                <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted-foreground">
                    {body}
                </p>
            )}
        </div>
    );
}

const Home = () => {
    const { t } = useLanguage();

    const outputs = [
        {
            name: 'Summary',
            desc: 'The chapter in plain words, key terms marked.',
            sample: (
                <p className="text-[15px] leading-relaxed">
                    The <mark className="mark-highlight">cell</mark> is the
                    basic unit of life. Plant cells have a{' '}
                    <mark className="mark-highlight">cell wall</mark> and{' '}
                    <mark className="mark-highlight">chloroplasts</mark>;
                    animal cells do not.
                </p>
            ),
        },
        {
            name: 'Quiz',
            desc: 'Objective and theory questions, marked as you go.',
            sample: (
                <div className="flex items-center gap-3 text-[15px]">
                    <span className="tabular font-bold text-sheet">12.</span>
                    <div className="flex gap-2">
                        <Bubble label="A" size="sm" />
                        <Bubble label="B" size="sm" />
                        <Bubble label="C" size="sm" state="correct" />
                        <Bubble label="D" size="sm" />
                    </div>
                </div>
            ),
        },
        {
            name: 'Flashcards',
            desc: 'Term on the front, meaning on the back.',
            sample: (
                <div className="grid max-w-sm grid-cols-2 overflow-hidden rounded-md border border-border text-sm">
                    <div className="p-3 font-display text-base">
                        Mitochondrion
                    </div>
                    <div className="border-l border-dashed border-border bg-muted/50 p-3 text-muted-foreground">
                        Releases energy during respiration
                    </div>
                </div>
            ),
        },
        {
            name: 'Study guide',
            desc: 'What to learn, in the order to learn it.',
            sample: (
                <ol className="space-y-1 text-[15px]">
                    {[
                        'Cell structure',
                        'Cell division',
                        'Transport across membranes',
                    ].map((topic, i) => (
                        <li key={topic} className="flex gap-3">
                            <span className="tabular w-4 text-muted-foreground">
                                {i + 1}
                            </span>
                            {topic}
                        </li>
                    ))}
                </ol>
            ),
        },
        {
            name: 'Audio summary',
            desc: 'Listen on the bus, in your own language.',
            sample: (
                <div className="inline-flex items-center gap-3 rounded-full border border-border py-1.5 pl-1.5 pr-4 text-sm">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background">
                        <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
                    </span>
                    Cell structure, in Yorùbá
                    <span className="tabular text-muted-foreground">4:12</span>
                </div>
            ),
        },
    ];

    const steps = [
        { title: t('how.step1.title'), desc: t('how.step1.desc') },
        { title: t('how.step2.title'), desc: t('how.step2.desc') },
        { title: t('how.step3.title'), desc: t('how.step3.desc') },
    ];

    const habits = [
        {
            term: 'Brain Drop',
            detail: 'One question every morning. Answer it to keep your streak.',
        },
        {
            term: 'Streak freezes',
            detail: 'Miss a day for a good reason without losing your run.',
        },
        {
            term: 'Leaderboard',
            detail: 'Earn points for practice and see where you stand.',
        },
        {
            term: 'Study partner',
            detail: 'Pair with a friend and see each other’s progress.',
        },
    ];

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-background">
                <Header />

                <main>
                    {/* Hero */}
                    <section className="page-gutter pb-16 pt-28 sm:pb-24 sm:pt-32 lg:pt-36">
                        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-16">
                            <div className="lg:col-span-5 lg:pt-6">
                                <h1 className="max-w-[13ch] text-[2.75rem] leading-[1.04] sm:text-6xl xl:text-[4.5rem]">
                                    {t('hero.title_top')}{' '}
                                    {t('hero.title_bottom')}
                                </h1>
                                <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-muted-foreground">
                                    {t('hero.tagline')}
                                </p>
                                <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
                                    <Button asChild size="lg">
                                        <Link to="/signup">
                                            {t('hero.cta')}
                                        </Link>
                                    </Button>
                                    <Button asChild variant="link">
                                        <a href="#how-it-works">
                                            {t('hero.view_env')}
                                        </a>
                                    </Button>
                                </div>
                            </div>

                            <div className="lg:col-span-7">
                                <AnswerSheetDemo />
                            </div>
                        </div>
                    </section>

                    {/* What one upload gives you */}
                    <section
                        aria-labelledby="outputs-title"
                        className="page-gutter border-t border-border py-20 sm:py-28"
                    >
                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-16">
                            <div className="lg:col-span-5">
                                <div className="lg:sticky lg:top-28">
                                    <SectionHeading
                                        id="outputs-title"
                                        title={t('home.upload.title')}
                                        body={t('home.upload.body')}
                                    />
                                    <p className="mt-6 text-sm text-muted-foreground">
                                        {t('features.subtitle')}
                                    </p>
                                </div>
                            </div>

                            <dl className="divide-y divide-border border-y border-border lg:col-span-7">
                                {outputs.map((o) => (
                                    <div
                                        key={o.name}
                                        className="grid grid-cols-1 gap-x-8 gap-y-3 py-7 sm:grid-cols-[11rem_1fr]"
                                    >
                                        <dt>
                                            <span className="block font-display text-xl">
                                                {o.name}
                                            </span>
                                            <span className="mt-1 block text-sm text-muted-foreground">
                                                {o.desc}
                                            </span>
                                        </dt>
                                        <dd className="self-center">
                                            {o.sample}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </section>

                    {/* How it works */}
                    <section
                        id="how-it-works"
                        aria-labelledby="how-title"
                        className="scroll-mt-20 border-t border-border bg-card py-20 sm:py-28"
                    >
                        <div className="page-gutter">
                            <SectionHeading
                                id="how-title"
                                title={t('how.subtitle')}
                            />
                            <ol className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-0">
                                {steps.map((step, i) => (
                                    <li
                                        key={step.title}
                                        className="relative md:pr-10"
                                    >
                                        <div className="flex items-center">
                                            <Bubble
                                                label={i + 1}
                                                state="filled"
                                                size="lg"
                                                className="text-base"
                                            />
                                            {i < steps.length - 1 && (
                                                <span
                                                    aria-hidden
                                                    className="ml-4 hidden h-px flex-1 bg-sheet/40 md:block"
                                                />
                                            )}
                                        </div>
                                        <h3 className="mt-6 text-2xl">
                                            {step.title}
                                        </h3>
                                        <p className="mt-2 max-w-[22rem] text-muted-foreground">
                                            {step.desc}
                                        </p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </section>

                    {/* Languages */}
                    <section
                        aria-labelledby="lang-title"
                        className="page-gutter border-t border-border py-20 sm:py-28"
                    >
                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-16">
                            <SectionHeading
                                id="lang-title"
                                title={t('home.lang.title')}
                                body={t('home.lang.body')}
                                className="lg:col-span-5"
                            />
                            <ul className="divide-y divide-border border-y border-border lg:col-span-7">
                                {LANGUAGE_SAMPLES.map((l) => (
                                    <li
                                        key={l.code}
                                        lang={
                                            l.code === 'en' || l.code === 'pidgin'
                                                ? 'en'
                                                : l.code === 'yoruba'
                                                  ? 'yo'
                                                  : l.code === 'igbo'
                                                    ? 'ig'
                                                    : 'ha'
                                        }
                                        className="grid grid-cols-1 gap-x-8 gap-y-1 py-5 sm:grid-cols-[7rem_1fr] sm:items-baseline"
                                    >
                                        <span className="text-sm text-muted-foreground">
                                            {l.name}
                                        </span>
                                        <span className="font-display text-xl leading-snug sm:text-[1.375rem]">
                                            {translations[l.code][
                                                'dashboard.intro'
                                            ] ?? translations.en['dashboard.intro']}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* Habit */}
                    <section
                        aria-labelledby="habit-title"
                        className="page-gutter border-t border-border py-20 sm:py-28"
                    >
                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-16">
                            <div className="lg:col-span-5">
                                <SectionHeading
                                    id="habit-title"
                                    title={t('home.habit.title')}
                                    body={t('home.habit.body')}
                                />
                                <figure className="mt-10">
                                    <div className="grid w-fit grid-cols-7 gap-2.5">
                                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(
                                            (d, i) => (
                                                <span
                                                    key={i}
                                                    className="w-8 text-center text-xs text-muted-foreground"
                                                    aria-hidden
                                                >
                                                    {d}
                                                </span>
                                            ),
                                        )}
                                        {STREAK_DAYS.map((day, i) => (
                                            <Bubble
                                                key={i}
                                                size="md"
                                                state={
                                                    day.studied
                                                        ? 'filled'
                                                        : 'empty'
                                                }
                                                className={cn(
                                                    day.today &&
                                                        'ring-2 ring-highlight ring-offset-2 ring-offset-background',
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <figcaption className="mt-4 text-sm text-muted-foreground">
                                        {t('home.habit.streak')}
                                    </figcaption>
                                </figure>
                            </div>

                            <dl className="grid grid-cols-1 gap-x-10 gap-y-8 self-center sm:grid-cols-2 lg:col-span-7">
                                {habits.map((h) => (
                                    <div
                                        key={h.term}
                                        className="border-t-2 border-foreground pt-4"
                                    >
                                        <dt className="font-display text-xl">
                                            {h.term}
                                        </dt>
                                        <dd className="mt-2 text-muted-foreground">
                                            {h.detail}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </section>

                    {/* Testimonials */}
                    <section
                        aria-labelledby="voices-title"
                        className="border-t border-border bg-card py-20 sm:py-28"
                    >
                        <div className="page-gutter">
                            <h2
                                id="voices-title"
                                className="text-[2rem] sm:text-[2.5rem]"
                            >
                                {t('home.voices.title')}
                            </h2>
                            <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-border">
                                {TESTIMONIALS.slice(0, 3).map((item) => (
                                    <figure
                                        key={item.name}
                                        className="md:px-8 md:first:pl-0 md:last:pr-0"
                                    >
                                        <blockquote className="font-display text-xl italic leading-snug sm:text-[1.375rem]">
                                            “{item.quote}”
                                        </blockquote>
                                        <figcaption className="mt-5 text-sm">
                                            <span className="font-bold">
                                                {item.name}
                                            </span>
                                            <span className="text-muted-foreground">
                                                , {item.role}
                                            </span>
                                        </figcaption>
                                    </figure>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Pricing */}
                    {PRICING_ENABLED && (
                        <section
                            id="pricing"
                            aria-labelledby="pricing-title"
                            className="page-gutter border-t border-border py-20 sm:py-28"
                        >
                            <SectionHeading
                                id="pricing-title"
                                title={t('pricing.title')}
                                body={t('pricing.subtitle')}
                            />
                            <div className="mt-12">
                                <PricingTable />
                            </div>
                        </section>
                    )}

                    {/* Closing call to action */}
                    <section className="page-gutter border-t border-sheet/35 py-20 sm:py-28">
                        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
                            <div>
                                <h2 className="max-w-[18ch] text-[2.25rem] leading-[1.08] sm:text-5xl">
                                    {t('cta.upgrade')}
                                </h2>
                                <p className="mt-4 text-lg text-muted-foreground">
                                    {t('cta.tagline')}
                                </p>
                            </div>
                            <Button asChild size="lg" className="shrink-0">
                                <Link to="/signup">{t('hero.cta')}</Link>
                            </Button>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </ErrorBoundary>
    );
};

export default Home;
