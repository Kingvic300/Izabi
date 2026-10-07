import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    DefinitionRows,
    MarketingPage,
    MarketingSection,
} from '@/components/marketing/MarketingPage';

const PRINCIPLES = [
    {
        term: 'Practice over rereading',
        detail: 'Testing yourself is what makes things stick. Every tool in Izabi ends in a question you have to answer.',
    },
    {
        term: 'Built for local exams',
        detail: 'JAMB, WAEC, JUPEB and university courses, with examples and explanations that fit how they are taught here.',
    },
    {
        term: 'Your language, not ours',
        detail: 'Some topics only click in the language you grew up with. That is why Izabi works in five.',
    },
    {
        term: 'Open to every student',
        detail: 'A free plan, prices in naira, and screens that work on any phone.',
    },
];

const TEAM = [
    {
        name: 'Oladimeji Victor',
        role: 'Full-stack engineer',
        bio: 'Builds and maintains Izabi across the app, the server and deployment.',
    },
    {
        name: 'Ayodeji Adesegun',
        role: 'AI and ML engineer',
        bio: 'Designs and improves the AI systems that write your summaries and questions.',
    },
    {
        name: 'Opemipo Akinwumi',
        role: 'Product manager',
        bio: 'Plans what we build next, based on what students actually need.',
    },
    {
        name: 'Oluwa Pelumi Oyetade',
        role: 'Product designer',
        bio: 'Designs the screens you use every day.',
    },
];

const About = () => {
    return (
        <MarketingPage
            title="Why we built Izabi"
            intro="Students spend hours rereading notes and very little time testing themselves. Izabi turns the notes you already have into practice, in the language you think in."
        >
            <MarketingSection title="Where it started">
                <div className="max-w-[40rem] space-y-5 text-[1.0625rem] leading-relaxed">
                    <p>
                        We kept seeing the same thing: students with good notes
                        and good intentions, losing whole evenings to copying
                        and rereading. The tools around them had not caught up
                        with how they actually study.
                    </p>
                    <p>
                        In 2023 we started Izabi with one goal: use AI to give
                        every student a study partner that knows their syllabus,
                        speaks their language, and is there at midnight before
                        the exam.
                    </p>
                </div>
            </MarketingSection>

            <MarketingSection title="What we care about">
                <DefinitionRows items={PRINCIPLES} />
            </MarketingSection>

            <MarketingSection title="The team">
                <ul className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
                    {TEAM.map((person) => (
                        <li
                            key={person.name}
                            className="border-t-2 border-foreground pt-4"
                        >
                            <p className="font-display text-xl">
                                {person.name}
                            </p>
                            <p className="mt-0.5 text-sm font-bold">
                                {person.role}
                            </p>
                            <p className="mt-2 text-muted-foreground">
                                {person.bio}
                            </p>
                        </li>
                    ))}
                </ul>
            </MarketingSection>

            <section className="page-gutter py-16 sm:py-20">
                <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                    <h2 className="max-w-[20ch] text-[1.75rem] sm:text-[2rem]">
                        Study with us this term.
                    </h2>
                    <Button asChild size="lg">
                        <Link to="/signup">Create a free account</Link>
                    </Button>
                </div>
            </section>
        </MarketingPage>
    );
};

export default About;
