import { BrowserRouter, Routes, Route } from "react-router-dom"

// Pages
import Home from "@/pages/Home"
import Login from "@/pages/Login"
import Signup from "@/pages/Signup"
import Dashboard from "@/pages/Dashboard"
import DashboardHome from "@/pages/DashboardHome"
import DashboardHistory from "@/pages/DashboardHistory"
import DashboardProfile from "@/pages/DashboardProfile"
import NotFound from "@/pages/NotFound"
import OTP from "@/pages/OTP.tsx"
import Features from "@/pages/Features"
import HowItWorks from "@/pages/HowItWorks"
import Testimonials from "@/pages/Testimonials"
import Pricing from "@/pages/Pricing"
import FAQ from "@/pages/FAQ"
import About from "@/pages/About"

const routes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/features" element={<Features />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/about" element={<About />} />
                <Route path="/otp" element={<OTP />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />}>
                    <Route index element={<DashboardHome />} />
                    <Route path="history" element={<DashboardHistory />} />
                    <Route path="profile" element={<DashboardProfile />} />
                </Route>
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    )
}

export default routes
