import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    Brain,
    FileText,
    Mic,
    Users,
    Zap,
    Globe,
    ArrowRight,
    CheckCircle,
    BookOpen,
    BarChart3,
    HelpCircle,
    Users2,
    Info,
} from "lucide-react"
import { Link } from "react-router-dom"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

const Home = () => {
    const features = [
        {
            icon: <FileText className="h-8 w-8" />,
            title: "Smart Note Upload",
            description: "Upload PDFs and notes - AI scans instantly",
        },
        {
            icon: <Brain className="h-8 w-8" />,
            title: "AI Summaries",
            description: "Get intelligent summaries and explanations",
        },
        {
            icon: <Zap className="h-8 w-8" />,
            title: "Auto Quiz Generator",
            description: "Auto-generate quizzes from any document",
        },
        {
            icon: <Users className="h-8 w-8" />,
            title: "Kahoot-Style Games",
            description: "Play quizzes in group battles with friends",
        },
        {
            icon: <Mic className="h-8 w-8" />,
            title: "Voice Learning",
            description: "Hands-free learning with voice input/output",
        },
        {
            icon: <Globe className="h-8 w-8" />,
            title: "Multilingual",
            description: "Switch between English and Pidgin anytime",
        },
    ]

    const benefits = [
        "Save 10+ hours per week on studying",
        "Improve grades by up to 40%",
        "Learn at your own pace",
        "Master any subject with AI guidance",
    ]

    const sections = [
        { icon: <Zap className="h-5 w-5" />, label: "Features", href: "#features" },
        { icon: <BookOpen className="h-5 w-5" />, label: "How It Works", href: "#how-it-works" },
        { icon: <Users2 className="h-5 w-5" />, label: "Testimonials", href: "#testimonials" },
        { icon: <BarChart3 className="h-5 w-5" />, label: "Pricing", href: "#pricing" },
        { icon: <HelpCircle className="h-5 w-5" />, label: "FAQ", href: "#faq" },
        { icon: <Info className="h-5 w-5" />, label: "About", href: "#about" },
    ]

    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 lg:py-32">
                <div className="absolute inset-0 bg-gradient-hero opacity-5" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center">
                        <div className="inline-block mb-6 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                            <p className="text-sm font-medium text-primary">Join 10,000+ students learning smarter</p>
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
                            Turn Your Notes Into{" "}
                            <span className="bg-gradient-hero bg-clip-text text-transparent">AI-Powered Learning</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                            Instantly create quizzes, summaries, and audio lessons from your PDFs. Master any subject in English &
                            Pidgin with personalized learning experiences.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Link to="/signup">
                                <Button size="lg" className="min-w-[200px] bg-primary hover:bg-primary/90 text-primary-foreground">
                                    Start Learning Free
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <a href="#how-it-works">
                                <Button variant="outline" size="lg" className="min-w-[200px] bg-transparent">
                                    Watch Demo
                                </Button>
                            </a>
                        </div>

                        {/* Benefits */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                            {benefits.map((benefit) => (
                                <div key={benefit} className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                                    <span className="text-muted-foreground">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 bg-muted/20 border-y border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {sections.map((section) => (
                            <a key={section.href} href={section.href}>
                                <Button
                                    variant="outline"
                                    className="w-full h-auto flex flex-col items-center justify-center gap-2 py-4 bg-card hover:bg-primary/5 border-border hover:border-primary transition-all"
                                >
                                    <span className="text-primary">{section.icon}</span>
                                    <span className="text-xs font-medium text-center">{section.label}</span>
                                </Button>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Everything you need to{" "}
                            <span className="bg-gradient-secondary bg-clip-text text-transparent">excel academically</span>
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Designed for university students, college students, and secondary school students preparing for WAEC/UTME
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <Card
                                key={feature.title}
                                className="p-6 hover:shadow-card transition-all duration-300 border-0 bg-card shadow-sm hover:shadow-lg"
                            >
                                <div className="text-primary mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Preview */}
            <section id="how-it-works" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Get started in three simple steps</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: "1", title: "Upload", desc: "Upload your PDF or notes" },
                            { step: "2", title: "AI Processes", desc: "Our AI analyzes your content" },
                            { step: "3", title: "Learn", desc: "Get quizzes, summaries & more" },
                        ].map((item) => (
                            <div key={item.step} className="text-center">
                                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-primary">{item.step}</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                <p className="text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-20 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            What Students Say About <span className="bg-gradient-hero bg-clip-text text-transparent">Izabi</span>
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Join thousands of students transforming their learning experience
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Chioma Okafor",
                                role: "University Student",
                                quote: "Izabi helped me save 15 hours per week. My grades improved from B to A in just one semester!",
                                avatar: "CO",
                            },
                            {
                                name: "Tunde Adeyemi",
                                role: "UTME Candidate",
                                quote: "The AI-generated quizzes are incredibly accurate. I felt so prepared for my exams.",
                                avatar: "TA",
                            },
                            {
                                name: "Zainab Hassan",
                                role: "Secondary School Student",
                                quote: "Learning in Pidgin makes everything so much clearer. Izabi is a game-changer!",
                                avatar: "ZH",
                            },
                        ].map((testimonial) => (
                            <Card key={testimonial.name} className="p-6 bg-card border-0 shadow-sm hover:shadow-lg transition-all">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </div>
                                <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Choose the plan that works best for you</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Free",
                                price: "₦0",
                                description: "Perfect for trying out",
                                features: ["5 uploads/month", "Basic summaries", "Limited quizzes", "English only"],
                            },
                            {
                                name: "Pro",
                                price: "₦2,999",
                                description: "Most popular",
                                features: [
                                    "Unlimited uploads",
                                    "AI summaries",
                                    "Unlimited quizzes",
                                    "English & Pidgin",
                                    "Voice learning",
                                ],
                                highlighted: true,
                            },
                            {
                                name: "Premium",
                                price: "₦9,999",
                                description: "For serious learners",
                                features: [
                                    "Everything in Pro",
                                    "Priority support",
                                    "Advanced analytics",
                                    "Group battles",
                                    "Custom learning paths",
                                ],
                            },
                        ].map((plan) => (
                            <Card
                                key={plan.name}
                                className={`p-8 border-0 transition-all ${
                                    plan.highlighted
                                        ? "bg-gradient-hero/10 shadow-lg scale-105 ring-2 ring-primary"
                                        : "bg-card shadow-sm hover:shadow-lg"
                                }`}
                            >
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-muted-foreground mb-4">{plan.description}</p>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-muted-foreground">/month</span>
                                </div>
                                <Button
                                    className={`w-full mb-6 ${
                                        plan.highlighted ? "bg-primary hover:bg-primary/90" : "bg-muted text-foreground hover:bg-muted/80"
                                    }`}
                                >
                                    Get Started
                                </Button>
                                <ul className="space-y-3">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2 text-sm">
                                            <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-20 bg-muted/30">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                        <p className="text-lg text-muted-foreground">Have questions? We've got answers</p>
                    </div>
                    <div className="space-y-4">
                        {[
                            {
                                q: "How does Izabi work?",
                                a: "Simply upload your PDF or notes, and our AI instantly analyzes the content to generate summaries, quizzes, and learning materials tailored to your needs.",
                            },
                            {
                                q: "Is my data secure?",
                                a: "Yes, we use enterprise-grade encryption and comply with all data protection regulations. Your notes are never shared with third parties.",
                            },
                            {
                                q: "Can I use Izabi offline?",
                                a: "Currently, Izabi requires an internet connection. However, you can download your generated materials for offline access.",
                            },
                            {
                                q: "What file formats are supported?",
                                a: "We support PDF, DOCX, TXT, and image files (JPG, PNG). You can also paste text directly.",
                            },
                            {
                                q: "Is there a free trial?",
                                a: "Yes! Our Free plan gives you 5 uploads per month to try out all the core features.",
                            },
                            {
                                q: "Can I cancel anytime?",
                                a: "Absolutely. You can cancel your subscription at any time with no penalties or hidden fees.",
                            },
                        ].map((item, idx) => (
                            <Card key={idx} className="p-6 bg-card border-0 shadow-sm hover:shadow-lg transition-all">
                                <h4 className="font-semibold text-foreground mb-2">{item.q}</h4>
                                <p className="text-muted-foreground">{item.a}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">About Izabi</h2>
                        <p className="text-lg text-muted-foreground">Transforming education through AI-powered learning</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                            <p className="text-muted-foreground mb-4 leading-relaxed">
                                We believe every student deserves access to personalized, intelligent learning tools. Izabi was created
                                to bridge the gap between traditional studying and modern AI technology, making quality education
                                accessible to everyone.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                By combining cutting-edge AI with multilingual support, we're empowering students across Africa to learn
                                smarter, not harder.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { number: "10K+", label: "Active Students" },
                                { number: "50M+", label: "Pages Processed" },
                                { number: "95%", label: "Success Rate" },
                                { number: "2", label: "Languages" },
                            ].map((stat) => (
                                <Card key={stat.label} className="p-6 bg-gradient-hero/5 border-0 text-center">
                                    <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-hero/5 border-y border-border">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Study Smarter?</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Join thousands of students improving their grades with Izabi. Start your free trial today.
                    </p>
                    <Link to="/signup">
                        <Button size="lg" className="min-w-[250px] bg-primary hover:bg-primary/90 text-primary-foreground">
                            Get Started Now
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Home
