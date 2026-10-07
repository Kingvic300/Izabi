import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';

export function ThemeToggle() {
    const { setTheme } = useTheme();

    const toggle = () => {
        const isDark = document.documentElement.classList.contains('dark');
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
        >
            <Sun className="h-[18px] w-[18px] dark:hidden" />
            <Moon className="hidden h-[18px] w-[18px] dark:block" />
            <span className="sr-only">Switch light or dark theme</span>
        </Button>
    );
}
