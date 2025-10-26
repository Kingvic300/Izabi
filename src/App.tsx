import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import AppRouter from "@/router/routes"
import { ErrorProvider } from "@/contexts/ErrorContext"
import { ErrorBoundary } from "@/components/ErrorBoundary"

const queryClient = new QueryClient()

const App = () => (
    <ErrorBoundary>
        <ErrorProvider>
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <AppRouter />
                </TooltipProvider>
            </QueryClientProvider>
        </ErrorProvider>
    </ErrorBoundary>
)

export default App
