import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { BackButton } from "@/components/BackButton"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, FileText, Mic, Users, Zap, Globe, BarChart3, Lock, Smartphone, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const Features = () => {
    const features = [
        {
            icon: <FileText className="h-12 w-12" />,
            title: "Smart Note Upload",
            description:
                "Upload PDFs, images, or text notes. Our AI instantly analyzes and processes your content with advanced OCR technology.",
            benefits: ["Supports multiple formats", "Instant processing", "High accuracy OCR"],
        },
        {
            icon: <Brain className="h-12 w-12" />,
            title: "AI-Powered Summaries",
            description:
                "Get concise, intelligent summaries of your notes. Perfect for quick reviews and understanding key concepts.",
            benefits: ["Customizable length", "Key points highlighted", "Multiple formats"],
        },
        {
            icon: <Zap className="h-12 w-12" />,
            title: "Auto Quiz Generator",
            description:
                "Automatically generate quizzes from your notes. Test your knowledge with multiple choice, true/false, and essay questions.",
            benefits: ["Multiple question types", "Difficulty levels", "Instant feedback"],
        },
        {
            icon: <Users className="h-12 w-12" />,
            title: "Kahoot-Style Games",
            description:
                "Challenge your friends in real-time quiz battles. Compete, learn, and have fun with interactive multiplayer games.",
            benefits: ["Real-time multiplayer", "Leaderboards", "Achievements"],
        },
        {
            icon: <Mic className="h-12 w-12" />,
            title: "Voice Learning",
            description:
                "Listen to your notes read aloud. Perfect for commuting, exercising, or multitasking while learning.",
            benefits: ["Natural voice synthesis", "Adjustable speed", "Offline access"],
        },
        {
            icon: <Globe className="h-12 w-12" />,
            title: "Multilingual Support",
            description: "Switch between English and Pidgin. Learn in your preferred language with full support for both.",
            benefits: ["English & Pidgin", "Instant translation", "Cultural context"],
        },
        {
            icon: <BarChart3 className="h-12 w-12" />,
            title: "Progress Tracking",
            description:
                "Monitor your learning progress with detailed analytics. See what you've mastered and where to focus.",
            benefits: ["Detailed analytics", "Performance insights", "Goal tracking"],
        },
        {
            icon: <Lock className="h-12 w-12" />,
            title: "Secure & Private",
            description: "Your notes and data are encrypted and secure. We never share your information with third parties.",
            benefits: ["End-to-end encryption", "GDPR compliant", "Data privacy"],
        },
        {
            icon: <Smartphone className="h-12 w-12" />,
            title: "Mobile App",
            description: "Learn on the go with our mobile app. Full functionality on iOS and Android devices.",
            benefits: ["iOS & Android", "Offline mode", "Sync across devices"],
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
                            Powerful Features for{" "}
                            <span className="bg-gradient-hero bg-clip-text text-transparent">Smarter Learning</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            Everything you need to transform your notes into personalized learning experiences
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature) => (
                            <Card
                                key={feature.title}
                                className="p-8 hover:shadow-card transition-all duration-300 border-0 bg-card shadow-sm hover:shadow-lg"
                            >
                                <div className="text-primary mb-4">{feature.icon}</div>
                                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground mb-6">{feature.description}</p>
                                <ul className="space-y-2">
                                    {feature.benefits.map((benefit) => (
                                        <li key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-hero/5 border-y border-border">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to experience all these features?</h2>
                    <Link to="/signup">
                        <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                            Start Free Trial
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Features
