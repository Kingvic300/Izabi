import React from 'react';
import { Share2 } from 'lucide-react';

interface HeaderProps {
    userName?: string;
    onShareProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userName = 'Scholar', onShareProfile }) => {
    const todayLabel = new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });

    return (
        <header className="w-full pt-2 pb-6 border-b border-border">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                        <span>{todayLabel}</span>
                        <span>·</span>
                        <span>Document Workspace Active</span>
                    </div>

                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
                            <span>Welcome back,</span>
                            <span className="text-primary">{userName.split(' ')[0]}</span>
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-lg leading-relaxed">
                            Upload your syllabus or lecture documents, select target pages, and
                            synthesize practice modules.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 self-start md:self-end">
                    <button
                        type="button"
                        onClick={onShareProfile}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-2 px-3 rounded-xl border border-border hover:border-foreground/30 bg-transparent hover:bg-muted/40"
                    >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share Profile</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
