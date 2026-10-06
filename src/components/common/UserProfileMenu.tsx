import React, { useState, useRef, useEffect } from 'react';
import { LogOut, ChevronDown, Share2, Flame, Star } from 'lucide-react';

interface UserProfileMenuProps {
    userName?: string;
    userEmail?: string;
    institution?: string;
    streak: string;
    totalPoints: number;
    onLogout: () => void;
    onOpenShareProfile: () => void;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
    userName = 'Scholar',
    userEmail = '',
    institution,
    streak,
    totalPoints,
    onLogout,
    onOpenShareProfile,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const initials = userName
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-xl bg-muted/30 hover:bg-muted/60 border border-border hover:border-primary/40 transition-all cursor-pointer group"
                aria-label="User Profile Menu"
                aria-expanded={isOpen}
            >
                <div className="w-7 h-7 rounded-lg border border-primary/40 bg-primary/10 shrink-0 flex items-center justify-center text-[10px] font-bold text-primary">
                    {initials || 'U'}
                </div>

                <div className="text-left hidden sm:block max-w-[110px]">
                    <span className="text-xs font-semibold text-foreground block leading-tight truncate">
                        {userName}
                    </span>
                    {institution && (
                        <span className="text-[11px] text-muted-foreground block leading-none truncate">
                            {institution}
                        </span>
                    )}
                </div>

                <ChevronDown
                    className={`w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-transform ${
                        isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-card border border-border p-2.5 shadow-float z-50">
                    <div className="p-3 rounded-xl bg-muted/30 border border-border mb-2">
                        <span className="text-xs font-bold text-foreground block truncate">
                            {userName}
                        </span>
                        {userEmail && (
                            <span className="text-[11px] text-muted-foreground block truncate font-mono mt-0.5">
                                {userEmail}
                            </span>
                        )}

                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2.5 pt-2 border-t border-border">
                            <span className="flex items-center gap-1 text-amber-500 font-mono font-medium">
                                <Flame className="w-3.5 h-3.5 fill-amber-500" />
                                {streak}
                            </span>
                            <span className="text-muted-foreground">·</span>
                            <span className="flex items-center gap-1 text-primary font-mono font-medium">
                                <Star className="w-3.5 h-3.5" />
                                {totalPoints} XP
                            </span>
                        </div>
                    </div>

                    <div className="space-y-1 text-xs">
                        <button
                            type="button"
                            onClick={() => {
                                setIsOpen(false);
                                onOpenShareProfile();
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-foreground/80 hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer text-left font-medium"
                        >
                            <Share2 className="w-4 h-4 text-muted-foreground" />
                            <span>Share Profile</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setIsOpen(false);
                                onLogout();
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer text-left font-medium group"
                        >
                            <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            <span>Log Out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfileMenu;
