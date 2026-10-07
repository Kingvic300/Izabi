import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bubble } from '@/components/ui/bubble';
import { MarketingPage } from '@/components/marketing/MarketingPage';

const STEPS = [
    {
        title: 'Add your material',
        body: 'Upload a PDF, Word file, text file or a photo of your notes. Up to five files at once, 25 MB each.',
        points: [
            'Choose only the pages you need from a long PDF',
            'No file? Start from the name of a topic',
        ],
    },
    {
        title: 'Pick what to make',
        body: 'Choose a summary, a quiz, flashcards or a study guide. Izabi writes it from your material, in the language you have selected.',
        points: [
            'Set the quiz difficulty before you start',
            'Play any summary as audio',
        ],
    },
    {
        title: 'Practise and check',
        body: 'Answer the questions. Every answer is marked straight away with a short explanation, so you know why, not just what.',
        points: [
            'Ask the AI assistant when something does not make sense',
            'Past-question practice for JAMB, WAEC, JUPEB and university exams',
        ],
    },
    {
        title: 'Come back tomorrow',
        body: 'Answer the daily Brain Drop question, keep your streak, and see on your progress page which topics need another look.',
        points: [
            'Streak freezes protect your run on busy days',
            'Invite a study partner to keep each other going',
        ],
    },
];

const HowItWorks = () => {
    return (
        <MarketingPage
            title="From notes to practice"
            intro="Four steps, the same every time."
        >
            <section className="page-gutter py-16 sm:py-20">
                <ol className="relative">
                    {STEPS.map((step, i) => (
                        <li
                            key={step.title}
                            data-reveal
                            className="relative grid grid-cols-[2.5rem_1fr] gap-x-5 pb-14 last:pb-0 sm:grid-cols-[2.5rem_1fr] sm:gap-x-8 lg:grid-cols-[2.5rem_minmax(0,28rem)_1fr]"
                        >
                            {i < STEPS.length - 1 && (
                                <span
                                    aria-hidden
                                    className="absolute bottom-0 left-5 top-12 w-px -translate-x-1/2 bg-sheet/35"
                                />
                            )}
                            <Bubble
                                label={i + 1}
                                state="filled"
                                size="lg"
                                className="text-base"
                            />
                            <div>
                                <h2 className="pt-1 text-[1.75rem] leading-tight">
                                    {step.title}
                                </h2>
                                <p className="mt-3 text-[1.0625rem] leading-relaxed text-muted-foreground">
                                    {step.body}
                                </p>
                            </div>
                            <ul className="col-start-2 mt-5 space-y-2 text-[15px] lg:col-start-3 lg:mt-2 lg:border-l lg:border-border lg:pl-8">
                                {step.points.map((p) => (
                                    <li key={p} className="flex gap-3">
                                        <span
                                            aria-hidden
                                            className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-sheet"
                                        />
                                        {p}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ol>
            </section>

            <section className="page-gutter border-t border-border py-16 sm:py-20">
                <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                    <h2 className="text-[1.75rem] sm:text-[2rem]">
                        Start with step one.
                    </h2>
                    <Button asChild size="lg">
                        <Link to="/signup">Create a free account</Link>
                    </Button>
                </div>
            </section>
        </MarketingPage>
    );
};

export default HowItWorks;
