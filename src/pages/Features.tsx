import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    DefinitionRows,
    MarketingPage,
    MarketingSection,
} from '@/components/marketing/MarketingPage';

const GROUPS = [
    {
        title: 'Make study material',
        intro: 'Start from a PDF, a Word file, a photo of your notes, or just the name of a topic.',
        items: [
            {
                term: 'Summaries',
                detail: 'The chapter in plain words, with the key terms marked so you can scan it before a test.',
            },
            {
                term: 'Quizzes',
                detail: 'Objective and theory questions from your own material. Pick the difficulty before you start.',
            },
            {
                term: 'Flashcards',
                detail: 'A term on the front, the meaning on the back. Flip through them on the bus.',
            },
            {
                term: 'Study guides',
                detail: 'The topics in the order you should learn them, with what each one covers.',
            },
            {
                term: 'Audio summaries',
                detail: 'Listen to any summary read aloud, in your chosen language.',
            },
            {
                term: 'Pick your pages',
                detail: 'Long textbook? Choose only the pages you need from a PDF before generating.',
            },
        ],
    },
    {
        title: 'Practise for the exam',
        intro: 'Questions that feel like the real paper, and feedback that tells you why.',
        items: [
            {
                term: 'Past-question practice',
                detail: 'Practise for JAMB, WAEC, JUPEB and university course exams.',
            },
            {
                term: 'Quick test',
                detail: 'A five-minute timed set when you only have a short break.',
            },
            {
                term: 'Practice skills',
                detail: 'Short drills that build reasoning, not just memory.',
            },
            {
                term: 'Study tricks',
                detail: 'Memory techniques and ways to explain a topic simply, so it stays with you.',
            },
        ],
    },
    {
        title: 'Ask when you are stuck',
        intro: 'An assistant that has read the same notes you have.',
        items: [
            {
                term: 'AI study assistant',
                detail: 'Ask about anything in your notes. Get an explanation, an example, or a simpler version.',
            },
            {
                term: 'History',
                detail: 'Every file you have uploaded and everything you made from it, in one place.',
            },
        ],
    },
    {
        title: 'Keep going every day',
        intro: 'Small daily wins add up faster than one long night before the exam.',
        items: [
            {
                term: 'Brain Drop',
                detail: 'One question every morning. Answer it to keep your streak alive.',
            },
            {
                term: 'Streaks and your study owl',
                detail: 'Your owl levels up as you keep at it. Streak freezes cover the days you cannot study.',
            },
            {
                term: 'Leaderboard',
                detail: 'Earn points for practice and see where you rank.',
            },
            {
                term: 'Study partner',
                detail: 'Invite a friend, see each other’s progress, and keep each other honest.',
            },
            {
                term: 'Progress',
                detail: 'See which topics you have covered and where your scores are weakest.',
            },
        ],
    },
    {
        title: 'Works the way you do',
        intro: 'Made for Nigerian students, on the phone you already have.',
        items: [
            {
                term: 'Five languages',
                detail: 'English, Pidgin, Yorùbá, Igbo and Hausa, for the app and for what Izabi writes.',
            },
            {
                term: 'Any file you have',
                detail: 'PDF, Word, text and images, up to 25 MB each and five files at a time.',
            },
            {
                term: 'Phone first',
                detail: 'Every screen works on a small phone. Light and dark themes follow your phone setting.',
            },
        ],
    },
];

const Features = () => {
    return (
        <MarketingPage
            title="Everything Izabi does"
            intro="Upload once. Read the summary, test yourself, ask questions, and come back tomorrow. Here is each part."
        >
            {GROUPS.map((group) => (
                <MarketingSection
                    key={group.title}
                    title={group.title}
                    intro={group.intro}
                >
                    <DefinitionRows items={group.items} />
                </MarketingSection>
            ))}

            <section className="page-gutter py-16 sm:py-20">
                <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                    <h2 className="text-[1.75rem] sm:text-[2rem]">
                        Try it with your next topic.
                    </h2>
                    <Button asChild size="lg">
                        <Link to="/signup">Create a free account</Link>
                    </Button>
                </div>
            </section>
        </MarketingPage>
    );
};

export default Features;
