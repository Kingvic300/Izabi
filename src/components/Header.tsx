import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Brain, Menu, X, Sparkles } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LanguageToggle } from "@/components/LanguageToggle"
import { useLanguage } from "@/contexts/LanguageContext"

export const Header = () => {
    const { t } = useLanguage()
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navLinks = [
        { name: t("nav.features"), href: "/features" },
        { name: t("nav.how_it_works"), href: "/how-it-works" },
        { name: t("nav.pricing"), href: "/pricing" },
        { name: t("nav.about"), href: "/about" },
    ]

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? "py-4 bg-background/40 backdrop-blur-xl border-b border-foreground/5" : "py-6 bg-transparent"
        }`}>
            <div className="w-full px-6 lg:px-12">
                <div className="flex justify-between items-center h-12">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group relative z-10">
                        <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                            <Brain className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black bg-gradient-hero bg-clip-text text-transparent leading-none">Izabi</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Learning AI</span>
                        </div>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-2xl bg-foreground/5 border border-foreground/5 backdrop-blur-md">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.href} 
                                to={link.href}
                                className={`px-4 py-2 text-sm font-bold tracking-tight rounded-xl transition-all duration-300 ${
                                    location.pathname === link.href ? "bg-foreground/10 text-primary" : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <LanguageToggle />
                        <ThemeToggle />
                        <Link to="/login">
                            <Button variant="ghost" className="font-bold text-sm tracking-tight hover:bg-foreground/5">
                                {t("nav.client_portal")}
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button className="font-bold text-sm tracking-tight rounded-xl h-11 px-6 bg-primary hover:bg-primary/90 shadow-glow flex items-center gap-2 group">
                                <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                                <span>{t("nav.get_early_access")}</span>
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-3 bg-foreground/5 hover:bg-foreground/10 rounded-2xl transition-colors border border-foreground/5"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {isOpen && (
                    <div className="lg:hidden absolute top-full left-0 right-0 mt-4 mx-6 p-6 space-y-4 rounded-[32px] bg-background/90 backdrop-blur-3xl border border-foreground/10 shadow-2xl shimmer">
                        <div className="grid grid-cols-1 gap-2">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.href} 
                                    to={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="p-4 rounded-2xl bg-foreground/5 font-bold text-lg"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                        <div className="pt-4 flex flex-col gap-3 border-t border-foreground/5">
                            <div className="flex items-center gap-2 px-2">
                                <LanguageToggle />
                                <ThemeToggle />
                            </div>
                            <Link to="/login" onClick={() => setIsOpen(false)} className="block">
                                <Button variant="ghost" className="w-full h-14 font-bold text-lg rounded-2xl">
                                    {t("nav.client_portal")}
                                </Button>
                            </Link>
                            <Link to="/signup" onClick={() => setIsOpen(false)} className="block">
                                <Button className="w-full h-14 font-bold text-lg rounded-2xl bg-primary hover:bg-primary/90 shadow-glow">
                                    {t("nav.get_started")}
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
