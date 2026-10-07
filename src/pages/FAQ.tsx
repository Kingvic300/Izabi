import { Link } from 'react-router-dom';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
    MarketingPage,
    MarketingSection,
} from '@/components/marketing/MarketingPage';

const FAQS = [
    {
        category: 'Getting started',
        items: [
            {
                q: 'How do I create an account?',
                a: 'Go to the sign-up page, enter your details, and confirm your email with the code we send you.',
            },
            {
                q: 'What file types can I upload?',
                a: 'PDF, Word (DOCX), plain text, and images such as JPG and PNG.',
            },
            {
                q: 'Are there upload limits?',
                a: 'Each file can be up to 25 MB, and you can add up to five files at once. How many documents you can process each day depends on your plan.',
            },
        ],
    },
    {
        category: 'Study tools',
        items: [
            {
                q: 'How are summaries made?',
                a: 'Izabi reads your uploaded material and writes a structured summary with the key terms marked, so you can revise from it quickly.',
            },
            {
                q: 'Can I change quiz difficulty?',
                a: 'Yes. Choose a difficulty level before you generate practice questions.',
            },
            {
                q: 'Which languages are supported?',
                a: 'English, Nigerian Pidgin, Yorùbá, Igbo and Hausa. Switching language changes both the app and what Izabi writes for you.',
            },
        ],
    },
    {
        category: 'Plans and privacy',
        items: [
            {
                q: 'How do I upgrade my plan?',
                a: 'Open the pricing page, choose a plan and pay. Your account updates as soon as the payment is confirmed.',
            },
            {
                q: 'Is my data safe?',
                a: 'Your files are only used to make your study material, and your personal data is handled according to our privacy policy.',
            },
            {
                q: 'Do you offer school or group plans?',
                a: 'Yes. Contact us for school and group pricing.',
            },
        ],
    },
];

const FAQ = () => {
    return (
        <MarketingPage
            title="Questions and answers"
            intro="Accounts, uploads, study tools and plans. If your question is not here, contact us."
        >
            {FAQS.map((group) => (
                <MarketingSection key={group.category} title={group.category}>
                    <Accordion
                        type="single"
                        collapsible
                        className="border-t border-border"
                    >
                        {group.items.map((item, i) => (
                            <AccordionItem
                                key={item.q}
                                value={`${group.category}-${i}`}
                                className="border-border"
                            >
                                <AccordionTrigger className="py-5 text-left font-display text-lg hover:no-underline [&[data-state=open]]:text-foreground">
                                    {item.q}
                                </AccordionTrigger>
                                <AccordionContent className="max-w-[40rem] pb-6 text-base leading-relaxed text-muted-foreground">
                                    {item.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </MarketingSection>
            ))}

            <section className="page-gutter py-16 sm:py-20">
                <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-[1.75rem] sm:text-[2rem]">
                            Still have a question?
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            Email or WhatsApp us.
                        </p>
                    </div>
                    <Button asChild size="lg" variant="outline">
                        <Link to="/contact">Contact us</Link>
                    </Button>
                </div>
            </section>
        </MarketingPage>
    );
};

export default FAQ;
