import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import AppRouter from "@/router/routes"
import { ErrorProvider } from "@/contexts/ErrorContext"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { Heartbeat } from "@/components/Heartbeat"

import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { StudyProvider } from "@/contexts/StudyContext"

const queryClient = new QueryClient()

const App = () => (
    <ErrorBoundary>
        <ThemeProvider defaultTheme="dark" storageKey="izabi-theme-v3">
            <LanguageProvider>
                <StudyProvider>
                    <ErrorProvider>
                        <QueryClientProvider client={queryClient}>
                            <TooltipProvider>
                                <Heartbeat />
                                <Toaster />
                                <Sonner />
                                <AppRouter />
                            </TooltipProvider>
                        </QueryClientProvider>
                    </ErrorProvider>
                </StudyProvider>
            </LanguageProvider>
        </ThemeProvider>
    </ErrorBoundary>
)

export default App
