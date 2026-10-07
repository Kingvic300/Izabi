import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string;
    height?: number;
    variant?: 'full' | 'mark';
}

export const Logo = ({ className, height = 30, variant = 'full' }: LogoProps) => {
    const light = variant === 'mark' ? '/logo-mark-light.png' : '/logo-light.png';
    const dark = variant === 'mark' ? '/logo-mark-dark.png' : '/logo-dark.png';

    return (
        <span className={cn('inline-flex items-center', className)}>
            <img
                src={light}
                alt="Izabi"
                style={{ height }}
                className="w-auto dark:hidden"
            />
            <img
                src={dark}
                alt="Izabi"
                style={{ height }}
                className="hidden w-auto dark:block"
            />
        </span>
    );
};
