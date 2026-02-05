"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Brain, ArrowLeft, Sparkles, Loader2, ShieldCheck, Mail } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { BASE_URL } from "@/constants"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

// Define types for the error response
interface ErrorResponse {
    response?: {
        data?: {
            message?: string
        }
    }
}

const OTP = () => {
    const cardRef = useRef<HTMLDivElement>(null)
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    const navigate = useNavigate()
    const location = useLocation()

    useGSAP(() => {
        gsap.from(cardRef.current, {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: "expo.out"
        })
    })

    // Determine mode from route query or state: "verification" | "reset"
    const mode = location.state?.mode || "verification"
    const email = (location.state?.email || "").toLowerCase()
    const password = location.state?.password || ""

    const handleChange = (value: string, index: number) => {
        if (/^[0-9]?$/.test(value)) {
            const newOtp = [...otp]
            newOtp[index] = value
            setOtp(newOtp)
            if (value && index < 5) inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("text").slice(0, 6).split("")
        const newOtp = [...otp]
        
        pastedData.forEach((char, index) => {
            if (/^[0-9]$/.test(char)) {
                newOtp[index] = char
            }
        })
        
        setOtp(newOtp)
        
        // Focus the last filled input or the next empty one
        const nextIndex = Math.min(pastedData.length, 5)
        inputRefs.current[nextIndex]?.focus()
    }

    /*
     * How: Submits the 6-digit OTP code to the backend for verification. On success, completes registration and redirects to login.
     * Why: Confirms the user has access to the email address provided during signup.
     */
    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const otpCode = otp.join("")

        if (otpCode.length < 6) {
            toast.error("Incomplete Code", { 
                description: "Please enter the full 6-digit verification code sent to your email." 
            })
            return
        }

        setLoading(true)

        try {
            const response = await axios.post(`${BASE_URL}/api/user/register`, {
                email: location.state?.email?.toLowerCase(),
                otp: otpCode,
                role: "USER",
            })

            const { userId, accessToken, role, email: userEmail } = response.data

            localStorage.setItem("userId", userId)
            localStorage.setItem("authToken", accessToken)
            localStorage.setItem("userEmail", userEmail)
            localStorage.setItem("userRole", role || "USER")

            toast.success("Account Verified", { 
                description: "Welcome to Izabi! Routing you to your dashboard..." 
            })
            
            setTimeout(() => {
                navigate("/dashboard")
            }, 1500)
        } catch (err: unknown) {
            const error = err as ErrorResponse
            const errorMessage = error.response?.data?.message || "The code you entered is invalid or has expired."
            toast.error("Verification Failed", { 
                description: errorMessage 
            })
        } finally {
            setLoading(false)
        }
    }

    /*
     * How: Triggers a new OTP email request based on the current mode (verification or password reset).
     * Why: Allows users to receive a fresh code if the previous one expired or was not received.
     */
    const handleResendOtp = async () => {
        setResending(true)
        try {
            if (mode === "verification") {
                await axios.post(`${BASE_URL}/api/user/send-verification-otp`, {
                    email,
                    password,
                    role: "USER",
                })
            } else if (mode === "reset") {
                await axios.post(`${BASE_URL}/api/user/send-reset-otp`, { email })
            }
            toast.success("Code Resent", { 
                description: "A new verification code has been sent to your email." 
            })
        } catch (err: unknown) {
            const error = err as ErrorResponse
            toast.error("Error", { 
                description: error.response?.data?.message || "Failed to resend verification code. Please try again." 
            })
        } finally {
            setResending(false)
        }
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-6">
            {/* Background Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

            <Link to="/signup" className="absolute top-8 left-8 group">
                <div className="flex items-center gap-2 text-sm font-bold opacity-60 group-hover:opacity-100 transition-all">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Signup</span>
                </div>
            </Link>

            <div ref={cardRef} className="w-full max-w-[480px] space-y-8 relative z-10">
                {/* Branding */}
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center shadow-glow mx-auto animate-pulse">
                        <ShieldCheck className="h-10 w-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-white">Email <span className="text-gradient">Verification</span></h1>
                        <p className="text-muted-foreground font-medium">Please enter the security code sent to your email.</p>
                    </div>
                </div>

                <Card className="glass shadow-2xl border-white/10 rounded-[40px] overflow-hidden">
                    <CardContent className="p-10 space-y-8">
                        <div className="flex flex-col items-center gap-2 text-center">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-2">
                                <Mail className="text-primary" size={20} />
                            </div>
                            <p className="text-sm font-bold text-muted-foreground">Code sent to:</p>
                            <p className="text-lg font-black text-white px-4 py-1 glass rounded-lg border border-white/10">{email || "scholar@example.com"}</p>
                        </div>

                        <form onSubmit={handleOtpSubmit} className="space-y-8">
                            <div className="flex justify-between gap-3">
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
                                        onPaste={handlePaste}
                                        className="w-14 h-16 rounded-2xl text-center text-2xl font-black bg-white/5 border-white/10 focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all text-white"
                                    />
                                ))}
                            </div>

                            <Button
                                type="submit"
                                disabled={loading || otp.join("").length < 6}
                                className="w-full h-16 rounded-2xl bg-white text-black hover:bg-white/90 font-black text-xl shadow-glow transition-all active:scale-95 flex items-center justify-center gap-3 overflow-hidden group"
                            >
                                {loading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <>
                                        <Sparkles className="group-hover:rotate-12 transition-transform" />
                                        <span>Verify Account</span>
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="pt-6 border-t border-white/5 text-center flex flex-col gap-4">
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={resending}
                                className="text-xs uppercase font-black tracking-widest text-primary hover:opacity-80 transition-opacity disabled:opacity-40"
                            >
                                {resending ? "Sending code..." : "Resend Verification Code"}
                            </button>
                            <p className="text-xs font-bold text-muted-foreground">
                                Wrong email?{" "}
                                <Link to="/signup" className="text-white hover:text-primary transition-colors underline underline-offset-4 decoration-primary/50">
                                    Change email address
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <style>{`
                .glass {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(40px);
                    -webkit-backdrop-filter: blur(40px);
                }
                .text-gradient {
                    background: linear-gradient(to right, #60a5fa, #a855f7, #ec4899);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .shadow-glow {
                    box-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </div>
    )
}

export default OTP