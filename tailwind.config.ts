import type { Config } from 'tailwindcss';
import tailwindAnimate from 'tailwindcss-animate';

export default {
    darkMode: ['class'],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: '',
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            fontFamily: {
                sans: ['Andika', 'Noto Sans', 'system-ui', 'sans-serif'],
                display: ['Gentium Book Plus', 'Andika', 'Georgia', 'serif'],
                mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
            },
            letterSpacing: {
                tighter: '-0.02em',
                tight: '-0.01em',
                wide: '0.01em',
                wider: '0.02em',
                widest: '0.03em',
            },
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                    glow: 'hsl(var(--primary-glow))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                    glow: 'hsl(var(--secondary-glow))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                    glow: 'hsl(var(--accent-glow))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                learning: {
                    blue: 'hsl(var(--learning-blue))',
                    green: 'hsl(var(--learning-green))',
                    purple: 'hsl(var(--learning-purple))',
                    orange: 'hsl(var(--learning-orange))',
                },
                reward: {
                    DEFAULT: 'hsl(var(--reward))',
                    foreground: 'hsl(var(--reward-foreground))',
                },
                urgent: {
                    DEFAULT: 'hsl(var(--urgent))',
                    foreground: 'hsl(var(--urgent-foreground))',
                },
                sheet: {
                    DEFAULT: 'hsl(var(--sheet))',
                    foreground: 'hsl(var(--sheet-foreground))',
                },
                highlight: {
                    DEFAULT: 'hsl(var(--highlight))',
                    foreground: 'hsl(var(--highlight-foreground))',
                },
                sidebar: {
                    DEFAULT: 'hsl(var(--sidebar-background))',
                    foreground: 'hsl(var(--sidebar-foreground))',
                    primary: 'hsl(var(--sidebar-primary))',
                    'primary-foreground':
                        'hsl(var(--sidebar-primary-foreground))',
                    accent: 'hsl(var(--sidebar-accent))',
                    'accent-foreground':
                        'hsl(var(--sidebar-accent-foreground))',
                    border: 'hsl(var(--sidebar-border))',
                    ring: 'hsl(var(--sidebar-ring))',
                },
            },
            boxShadow: {
                card: 'var(--shadow-card)',
                float: 'var(--shadow-float)',
            },
            borderRadius: {
                '3xl': 'calc(var(--radius) + 6px)',
                '2xl': 'calc(var(--radius) + 4px)',
                xl: 'calc(var(--radius) + 2px)',
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            keyframes: {
                'accordion-down': {
                    from: {
                        height: '0',
                    },
                    to: {
                        height: 'var(--radix-accordion-content-height)',
                    },
                },
                'accordion-up': {
                    from: {
                        height: 'var(--radix-accordion-content-height)',
                    },
                    to: {
                        height: '0',
                    },
                },
                'pencil-fill': {
                    from: { transform: 'scale(0.2)', opacity: '0.4' },
                    to: { transform: 'scale(1)', opacity: '1' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'pencil-fill': 'pencil-fill 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)',
            },
        },
    },
    plugins: [tailwindAnimate],
} satisfies Config;
