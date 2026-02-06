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

const queryClient = new QueryClient()

const App = () => (
    <ErrorBoundary>
        <ThemeProvider defaultTheme="dark" storageKey="izabi-theme">
            <LanguageProvider>
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
            </LanguageProvider>
        </ThemeProvider>
    </ErrorBoundary>
)

export default App
