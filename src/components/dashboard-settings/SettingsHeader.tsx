type SettingsHeaderProps = {
    subtitle?: string;
};

export default function SettingsHeader({
    subtitle = 'Customize your neural interface and alerts',
}: SettingsHeaderProps) {
    return (
        <div className="settings-header">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter leading-none mb-2">
                Tune your <span className="text-gradient">workspace</span>
            </h1>
            <p className="text-muted-foreground font-medium text-base sm:text-lg">
                {subtitle}
            </p>
        </div>
    );
}
