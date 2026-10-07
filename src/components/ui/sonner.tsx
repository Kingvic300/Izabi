import { useTheme } from '@/components/theme-provider';
import { Toaster as Sonner, toast } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = 'system' } = useTheme();

    return (
        <Sonner
            theme={theme as ToasterProps['theme']}
            position="top-center"
            expand
            richColors
            closeButton
            visibleToasts={5}
            className="toaster group"
            toastOptions={{
                duration: 5000,
                classNames: {
                    toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-float group-[.toaster]:rounded-lg group-[.toaster]:font-sans',
                    description:
                        'group-[.toast]:text-muted-foreground group-[.toast]:text-sm group-[.toast]:font-medium',
                    actionButton:
                        'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-md group-[.toast]:font-bold',
                    cancelButton:
                        'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-md group-[.toast]:font-bold',
                    success:
                        'group-[.toast]:border-reward/40 group-[.toast]:bg-card',
                    error: 'group-[.toast]:border-destructive/40 group-[.toast]:bg-card',
                    warning:
                        'group-[.toast]:border-urgent/40 group-[.toast]:bg-card',
                    info: 'group-[.toast]:border-border group-[.toast]:bg-card',
                },
            }}
            {...props}
        />
    );
};

export { Toaster, toast };
