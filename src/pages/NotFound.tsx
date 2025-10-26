"use client"

import { useLocation } from "react-router-dom"
import { useEffect } from "react"
import { BackButton } from "@/components/BackButton"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ErrorBoundary } from "@/components/ErrorBoundary"

const NotFound = () => {
    const location = useLocation()

    useEffect(() => {
        console.error("404 Error: User attempted to access non-existent route:", location.pathname)
    }, [location.pathname])

    return (
        <div className="min-h-screen bg-gradient-hero flex flex-col">
            <BackButton />

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <h1 className="text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">404</h1>
                    <p className="text-xl text-white/80 mb-8">Oops! The page you're looking for doesn't exist.</p>
                    <Link to="/">
                        <Button variant="hero" className="w-full">
                            Return to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default function NotFoundPage() {
    return (
        <ErrorBoundary>
            <NotFound />
        </ErrorBoundary>
    )
}
