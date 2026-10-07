import type { StreakSummary } from './partnerTypes';
import { StatStrip } from '@/components/dashboard/StatStrip';

type PartnerStatCardsProps = {
    streaks: StreakSummary | null;
};

const days = (n: number) => (n === 1 ? 'day' : 'days');

export default function PartnerStatCards({ streaks }: PartnerStatCardsProps) {
    const you = streaks?.yourStreak ?? 0;
    const partner = streaks?.partnerStreak ?? 0;
    const shared = streaks?.sharedStreak ?? 0;
    return (
        <StatStrip
            items={[
                { label: 'Your streak', value: you, unit: days(you) },
                { label: 'Their streak', value: partner, unit: days(partner) },
                {
                    label: 'Both of you',
                    value: shared,
                    unit: days(shared),
                    note: 'Days you both studied',
                },
            ]}
        />
    );
}
