"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Brain, Check, X, Mail, Lock, Sparkles, Loader2, ArrowLeft, ShieldCheck, Eye, EyeOff } from "lucide-react"
import axios from "axios"
import { BASE_URL } from "@/constants"
import { useAppToast } from "@/hooks/useAppToast"
import { formValidation } from "@/lib/formValidation"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useLanguage } from "@/contexts/LanguageContext"

const Signup = () => {
    const { t } = useLanguage()
    const cardRef = useRef<HTMLDivElement>(null)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const appToast = useAppToast()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    useGSAP(() => {
        gsap.from(cardRef.current, {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: "expo.out"
        })
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        // Real-time validation
        if (name === "email" && value) {
            const validation = formValidation.email(value)
            setErrors((prev) => ({
                ...prev,
                email: validation.error || "",
            }))
        } else if (name === "password" && value) {
            const validation = formValidation.password(value)
            setErrors((prev) => ({
                ...prev,
                password: validation.error || "",
            }))
        } else if (name === "confirmPassword" && value && formData.password) {
            const validation = formValidation.passwordMatch(formData.password, value)
            setErrors((prev) => ({
                ...prev,
                confirmPassword: validation.error || "",
            }))
        }
    }

    /*
     * How: Validates all form inputs and sends an OTP verification request to the backend.
     * Why: Users must verify their email before completing registration to prevent spam and ensure account security.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const emailValidation = formValidation.email(formData.email)
        const passwordValidation = formValidation.password(formData.password)
        const matchValidation = formValidation.passwordMatch(formData.password, formData.confirmPassword)

        const newErrors: Record<string, string> = {}
        if (!emailValidation.isValid) newErrors.email = emailValidation.error || ""
        if (!passwordValidation.isValid) newErrors.password = passwordValidation.error || ""
        if (!matchValidation.isValid) newErrors.confirmPassword = matchValidation.error || ""

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            appToast.error({
                title: "Validation Error",
                description: "Please check the form for errors and try again.",
            })
            return
        }

        setIsLoading(true)
        try {
            await axios.post(`${BASE_URL}/api/user/send-verification-otp`, {
                email: formData.email,
                password: formData.password,
                role: "USER",
            })

            appToast.success({
                title: "Verification Code Sent",
                description: "Please check your email for the verification code.",
            })

            navigate("/otp", {
                state: {
                    email: formData.email,
                    password: formData.password,
                    mode: "verification",
                },
            })
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Failed to send verification code"

            if (err.response?.status === 409) {
                appToast.error({
                    title: "Account Already Exists",
                    description: "This email is already registered. Please sign in instead.",
                })
            } else if (!navigator.onLine) {
                appToast.networkError()
            } else {
                appToast.error({
                    title: "Registration Failed",
                    description: errorMessage,
                })
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-6">
            {/* Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

            <Link to="/" className="absolute top-8 left-8 group">
                <div className="flex items-center gap-2 text-sm font-bold opacity-60 group-hover:opacity-100 transition-all text-foreground">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Return Home</span>
                </div>
            </Link>

            <div ref={cardRef} className="w-full max-w-[520px] space-y-8 relative z-10">
                {/* Branding */}
                <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center shadow-glow mx-auto animate-pulse">
                        <Brain className="h-10 w-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-foreground">{t("auth.signup").split(' ')[0]} <span className="text-gradient">{t("auth.signup").split(' ')[1]}</span></h1>
                        <p className="text-muted-foreground font-medium">Create your account to start your learning journey.</p>
                    </div>
                </div>

                <Card className="glass shadow-2xl border-foreground/10 rounded-[40px] overflow-hidden">
                    <CardContent className="p-10 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-black tracking-widest opacity-40 px-1">{t("auth.email")}</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
                                    <Input
                                        name="email"
                                        type="email"
                                        placeholder="scholar@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`h-14 pl-12 rounded-2xl bg-foreground/5 border-foreground/10 focus:border-primary transition-all text-lg font-medium text-foreground ${errors.email ? "border-destructive/50" : ""}`}
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-destructive font-bold px-1">{errors.email}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-black tracking-widest opacity-40 px-1">{t("auth.password")}</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
                                        <Input
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`h-14 pl-12 pr-12 rounded-2xl bg-foreground/5 border-foreground/10 focus:border-primary transition-all text-lg font-medium text-foreground ${errors.password ? "border-destructive/50" : ""}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-xs text-destructive font-bold px-1">{errors.password}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-black tracking-widest opacity-40 px-1">Confirm</Label>
                                    <div className="relative">
                                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
                                        <Input
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`h-14 pl-12 pr-12 rounded-2xl bg-foreground/5 border-foreground/10 focus:border-primary transition-all text-lg font-medium text-foreground ${errors.confirmPassword ? "border-destructive/50" : ""}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <p className="text-xs text-destructive font-bold px-1">{errors.confirmPassword}</p>}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-16 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-black text-xl shadow-glow transition-all active:scale-95 flex items-center justify-center gap-3 overflow-hidden group"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <>
                                        <Sparkles className="group-hover:rotate-12 transition-transform" />
                                        <span>Create Account</span>
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="pt-6 border-t border-foreground/5 text-center">
                            <p className="text-sm font-bold text-muted-foreground">
                                Already have an account?{" "}
                                <Link to="/login" className="text-foreground hover:text-primary transition-colors underline underline-offset-4 decoration-primary/50">
                                    {t("auth.login")}
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
                    background: linear-gradient(to right, #3b82f6, #2dd4bf, #10b981);
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

export default function SignupPage() {
    return (
        <ErrorBoundary>
            <Signup />
        </ErrorBoundary>
    )
}
