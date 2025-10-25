import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { BackButton } from "@/components/BackButton"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Zap, BookOpen, Trophy, ArrowRight, CheckCircle } from "lucide-react"
import { Link } from "react-router-dom"

const HowItWorks = () => {
    const steps = [
        {
            icon: <Upload className="h-12 w-12" />,
            title: "Upload Your Notes",
            description: "Start by uploading your PDF, image, or text notes. Our system supports all common formats.",
            details: [
                "Drag and drop or click to upload",
                "Supports PDF, images, and text",
                "Instant file processing",
                "No file size limits",
            ],
        },
        {
            icon: <Zap className="h-12 w-12" />,
            title: "AI Analysis",
            description: "Our advanced AI analyzes your content, extracts key concepts, and understands the material.",
            details: [
                "Advanced OCR technology",
                "Natural language processing",
                "Concept extraction",
                "Context understanding",
            ],
        },
        {
            icon: <BookOpen className="h-12 w-12" />,
            title: "Generate Learning Materials",
            description: "Get summaries, quizzes, flashcards, and audio lessons automatically generated.",
            details: ["AI-powered summaries", "Auto-generated quizzes", "Interactive flashcards", "Voice-over audio"],
        },
        {
            icon: <Trophy className="h-12 w-12" />,
            title: "Learn & Master",
            description: "Study using your personalized materials, track progress, and compete with friends.",
            details: ["Personalized learning path", "Progress tracking", "Multiplayer games", "Achievement badges"],
        },
    ]

    const workflow = [
        { step: "1", title: "Create Account", time: "2 min" },
        { step: "2", title: "Upload Notes", time: "1 min" },
        { step: "3", title: "AI Processes", time: "30 sec" },
        { step: "4", title: "Start Learning", time: "Instant" },
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
                            How Izabi <span className="bg-gradient-hero bg-clip-text text-transparent">Works</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            Transform your notes into personalized learning experiences in just 4 simple steps
                        </p>
                    </div>
                </div>
            </section>

            {/* Steps */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-12">
                        {steps.map((step, index) => (
                            <div key={step.title} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div className={index % 2 === 1 ? "md:order-2" : ""}>
                                    <div className="text-primary mb-4">{step.icon}</div>
                                    <h2 className="text-3xl font-bold mb-4">{step.title}</h2>
                                    <p className="text-lg text-muted-foreground mb-6">{step.description}</p>
                                    <ul className="space-y-3">
                                        {step.details.map((detail) => (
                                            <li key={detail} className="flex items-center gap-3">
                                                <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                                                <span className="text-muted-foreground">{detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div
                                    className={`bg-gradient-hero/10 rounded-lg p-8 border border-primary/20 ${index % 2 === 1 ? "md:order-1" : ""}`}
                                >
                                    <div className="aspect-square bg-gradient-primary/20 rounded-lg flex items-center justify-center">
                                        <div className="text-6xl font-bold text-primary/30">{index + 1}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Timeline */}
            <section className="py-20 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">Get Started in Minutes</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {workflow.map((item) => (
                            <Card key={item.step} className="p-6 text-center border-0 bg-card shadow-sm">
                                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-xl font-bold text-primary">{item.step}</span>
                                </div>
                                <h3 className="font-semibold mb-2">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.time}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 border-t border-border">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to transform your learning?</h2>
                    <Link to="/signup">
                        <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                            Start Your Free Trial
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default HowItWorks
