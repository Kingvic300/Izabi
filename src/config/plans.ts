export type Plan = {
    name: string;
    slug: string;
    price: string;
    desc: string;
    features: string[];
    featured: boolean;
};

export const PLANS: Plan[] = [
    {
        name: 'Free',
        slug: 'free-scholar',
        price: '₦0',
        desc: 'To get started',
        features: [
            '5 documents a day',
            '20 AI messages a day',
            'Summaries and quizzes',
            'All five languages',
        ],
        featured: false,
    },
    {
        name: 'Pro',
        slug: 'pro-scholar',
        price: '₦1,999',
        desc: 'For weekly revision',
        features: [
            '15 documents a day',
            '30 AI messages a day',
            'Detailed summaries',
            'Unlimited quizzes and flashcards',
            'Audio summaries',
            'Priority support',
        ],
        featured: true,
    },
    {
        name: 'Premium',
        slug: 'premium-scholar',
        price: '₦2,999',
        desc: 'For exam season',
        features: [
            '30 documents a day',
            '45 AI messages a day',
            'Everything in Pro',
            'JAMB and WAEC mock exams',
            'Performance analytics',
            'Custom study plans',
        ],
        featured: false,
    },
];
