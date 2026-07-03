'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Check,
    Zap,
    Crown,
    Sparkles,
    ArrowRight,
    Loader2,
    XCircle,
    Clock,
} from 'lucide-react';
import { api } from '@/lib/apiClient';
import { useAppToast } from '@/hooks/useAppToast';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useLanguage } from '@/contexts/LanguageContext';

const DashboardSubscription = () => {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [currentTier, setCurrentTier] = useState<'free' | 'pro' | 'premium'>(
        'free',
    );
    const [stats, setStats] = useState<any>(null);
    const appToast = useAppToast();

    useEffect(() => {
        fetchUserStats();
    }, []);

    const fetchUserStats = async () => {
        try {
            const res = await api.getUserStats();
            setStats(res.data);
            setCurrentTier(res.data.subscriptionStatus || 'free');
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpgrade = async (plan: 'pro_monthly' | 'premium_monthly') => {
        setLoading(true);
        try {
            const res = await api.startPayment(plan);

            if (res.authorization_url) {
                // Open Paystack payment page
                window.location.href = res.authorization_url;
            }
        } catch (err: any) {
            appToast.error({
                title: t('subscription.toast_payment_error_title'),
                description:
                    err.message ||
                    t('subscription.toast_payment_error_desc_fallback'),
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelAutoRenew = async () => {
        setLoading(true);
        try {
            const res = await api.cancelAutoRenew();
            appToast.success({
                title: t('subscription.toast_autorenew_cancelled_title'),
                description: res.message,
            });
            fetchUserStats();
        } catch (err: any) {
            appToast.error({
                title: t('subscription.toast_error_title'),
                description:
                    err.message ||
                    t('subscription.toast_cancel_failed_desc_fallback'),
            });
        } finally {
            setLoading(false);
        }
    };

    const plans = [
        {
            id: 'free',
            name: t('subscription.free_name'),
            price: '0',
            description: t('subscription.free_desc'),
            icon: Sparkles,
            color: 'text-blue-400',
            features: [
                t('subscription.free_f1'),
                t('subscription.free_f2'),
                t('subscription.free_f3'),
                t('subscription.free_f4'),
            ],
            cta: t('subscription.free_cta'),
            plan: null,
        },
        {
            id: 'pro',
            name: t('subscription.pro_name'),
            price: '1,999',
            description: t('subscription.pro_desc'),
            icon: Zap,
            color: 'text-primary',
            features: [
                t('subscription.pro_f1'),
                t('subscription.pro_f2'),
                t('subscription.pro_f3'),
                t('subscription.pro_f4'),
                t('subscription.pro_f5'),
                t('subscription.pro_f6'),
                t('subscription.pro_f7'),
            ],
            cta: t('subscription.pro_cta'),
            plan: 'pro_monthly' as const,
        },
        {
            id: 'premium',
            name: t('subscription.premium_name'),
            price: '2,999',
            description: t('subscription.premium_desc'),
            icon: Crown,
            color: 'text-yellow-500',
            features: [
                t('subscription.premium_f1'),
                t('subscription.premium_f2'),
                t('subscription.premium_f3'),
                t('subscription.premium_f4'),
                t('subscription.premium_f5'),
                t('subscription.premium_f6'),
                t('subscription.premium_f7'),
            ],
            cta: t('subscription.premium_cta'),
            plan: 'premium_monthly' as const,
        },
    ];

    return (
        <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 sm:py-10 pb-24 sm:pb-32">
            <ErrorBoundary>
                <div className="space-y-8 md:space-y-12">
                    {/* Header */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-xl border border-foreground/10">
                            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-primary">
                                {t('subscription.eyebrow')}
                            </span>
                        </div>
                        <div className="glass-card border-foreground/10 rounded-[28px] p-6 sm:p-8 text-center space-y-2 md:space-y-4">
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight">
                                {t('subscription.title_top')}{' '}
                                <span className="text-gradient">{t('subscription.title_gradient')}</span>
                            </h1>
                            <p className="text-muted-foreground text-sm md:text-lg max-w-none px-4">
                                {t('subscription.subtitle')}
                            </p>
                        </div>
                    </div>

                    {/* Current Usage Stats */}
                    {stats && (
                        <div className="w-full space-y-4">
                            <Card className="glass border-primary/20 rounded-3xl overflow-hidden shadow-xl">
                                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 md:p-6 pb-2">
                                    <CardTitle className="flex items-center gap-3 text-lg md:text-xl">
                                        <div className="w-2 h-5 bg-primary rounded-full hidden sm:block" />
                                        {t('subscription.your_usage')}
                                    </CardTitle>
                                    {stats.paystackSubscriptionCode && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    disabled={loading}
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 font-bold h-9 px-3 rounded-full text-xs"
                                                >
                                                    {loading ? (
                                                        <Loader2 className="animate-spin h-3 w-3 mr-2" />
                                                    ) : (
                                                        <XCircle
                                                            size={14}
                                                            className="mr-2"
                                                        />
                                                    )}
                                                    {t('subscription.cancel_autorenew')}
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="glass border-primary/20 rounded-3xl">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-xl font-black">
                                                        {t('subscription.cancel_autorenew_dialog_title')}
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription className="text-sm font-medium opacity-70">
                                                        {t('subscription.cancel_dialog_prefix')}
                                                        {new Date(
                                                            stats.subscriptionExpiry,
                                                        ).toLocaleDateString()}
                                                        {t('subscription.cancel_dialog_suffix')}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter className="gap-2">
                                                    <AlertDialogCancel className="rounded-xl border-foreground/10">
                                                        {t('subscription.keep_subscription')}
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={
                                                            handleCancelAutoRenew
                                                        }
                                                        className="rounded-xl bg-destructive hover:bg-destructive/90 text-white font-bold"
                                                    >
                                                        {t('subscription.yes_cancel_autorenew')}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </CardHeader>
                                <CardContent className="p-5 md:p-6 pt-0">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                        <div className="p-4 rounded-2xl bg-card/5 border border-foreground/5 space-y-1">
                                            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                                                {t('subscription.documents_label')}
                                            </p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl md:text-3xl font-black">
                                                    {stats.usage.dailyDocs}
                                                </span>
                                                <span className="text-xs opacity-40">
                                                    /{' '}
                                                    {
                                                        stats.usage.limits
                                                            .dailyDocs
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-card/5 border border-foreground/5 space-y-1">
                                            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                                                {t('subscription.ai_messages_label')}
                                            </p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl md:text-3xl font-black">
                                                    {stats.usage.dailyMessages}
                                                </span>
                                                <span className="text-xs opacity-40">
                                                    /{' '}
                                                    {
                                                        stats.usage.limits
                                                            .dailyMessages
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {stats.subscriptionExpiry &&
                                        stats.subscriptionStatus !== 'free' && (
                                            <div className="mt-5 pt-4 border-t border-foreground/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                                    <Clock
                                                        size={14}
                                                        className="opacity-50"
                                                    />
                                                    {t('subscription.plan_expires_on')}{' '}
                                                    <span className="font-bold text-foreground">
                                                        {new Date(
                                                            stats.subscriptionExpiry,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {stats.paystackSubscriptionCode ? (
                                                        <Badge className="bg-green-500/10 text-green-500 border-0 text-[10px] font-bold py-0.5 px-2">
                                                            {t('subscription.autorenew_active')}
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-amber-500/10 text-amber-500 border-0 text-[10px] font-bold py-0.5 px-2">
                                                            {t('subscription.autorenew_off')}
                                                        </Badge>
                                                    )}
                                                    <Badge className="bg-primary/10 text-primary border-0 text-[10px] font-bold py-0.5 px-2 uppercase tracking-tighter">
                                                        {
                                                            stats.subscriptionStatus
                                                        }
                                                    </Badge>
                                                </div>
                                            </div>
                                        )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Plans Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full pt-4 md:pt-8 px-2 md:px-0">
                        {plans.map((plan, idx) => {
                            const Icon = plan.icon;
                            const isCurrent = plan.id === currentTier;
                            const isUpgrade =
                                (plan.id === 'pro' && currentTier === 'free') ||
                                (plan.id === 'premium' &&
                                    (currentTier === 'free' ||
                                        currentTier === 'pro'));

                            return (
                                <motion.div
                                    key={plan.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="h-full"
                                >
                                    <Card
                                        className={cn(
                                            'glass relative overflow-hidden transition-all h-full flex flex-col rounded-[32px] border-foreground/5',
                                            plan.id === 'pro' &&
                                                'md:scale-105 z-10 border-primary/40 shadow-[0_0_40px_rgba(59,130,246,0.15)] bg-primary/5',
                                            isCurrent &&
                                                'ring-2 ring-primary ring-offset-4 ring-offset-background',
                                        )}
                                    >
                                        {plan.id === 'pro' && (
                                            <div className="absolute top-6 right-6 bg-primary text-primary-foreground px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 animate-pulse">
                                                {t('subscription.popular')}
                                            </div>
                                        )}

                                        <CardHeader className="p-6 md:p-8 pb-4">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div
                                                    className={`p-3 rounded-2xl bg-primary/20 shadow-inner`}
                                                >
                                                    <Icon
                                                        className={plan.color}
                                                        size={28}
                                                    />
                                                </div>
                                                {isCurrent && (
                                                    <Badge className="bg-primary/20 text-primary border-0 font-bold px-3 py-1">
                                                        {t('subscription.active_badge')}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <CardTitle className="text-2xl md:text-3xl font-black">
                                                    {plan.name}
                                                </CardTitle>
                                                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                                                    {plan.description}
                                                </p>
                                            </div>
                                            <div className="flex items-baseline gap-2 mt-8">
                                                <span className="text-xl font-bold opacity-40">
                                                    ₦
                                                </span>
                                                <span className="text-4xl md:text-5xl font-black tracking-tight">
                                                    {plan.price}
                                                </span>
                                                <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                                                    {t('subscription.per_month')}
                                                </span>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="flex-1 flex flex-col p-6 md:p-8 pt-0">
                                            <ul className="space-y-4 mb-8 flex-1">
                                                {plan.features.map(
                                                    (feature, i) => (
                                                        <li
                                                            key={i}
                                                            className="flex items-start gap-3 text-sm font-semibold opacity-80 leading-snug"
                                                        >
                                                            <Check
                                                                size={18}
                                                                className="text-primary shrink-0 mt-0.5"
                                                            />
                                                            <span>
                                                                {feature}
                                                            </span>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>

                                            <Button
                                                onClick={() =>
                                                    plan.plan &&
                                                    handleUpgrade(plan.plan)
                                                }
                                                disabled={
                                                    isCurrent ||
                                                    loading ||
                                                    !isUpgrade
                                                }
                                                className={cn(
                                                    'w-full h-14 md:h-16 font-black uppercase tracking-widest text-xs rounded-2xl transition-all active:scale-95',
                                                    plan.id === 'pro'
                                                        ? 'bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20'
                                                        : 'bg-foreground/5 hover:bg-foreground/10 border border-foreground/10',
                                                )}
                                            >
                                                {loading ? (
                                                    <Loader2
                                                        className="animate-spin"
                                                        size={20}
                                                    />
                                                ) : isCurrent ? (
                                                    t('subscription.current_scholar')
                                                ) : isUpgrade ? (
                                                    <>
                                                        {plan.cta}
                                                        <ArrowRight
                                                            size={16}
                                                            className="ml-2"
                                                        />
                                                    </>
                                                ) : (
                                                    t('subscription.master_active')
                                                )}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Footer Note */}
                    <div className="glass-card border-foreground/10 rounded-[28px] p-6 sm:p-8 text-center text-sm text-muted-foreground max-w-none space-y-4">
                        <p className="font-bold text-foreground">
                            {t('subscription.terms_title')}
                        </p>
                        <p>
                            {t('subscription.terms_body')}
                        </p>
                        <p className="opacity-60">
                            {t('subscription.terms_footer')}
                        </p>
                    </div>
                </div>
            </ErrorBoundary>
        </div>
    );
};

export default function DashboardSubscriptionPage() {
    return (
        <ErrorBoundary>
            <DashboardSubscription />
        </ErrorBoundary>
    );
}
