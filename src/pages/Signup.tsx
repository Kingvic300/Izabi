"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Brain, Check, X } from "lucide-react"
import axios from "axios"
import { BASE_URL } from "@/contants/contants.ts"
import { BackButton } from "@/components/BackButton"
import { useAppToast } from "@/hooks/useAppToast"
import { formValidation } from "@/lib/formValidation"
import { ErrorBoundary } from "@/components/ErrorBoundary"

const Signup = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const appToast = useAppToast()

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
                title: "Validation failed",
                description: "Please check the highlighted fields and try again.",
            })
            return
        }

        setIsLoading(true)
        try {
            await axios.post(`${BASE_URL}/users/send-verification-otp`, {
                email: formData.email,
                password: formData.password,
                role: "USER",
            })

            appToast.success({
                title: "OTP sent!",
                description: "Check your email for the verification code. It will expire in 10 minutes.",
            })

            navigate("/otp", {
                state: {
                    email: formData.email,
                    password: formData.password,
                    mode: "verification",
                },
            })
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Failed to send OTP"

            if (err.response?.status === 409) {
                appToast.error({
                    title: "Email already registered",
                    description: "This email is already associated with an account. Please sign in instead.",
                })
            } else if (!navigator.onLine) {
                appToast.networkError()
            } else {
                appToast.error({
                    title: "Signup failed",
                    description: errorMessage,
                })
            }
        } finally {
            setIsLoading(false)
        }
    }

    const getPasswordStrength = () => {
        if (!formData.password) return null
        const validation = formValidation.password(formData.password)
        return validation.isValid
    }

    return (
        <div className="min-h-screen bg-gradient-hero flex flex-col">
            <BackButton />

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center space-x-2">
                            <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center shadow-glow">
                                <Brain className="h-6 w-6 text-primary" />
                            </div>
                            <span className="text-3xl font-bold text-white">Izabi</span>
                        </Link>
                        <p className="text-white/80 mt-2">Start your AI-powered learning journey</p>
                    </div>

                    {/* Signup Form */}
                    <Card className="shadow-float border-0 bg-card/95 backdrop-blur-md">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">Create Account</CardTitle>
                            <CardDescription>Join thousands of students already using Izabi</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="your.email@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className={`bg-background/50 ${errors.email ? "border-destructive" : ""}`}
                                        aria-invalid={!!errors.email}
                                        aria-describedby={errors.email ? "email-error" : undefined}
                                    />
                                    {errors.email && (
                                        <p id="email-error" className="text-sm text-destructive flex items-center gap-1">
                                            <X className="h-3 w-3" /> {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Create a strong password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className={`bg-background/50 ${errors.password ? "border-destructive" : ""}`}
                                        aria-invalid={!!errors.password}
                                        aria-describedby={errors.password ? "password-error" : undefined}
                                    />
                                    {errors.password && (
                                        <p id="password-error" className="text-sm text-destructive flex items-center gap-1">
                                            <X className="h-3 w-3" /> {errors.password}
                                        </p>
                                    )}
                                    {formData.password && !errors.password && (
                                        <p className="text-sm text-green-600 flex items-center gap-1">
                                            <Check className="h-3 w-3" /> Password is strong
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className={`bg-background/50 ${errors.confirmPassword ? "border-destructive" : ""}`}
                                        aria-invalid={!!errors.confirmPassword}
                                        aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
                                    />
                                    {errors.confirmPassword && (
                                        <p id="confirm-error" className="text-sm text-destructive flex items-center gap-1">
                                            <X className="h-3 w-3" /> {errors.confirmPassword}
                                        </p>
                                    )}
                                    {formData.confirmPassword &&
                                        !errors.confirmPassword &&
                                        formData.password === formData.confirmPassword && (
                                            <p className="text-sm text-green-600 flex items-center gap-1">
                                                <Check className="h-3 w-3" /> Passwords match
                                            </p>
                                        )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    variant="hero"
                                    disabled={
                                        isLoading ||
                                        !formData.email ||
                                        !formData.password ||
                                        !formData.confirmPassword ||
                                        Object.values(errors).some((e) => e)
                                    }
                                >
                                    {isLoading ? "Sending OTP..." : "Request OTP"}
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-muted-foreground">
                                    Already have an account?{" "}
                                    <Link to="/login" className="text-primary hover:text-primary-glow font-medium">
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
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
