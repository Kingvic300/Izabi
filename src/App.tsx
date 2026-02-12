import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from '@/router/routes';
import { ErrorProvider } from '@/contexts/ErrorContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Heartbeat } from '@/components/Heartbeat';

import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { StudyProvider } from '@/contexts/StudyContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GlobalErrorHandlers } from '@/components/GlobalErrorHandlers';

const queryClient = new QueryClient();

const GOOGLE_CLIENT_ID =
    '25223443612-npc3ofle86h0agp5f9mik6842pvpkco5.apps.googleusercontent.com';

const App = () => (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <ErrorBoundary>
            <ThemeProvider defaultTheme="dark" storageKey="izabi-theme-v3">
                <LanguageProvider>
                    <StudyProvider>
                        <ErrorProvider>
                            <QueryClientProvider client={queryClient}>
                                <TooltipProvider>
                                    <Heartbeat />
                                    <GlobalErrorHandlers />
                                    <Sonner />
                                    <AppRouter />
                                </TooltipProvider>
                            </QueryClientProvider>
                        </ErrorProvider>
                    </StudyProvider>
                </LanguageProvider>
            </ThemeProvider>
        </ErrorBoundary>
    </GoogleOAuthProvider>
);

export default App;
