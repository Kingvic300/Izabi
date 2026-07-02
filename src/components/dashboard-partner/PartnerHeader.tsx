export default function PartnerHeader() {
    return (
        <div className="prog-header space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-xl border border-foreground/10">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-primary">
                    Accountability Partner
                </span>
            </div>
            <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                    Study Together, Stay Consistent
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-2xl">
                    Pair up with a real study partner, set a shared goal, and
                    keep each other accountable.
                </p>
            </div>
        </div>
    );
}
