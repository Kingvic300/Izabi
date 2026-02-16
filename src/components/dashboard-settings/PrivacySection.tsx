import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, DownloadCloud, Radio, Shield } from 'lucide-react';
import SettingRow from './SettingRow';
import type { SettingsState } from './settingsTypes';

type PrivacySectionProps = {
    settings: SettingsState;
    isSaving: boolean;
    onToggle: (key: keyof SettingsState, value?: boolean) => void;
    onDownloadData: () => void;
};

export default function PrivacySection({
    settings,
    isSaving,
    onToggle,
    onDownloadData,
}: PrivacySectionProps) {
    return (
        <Card className="settings-card glass border-foreground/5 rounded-2xl shadow-2xl overflow-hidden">
            <CardHeader className="px-6 py-4 md:px-8 md:py-6 border-b border-foreground/5">
                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                    <Shield className="text-primary" />
                    Data & Privacy
                </CardTitle>
                <CardDescription>
                    Control your digital footprint visibility
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <SettingRow
                    title="Public Scholar Profile"
                    description="Allow other students to view your achievements"
                    isChecked={settings.publicProfile}
                    onToggle={(checked) => onToggle('publicProfile', checked)}
                    icon={<Radio size={20} />}
                    badge="Beta"
                />

                <div className="p-4 sm:p-8 bg-foreground/[0.02]">
                    <div className="rounded-xl border border-foreground/5 p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 bg-background/20">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <DownloadCloud size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">
                                    Export Data Archive
                                </h3>
                                <p className="text-sm opacity-60">
                                    Download all your notes and history
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={onDownloadData}
                            disabled={isSaving}
                            className="h-11 sm:h-12 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground border border-foreground/10 font-bold px-4 sm:px-6 w-full md:w-auto md:min-w-[180px]"
                        >
                            {isSaving ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-xl animate-spin" />{' '}
                                    Packaging...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Download <Download size={16} />
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
