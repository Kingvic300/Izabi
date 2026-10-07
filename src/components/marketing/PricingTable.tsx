import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { PLANS } from '@/config/plans';
import { cn } from '@/lib/utils';

export function PricingTable() {
    const { t } = useLanguage();

    return (
        <div className="grid grid-cols-1 overflow-hidden rounded-lg border border-border bg-card lg:grid-cols-3">
            {PLANS.map((plan, i) => (
                <div
                    key={plan.slug}
                    className={cn(
                        'relative flex flex-col p-6 sm:p-8',
                        i > 0 &&
                            'border-t border-border lg:border-l lg:border-t-0',
                        plan.featured &&
                            'before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-foreground',
                    )}
                >
                    <div className="flex items-baseline justify-between gap-4">
                        <h3 className="text-2xl">{plan.name}</h3>
                        {plan.featured && (
                            <span className="mark-highlight text-sm font-bold">
                                {t('home.pricing.popular')}
                            </span>
                        )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {plan.desc}
                    </p>
                    <p className="mt-6 flex items-baseline gap-1">
                        <span className="tabular font-display text-4xl">
                            {plan.price}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {t('home.pricing.month')}
                        </span>
                    </p>
                    <ul className="mt-6 flex-1 space-y-2.5 text-[15px]">
                        {plan.features.map((f) => (
                            <li key={f} className="flex gap-2.5">
                                <Check className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                                {f}
                            </li>
                        ))}
                    </ul>
                    <Button
                        asChild
                        variant={plan.featured ? 'default' : 'outline'}
                        className="mt-8 w-full"
                    >
                        <Link to={`/signup?plan=${plan.slug}`}>
                            {t('home.pricing.choose').replace(
                                '{plan}',
                                plan.name,
                            )}
                        </Link>
                    </Button>
                </div>
            ))}
        </div>
    );
}
