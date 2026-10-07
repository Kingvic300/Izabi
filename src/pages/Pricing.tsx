import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    DefinitionRows,
    MarketingPage,
    MarketingSection,
} from '@/components/marketing/MarketingPage';
import { PricingTable } from '@/components/marketing/PricingTable';
import { useLanguage } from '@/contexts/LanguageContext';

const QUESTIONS = [
    {
        term: 'Can I cancel at any time?',
        detail: 'Yes. Plans are monthly, and you can stop your subscription whenever you want without a fee.',
    },
    {
        term: 'How do I pay?',
        detail: 'Payments go through Paystack, so you can use the card or bank options it offers in Nigeria.',
    },
    {
        term: 'Do you have school or group prices?',
        detail: 'Yes. Contact us with the size of your class or group and we will send a price.',
    },
];

const Pricing = () => {
    const { t } = useLanguage();

    return (
        <MarketingPage title={t('pricing.title')} intro={t('pricing.subtitle')}>
            <section className="page-gutter border-b border-border py-14 sm:py-20">
                <PricingTable />
            </section>

            <MarketingSection title="About paying">
                <DefinitionRows items={QUESTIONS} />
            </MarketingSection>

            <section className="page-gutter py-16 sm:py-20">
                <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-[1.75rem] sm:text-[2rem]">
                            Not sure which plan fits?
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            Start free. You can upgrade from your dashboard
                            whenever you need more.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Button asChild size="lg">
                            <Link to="/signup">Start free</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link to="/contact">Ask us</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </MarketingPage>
    );
};

export default Pricing;
