import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import { PageLoader } from '@/components/PageLoader';
import { lazyRetry as lazy } from '@/lib/lazyLoad';
import { TourProvider } from '@/contexts/TourContext';
import { TourOverlay } from '@/components/common/TourGuide';

// Lazy-loaded Pages
const Home = lazy(() => import('@/pages/Home'), 'Home');
const Login = lazy(() => import('@/pages/Login'), 'Login');
const Signup = lazy(() => import('@/pages/Signup'), 'Signup');
const Dashboard = lazy(() => import('@/pages/Dashboard'), 'Dashboard');
const DashboardHome = lazy(
    () => import('@/pages/DashboardHome'),
    'DashboardHome',
);
const DashboardHistory = lazy(
    () => import('@/pages/DashboardHistory'),
    'DashboardHistory',
);
const DashboardProfile = lazy(
    () => import('@/pages/DashboardProfile'),
    'DashboardProfile',
);
const DashboardNotes = lazy(
    () => import('@/pages/DashboardNotes'),
    'DashboardNotes',
);
const DashboardAIAssistant = lazy(
    () => import('@/pages/DashboardAIAssistant'),
    'DashboardAIAssistant',
);
const DashboardProgress = lazy(
    () => import('@/pages/DashboardProgress'),
    'DashboardProgress',
);
const DashboardSettings = lazy(
    () => import('@/pages/DashboardSettings'),
    'DashboardSettings',
);
const DashboardExams = lazy(
    () => import('@/pages/DashboardExams'),
    'DashboardExams',
);
const NotFound = lazy(() => import('@/pages/NotFound'), 'NotFound');
const OTP = lazy(() => import('@/pages/OTP'), 'OTP');
const Features = lazy(() => import('@/pages/Features'), 'Features');
const HowItWorks = lazy(() => import('@/pages/HowItWorks'), 'HowItWorks');
const Testimonials = lazy(() => import('@/pages/Testimonials'), 'Testimonials');
const Pricing = lazy(() => import('@/pages/Pricing'), 'Pricing');
const FAQ = lazy(() => import('@/pages/FAQ'), 'FAQ');
const About = lazy(() => import('@/pages/About'), 'About');
const Contact = lazy(() => import('@/pages/Contact'), 'Contact');
const AdminDashboard = lazy(
    () => import('@/pages/AdminDashboard'),
    'AdminDashboard',
);
const DashboardLeaderboard = lazy(
    () => import('@/pages/DashboardLeaderboard'),
    'DashboardLeaderboard',
);
const DashboardSupport = lazy(
    () => import('@/pages/DashboardSupport'),
    'DashboardSupport',
);
const DashboardSubscription = lazy(
    () => import('@/pages/DashboardSubscription'),
    'DashboardSubscription',
);

const withErrorBoundary = (Component: React.ComponentType, text?: string) => (
    <ErrorBoundary>
        <Suspense
            fallback={
                <PageLoader
                    variant="spinner"
                    text={text || 'Synchronizing data...'}
                />
            }
        >
            <Component />
        </Suspense>
    </ErrorBoundary>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');

    if (!authToken || !userId) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');

    if (!authToken || !userId) {
        return <Navigate to="/login" replace />;
    }

    // Check if user is admin
    if (userRole !== 'ADMIN') {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

const routes = () => {
    return (
        <BrowserRouter>
            <TourProvider>
                <TourOverlay />
                <Routes>
                    {/* Public Routes */}
                    <Route
                        path="/"
                        element={withErrorBoundary(
                            Home,
                            'your landing page is loading',
                        )}
                    />
                    <Route
                        path="/features"
                        element={withErrorBoundary(Features)}
                    />
                    <Route
                        path="/how-it-works"
                        element={withErrorBoundary(HowItWorks)}
                    />
                    <Route
                        path="/testimonials"
                        element={withErrorBoundary(Testimonials)}
                    />
                    <Route
                        path="/pricing"
                        element={withErrorBoundary(Pricing)}
                    />
                    <Route path="/faq" element={withErrorBoundary(FAQ)} />
                    <Route path="/about" element={withErrorBoundary(About)} />
                    <Route
                        path="/contact"
                        element={withErrorBoundary(Contact)}
                    />
                    <Route path="/otp" element={withErrorBoundary(OTP)} />
                    <Route path="/login" element={withErrorBoundary(Login)} />
                    <Route path="/signup" element={withErrorBoundary(Signup)} />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                {withErrorBoundary(Dashboard)}
                            </ProtectedRoute>
                        }
                    >
                        <Route
                            index
                            element={withErrorBoundary(DashboardHome)}
                        />
                        <Route
                            path="notes"
                            element={withErrorBoundary(DashboardNotes)}
                        />
                        <Route
                            path="ai-assistant"
                            element={withErrorBoundary(DashboardAIAssistant)}
                        />
                        <Route
                            path="progress"
                            element={withErrorBoundary(DashboardProgress)}
                        />
                        <Route
                            path="history"
                            element={withErrorBoundary(DashboardHistory)}
                        />
                        <Route
                            path="profile"
                            element={withErrorBoundary(
                                DashboardProfile,
                                'your profile page is loading',
                            )}
                        />
                        <Route
                            path="settings"
                            element={withErrorBoundary(DashboardSettings)}
                        />
                        <Route
                            path="exams"
                            element={withErrorBoundary(DashboardExams)}
                        />
                        <Route
                            path="admin"
                            element={
                                <AdminRoute>
                                    {withErrorBoundary(AdminDashboard)}
                                </AdminRoute>
                            }
                        />
                        <Route
                            path="leaderboard"
                            element={withErrorBoundary(DashboardLeaderboard)}
                        />
                        <Route
                            path="contact"
                            element={withErrorBoundary(DashboardSupport)}
                        />
                        <Route
                            path="subscription"
                            element={withErrorBoundary(DashboardSubscription)}
                        />
                    </Route>

                    {/* Catch-all route */}
                    <Route path="*" element={withErrorBoundary(NotFound)} />
                </Routes>
            </TourProvider>
        </BrowserRouter>
    );
};

export default routes;
