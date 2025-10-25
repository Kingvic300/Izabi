"use client"

import { Button } from "@/components/ui/button"
import { Brain, Menu, X } from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"

export const Header = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <Brain className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">Izabi</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/login">
                            <Button variant="ghost" className="text-foreground">
                                Login
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button variant="default" className="bg-primary hover:bg-primary/90">
                                Get Started
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {isOpen && (
                    <div className="md:hidden pb-4 space-y-2">
                        <div className="pt-4 space-y-2 border-t border-border">
                            <Link to="/login" className="block">
                                <Button variant="ghost" className="w-full justify-start">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup" className="block">
                                <Button className="w-full bg-primary hover:bg-primary/90">Get Started</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
