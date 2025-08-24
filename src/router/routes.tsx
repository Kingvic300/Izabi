import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import DashboardHome from "@/pages/DashboardHome";
import DashboardHistory from "@/pages/DashboardHistory";
import DashboardProfile from "@/pages/DashboardProfile";
import NotFound from "@/pages/NotFound";
import OTP from "@/pages/OTP.tsx";

const routes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/otp" element={<OTP/>} />
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
    );
};

export default routes;
