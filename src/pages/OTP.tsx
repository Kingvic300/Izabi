import React, { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Brain } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL } from "@/contants/contants.ts";

const OTP = () => {
    const [otp, setOtp] = useState(Array(6).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate();
    const location = useLocation();

    // Determine mode from route query or state: "verification" | "reset"
    const mode = location.state?.mode || "verification";
    const email = location.state?.email || "";
    const password = location.state?.password || "";

    const handleChange = (value: string, index: number) => {
        if (/^[0-9]?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (value && index < 5) inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = otp.join("");
        console.log("OTP submitted:", otpCode);
        // Temporarily mock verification
        toast.info("OTP verification will be implemented soon. Check your email for the code.");
    };

    const handleResendOtp = async () => {
        try {
            if (mode === "verification") {
                await axios.post(`${BASE_URL}/users/send-verification-otp`, {
                    email,
                    password,
                    role: "USER",
                });
            } else if (mode === "reset") {
                await axios.post(`${BASE_URL}/users/send-reset-otp`, { email });
            }
            toast.success("OTP sent successfully!");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to send OTP.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2">
                        <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center shadow-glow">
                            <Brain className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-3xl font-bold text-white">Izabi</span>
                    </Link>
                    <p className="text-white/80 mt-2">
                        {mode === "verification"
                            ? "Verify your account with OTP"
                            : "Enter the OTP to reset your password"}
                    </p>
                </div>

                {/* OTP Form */}
                <Card className="shadow-float border-0 bg-card/95 backdrop-blur-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Enter OTP</CardTitle>
                        <CardDescription>
                            Enter the 6-digit code sent to your email
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleOtpSubmit} className="space-y-6">
                            <div className="flex justify-center space-x-3">
                                {otp.map((digit, index) => (
                                    <Input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(e.target.value, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        className="w-12 h-12 rounded-full text-center text-lg font-bold bg-background/50 shadow-sm focus:ring-2 focus:ring-primary"
                                    />
                                ))}
                            </div>
                            <Button type="submit" className="w-full" variant="hero">
                                Verify
                            </Button>
                        </form>

                        <div className="mt-6 text-center space-y-2">
                            <p className="text-muted-foreground">
                                Didn’t get the code?{" "}
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    className="text-primary hover:text-primary-glow font-medium"
                                >
                                    Resend
                                </button>
                            </p>

                            <p className="text-muted-foreground">
                                Wrong email?{" "}
                                <Link
                                    to="/signup"
                                    className="text-primary hover:text-primary-glow font-medium"
                                >
                                    Go back
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default OTP;
