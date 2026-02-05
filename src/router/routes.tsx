import React, { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ErrorBoundary from "@/components/ErrorBoundary"
import { PageLoader } from "@/components/PageLoader"

// Lazy-loaded Pages
const Home = lazy(() => import("@/pages/Home"))
const Login = lazy(() => import("@/pages/Login"))
const Signup = lazy(() => import("@/pages/Signup"))
const Dashboard = lazy(() => import("@/pages/Dashboard"))
const DashboardHome = lazy(() => import("@/pages/DashboardHome"))
const DashboardHistory = lazy(() => import("@/pages/DashboardHistory"))
const DashboardProfile = lazy(() => import("@/pages/DashboardProfile"))
const DashboardNotes = lazy(() => import("@/pages/DashboardNotes"))
const DashboardAIAssistant = lazy(() => import("@/pages/DashboardAIAssistant"))
const DashboardProgress = lazy(() => import("@/pages/DashboardProgress"))
const DashboardSettings = lazy(() => import("@/pages/DashboardSettings"))
const DashboardExams = lazy(() => import("@/pages/DashboardExams"))
const NotFound = lazy(() => import("@/pages/NotFound"))
const OTP = lazy(() => import("@/pages/OTP.tsx"))
const Features = lazy(() => import("@/pages/Features"))
const HowItWorks = lazy(() => import("@/pages/HowItWorks"))
const Testimonials = lazy(() => import("@/pages/Testimonials"))
const Pricing = lazy(() => import("@/pages/Pricing"))
const FAQ = lazy(() => import("@/pages/FAQ"))
const About = lazy(() => import("@/pages/About"))

const withErrorBoundary = (Component: React.ComponentType) => (
    <ErrorBoundary>
        <Suspense fallback={<PageLoader variant="spinner" text="Loading page..." />}>
            <Component />
        </Suspense>
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
                    <Route path="exams" element={withErrorBoundary(DashboardExams)} />
                </Route>

                {/* Catch-all route */}
                <Route path="*" element={withErrorBoundary(NotFound)} />
            </Routes>
        </BrowserRouter>
    )
}

export default routes
