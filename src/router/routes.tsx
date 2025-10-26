import type React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ErrorBoundary from "@/components/ErrorBoundary"

// Pages
import Home from "@/pages/Home"
import Login from "@/pages/Login"
import Signup from "@/pages/Signup"
import Dashboard from "@/pages/Dashboard"
import DashboardHome from "@/pages/DashboardHome"
import DashboardHistory from "@/pages/DashboardHistory"
import DashboardProfile from "@/pages/DashboardProfile"
import DashboardNotes from "@/pages/DashboardNotes"
import DashboardAIAssistant from "@/pages/DashboardAIAssistant"
import DashboardProgress from "@/pages/DashboardProgress"
import DashboardSettings from "@/pages/DashboardSettings"
import NotFound from "@/pages/NotFound"
import OTP from "@/pages/OTP.tsx"
import Features from "@/pages/Features"
import HowItWorks from "@/pages/HowItWorks"
import Testimonials from "@/pages/Testimonials"
import Pricing from "@/pages/Pricing"
import FAQ from "@/pages/FAQ"
import About from "@/pages/About"

const withErrorBoundary = (Component: React.ComponentType) => (
    <ErrorBoundary>
        <Component />
    </ErrorBoundary>
)

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const authToken = localStorage.getItem("authToken")
    const userId = localStorage.getItem("userId")

    if (!authToken || !userId) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}

const routes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={withErrorBoundary(Home)} />
                <Route path="/features" element={withErrorBoundary(Features)} />
                <Route path="/how-it-works" element={withErrorBoundary(HowItWorks)} />
                <Route path="/testimonials" element={withErrorBoundary(Testimonials)} />
                <Route path="/pricing" element={withErrorBoundary(Pricing)} />
                <Route path="/faq" element={withErrorBoundary(FAQ)} />
                <Route path="/about" element={withErrorBoundary(About)} />
                <Route path="/otp" element={withErrorBoundary(OTP)} />
                <Route path="/login" element={withErrorBoundary(Login)} />
                <Route path="/signup" element={withErrorBoundary(Signup)} />

                <Route path="/dashboard" element={<ProtectedRoute>{withErrorBoundary(Dashboard)}</ProtectedRoute>}>
                    <Route index element={withErrorBoundary(DashboardHome)} />
                    <Route path="notes" element={withErrorBoundary(DashboardNotes)} />
                    <Route path="ai-assistant" element={withErrorBoundary(DashboardAIAssistant)} />
                    <Route path="progress" element={withErrorBoundary(DashboardProgress)} />
                    <Route path="history" element={withErrorBoundary(DashboardHistory)} />
                    <Route path="profile" element={withErrorBoundary(DashboardProfile)} />
                    <Route path="settings" element={withErrorBoundary(DashboardSettings)} />
                </Route>

                {/* Catch-all route */}
                <Route path="*" element={withErrorBoundary(NotFound)} />
            </Routes>
        </BrowserRouter>
    )
}

export default routes
