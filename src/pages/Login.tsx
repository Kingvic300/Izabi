"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Brain } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import type React from "react"
import { useState } from "react"
import axios from "axios"
import { BASE_URL } from "@/contants/contants.ts"
import { BackButton } from "@/components/BackButton"
import { useAppToast } from "@/hooks/useAppToast"
import { formValidation } from "@/lib/formValidation"
import { ErrorBoundary } from "@/components/ErrorBoundary"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [emailError, setEmailError] = useState<string | null>(null)
    const [passwordError, setPasswordError] = useState<string | null>(null)
    const currentYear = new Date().getFullYear()
    const navigate = useNavigate()
    const appToast = useAppToast()

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setEmail(value)
        if (value) {
            const validation = formValidation.email(value)
            setEmailError(validation.error || null)
        } else {
            setEmailError(null)
        }
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setPassword(value)
        if (value && value.length < 6) {
            setPasswordError("Password must be at least 6 characters")
        } else {
            setPasswordError(null)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const emailValidation = formValidation.email(email)
        if (!emailValidation.isValid) {
            setEmailError(emailValidation.error || null)
            appToast.validationError("email", emailValidation.error || "Invalid email")
            return
        }

        if (!password) {
            setPasswordError("Password is required")
            appToast.validationError("password", "Password is required")
            return
        }

        setLoading(true)

        try {
            const response = await axios.post(
                `${BASE_URL}/users/login`,
                { email, password, role: "USER" },
                { withCredentials: true },
            )

            const { userId, authToken } = response.data

            localStorage.setItem("userId", userId)
            localStorage.setItem("authToken", authToken)
            localStorage.setItem("userEmail", email)

            appToast.success({
                title: "Welcome back!",
                description: "You've been logged in successfully. Redirecting to your dashboard...",
            })

            setTimeout(() => navigate("/dashboard"), 1000)
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Login failed"

            if (err.response?.status === 401) {
                appToast.loginFailed("Invalid email or password. Please check and try again.")
            } else if (err.response?.status === 404) {
                appToast.loginFailed("No account found with this email address.")
            } else if (!navigator.onLine) {
                appToast.networkError()
            } else {
                appToast.error({
                    title: "Login failed",
                    description: errorMessage,
                })
            }
        } finally {
            setLoading(false)
        }
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
                        <p className="text-white/80 mt-2">Welcome back to your learning journey</p>
                    </div>

                    {/* Login Form */}
                    <Card className="shadow-float border-0 bg-card/95 backdrop-blur-md">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">Sign In</CardTitle>
                            <CardDescription>Enter your credentials to access your dashboard</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your.email@example.com"
                                        value={email}
                                        onChange={handleEmailChange}
                                        required
                                        className={`bg-background/50 ${emailError ? "border-destructive" : ""}`}
                                        aria-invalid={!!emailError}
                                        aria-describedby={emailError ? "email-error" : undefined}
                                    />
                                    {emailError && (
                                        <p id="email-error" className="text-sm text-destructive">
                                            {emailError}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        required
                                        className={`bg-background/50 ${passwordError ? "border-destructive" : ""}`}
                                        aria-invalid={!!passwordError}
                                        aria-describedby={passwordError ? "password-error" : undefined}
                                    />
                                    {passwordError && (
                                        <p id="password-error" className="text-sm text-destructive">
                                            {passwordError}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    variant="hero"
                                    disabled={loading || !!emailError || !email || !password}
                                >
                                    {loading ? "Signing in..." : "Sign In"}
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-muted-foreground">
                                    Don't have an account?{" "}
                                    <Link to="/signup" className="text-primary hover:text-primary-glow font-medium">
                                        Sign Up
                                    </Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-border bg-card/50">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-center gap-y-4 sm:flex-row sm:justify-between">
                        <div className="flex items-center space-x-2">
                            <div
                                className="flex h-6 w-6 items-center justify-center rounded bg-gradient-primary"
                                aria-label="Izabi Logo"
                            >
                                <Brain className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <span className="bg-gradient-hero bg-clip-text text-lg font-bold text-transparent">Izabi</span>
                        </div>
                        <p className="text-sm text-muted-foreground">&copy; {currentYear} Izabi. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default function LoginPage() {
    return (
        <ErrorBoundary>
            <Login />
        </ErrorBoundary>
    )
}
