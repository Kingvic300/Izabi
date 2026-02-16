import { Zap } from 'lucide-react';
import { USAGE_LIMITS_ENABLED } from '@/config/featureFlags';
import type { Subscription, Usage } from './progressTypes';

type UsageBannerProps = {
    usage: Usage;
    subscription: Subscription | null;
};

export default function UsageBanner({ usage, subscription }: UsageBannerProps) {
    return (
        <div className="p-1 rounded-3xl bg-primary/10 border border-primary/10">
            <div className="glass-card rounded-[22px] p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center md:text-left">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 animate-pulse">
                        <Zap className="text-primary" size={32} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tight">
                            {USAGE_LIMITS_ENABLED
                                ? subscription?.status === 'premium'
                                    ? 'PREMIUM ACCESS ACTIVE'
                                    : 'FREE TIER LIMITS'
                                : 'UNLIMITED ACCESS ACTIVE'}
                        </h2>
                        <p className="text-sm opacity-60 font-medium">
                            {USAGE_LIMITS_ENABLED
                                ? subscription?.status === 'premium'
                                    ? `Unlimited usage until ${new Date(
                                          subscription?.expiry || Date.now(),
                                      ).toLocaleDateString()}`
                                    : 'Upgrade to remove daily processing restrictions.'
                                : 'Usage limits are disabled while we onboard new scholars.'}
                        </p>
                    </div>
                </div>

                <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                    <div className="text-center">
                        <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">
                            Uploads
                        </p>
                        <div className="text-2xl font-black">
                            {USAGE_LIMITS_ENABLED && usage.limits
                                ? `${usage.dailyDocs} / ${usage.limits.dailyDocs}`
                                : `${usage.dailyDocs} / Unlimited`}
                        </div>
                        {USAGE_LIMITS_ENABLED && usage.limits && (
                            <div className="w-24 h-1.5 bg-foreground/10 rounded-full mt-2 overflow-hidden mx-auto">
                                <div
                                    className="h-full bg-primary transition-all duration-1000"
                                    style={{
                                        width: `${(usage.dailyDocs / usage.limits.dailyDocs) * 100}%`,
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">
                            AI Chats
                        </p>
                        <div className="text-2xl font-black">
                            {USAGE_LIMITS_ENABLED && usage.limits
                                ? `${usage.dailyMessages} / ${usage.limits.dailyMessages}`
                                : `${usage.dailyMessages} / Unlimited`}
                        </div>
                        {USAGE_LIMITS_ENABLED && usage.limits && (
                            <div className="w-24 h-1.5 bg-foreground/10 rounded-full mt-2 overflow-hidden mx-auto">
                                <div
                                    className="h-full bg-primary transition-all duration-1000"
                                    style={{
                                        width: `${(usage.dailyMessages / usage.limits.dailyMessages) * 100}%`,
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
