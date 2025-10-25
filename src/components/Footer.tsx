import { Brain, Mail, Linkedin, Twitter } from "lucide-react"
import { Link } from "react-router-dom"

export const Footer = () => {
    const currentYear = new Date().getFullYear()

    const footerLinks = {
        Product: [
            { label: "Features", href: "/features" },
            { label: "Pricing", href: "/pricing" },
            { label: "How It Works", href: "/how-it-works" },
        ],
        Company: [
            { label: "About", href: "/about" },
            { label: "Blog", href: "/blog" },
            { label: "Contact", href: "/contact" },
        ],
        Legal: [
            { label: "Privacy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
        ],
    }

    return (
        <footer className="border-t border-border bg-card/50">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center space-x-2 mb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-primary">
                                <Brain className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="bg-gradient-hero bg-clip-text text-lg font-bold text-transparent">Izabi</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Transform your notes into personalized learning experiences with AI.
                        </p>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h3 className="font-semibold text-foreground mb-4">{category}</h3>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link.href}>
                                        <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Social */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Email">
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">&copy; {currentYear} Izabi. All rights reserved.</p>
                    <div className="flex gap-6 text-sm text-muted-foreground">
                        <Link to="/privacy" className="hover:text-primary transition-colors">
                            Privacy Policy
                        </Link>
                        <Link to="/terms" className="hover:text-primary transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
