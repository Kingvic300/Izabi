import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { BackButton } from "@/components/BackButton"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { Link } from "react-router-dom"

const Pricing = () => {
    const plans = [
        {
            name: "Free",
            price: "0",
            description: "Perfect for getting started",
            features: ["5 uploads per month", "Basic summaries", "Limited quizzes", "English only", "Community support"],
            cta: "Get Started",
            highlighted: false,
        },
        {
            name: "Pro",
            price: "9.99",
            description: "For serious learners",
            features: [
                "Unlimited uploads",
                "AI-powered summaries",
                "Unlimited quizzes",
                "English & Pidgin",
                "Voice learning",
                "Priority support",
                "Progress tracking",
                "Multiplayer games",
            ],
            cta: "Start Free Trial",
            highlighted: true,
        },
        {
            name: "Team",
            price: "29.99",
            description: "For study groups",
            features: [
                "Everything in Pro",
                "Up to 10 team members",
                "Shared study materials",
                "Team analytics",
                "Custom branding",
                "Dedicated support",
                "Advanced features",
                "API access",
            ],
            cta: "Contact Sales",
            highlighted: false,
        },
    ]

    const faqs = [
        {
            q: "Can I cancel anytime?",
            a: "Yes, you can cancel your subscription anytime with no penalties.",
        },
        {
            q: "Is there a free trial?",
            a: "Yes, Pro plan comes with a 14-day free trial. No credit card required.",
        },
        {
            q: "What payment methods do you accept?",
            a: "We accept all major credit cards, PayPal, and mobile money transfers.",
        },
        {
            q: "Do you offer student discounts?",
            a: "Yes, students get 30% off with a valid student ID.",
        },
    ]

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <div className="border-b border-border bg-card/50 sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <BackButton />
                </div>
            </div>

            {/* Hero */}
            <section className="py-20 lg:py-32 border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                            Simple, Transparent <span className="bg-gradient-hero bg-clip-text text-transparent">Pricing</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            Choose the perfect plan for your learning journey
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <Card
                                key={plan.name}
                                className={`p-8 border-0 shadow-sm transition-all duration-300 ${
                                    plan.highlighted ? "bg-gradient-primary/10 border-2 border-primary shadow-lg scale-105" : "bg-card"
                                }`}
                            >
                                {plan.highlighted && (
                                    <div className="inline-block mb-4 px-3 py-1 bg-primary/20 rounded-full border border-primary/30">
                                        <p className="text-xs font-semibold text-primary">Most Popular</p>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-muted-foreground mb-6">{plan.description}</p>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold">${plan.price}</span>
                                    {plan.price !== "0" && <span className="text-muted-foreground">/month</span>}
                                </div>
                                <Link to="/signup" className="block mb-8">
                                    <Button className="w-full" variant={plan.highlighted ? "default" : "outline"}>
                                        {plan.cta}
                                    </Button>
                                </Link>
                                <ul className="space-y-4">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3">
                                            <Check className="h-5 w-5 text-secondary flex-shrink-0" />
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 bg-muted/30 border-y border-border">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {faqs.map((faq) => (
                            <Card key={faq.q} className="p-6 border-0 bg-card shadow-sm">
                                <h3 className="font-semibold mb-2">{faq.q}</h3>
                                <p className="text-muted-foreground">{faq.a}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Pricing
