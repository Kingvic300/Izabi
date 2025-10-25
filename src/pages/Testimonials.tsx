import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { BackButton } from "@/components/BackButton"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const Testimonials = () => {
    const testimonials = [
        {
            name: "Chioma Okafor",
            role: "University Student",
            image: "/placeholder-user.jpg",
            initials: "CO",
            rating: 5,
            text: "Izabi completely changed how I study. I went from struggling with my notes to acing my exams. The quiz generator is a lifesaver!",
        },
        {
            name: "Tunde Adeyemi",
            role: "UTME Candidate",
            image: "/placeholder-user.jpg",
            initials: "TA",
            rating: 5,
            text: "The voice learning feature is amazing. I can study while commuting. My grades improved by 35% in just 3 months!",
        },
        {
            name: "Zainab Hassan",
            role: "Secondary School Student",
            image: "/placeholder-user.jpg",
            initials: "ZH",
            rating: 5,
            text: "I love the Kahoot-style games. Learning with friends makes it so much fun. Izabi makes studying feel less like a chore.",
        },
        {
            name: "Emeka Nwosu",
            role: "College Student",
            image: "/placeholder-user.jpg",
            initials: "EN",
            rating: 5,
            text: "The AI summaries save me hours every week. I can focus on understanding concepts instead of rewriting notes.",
        },
        {
            name: "Amara Obi",
            role: "University Student",
            image: "/placeholder-user.jpg",
            initials: "AO",
            rating: 5,
            text: "Izabi's multilingual support is perfect. I can study in Pidgin when I want to. It makes learning more relatable.",
        },
        {
            name: "Seun Oluwaseun",
            role: "WAEC Candidate",
            image: "/placeholder-user.jpg",
            initials: "SO",
            rating: 5,
            text: "The progress tracking helps me see exactly what I need to work on. I'm now top of my class!",
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
                            Loved by <span className="bg-gradient-hero bg-clip-text text-transparent">10,000+ Students</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            See what students are saying about their learning journey with Izabi
                        </p>
                    </div>
                </div>
            </section>

            {/* Testimonials Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial) => (
                            <Card
                                key={testimonial.name}
                                className="p-8 border-0 bg-card shadow-sm hover:shadow-card transition-all duration-300"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <Avatar>
                                        <AvatarImage src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
                                        <AvatarFallback>{testimonial.initials}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold">{testimonial.name}</h3>
                                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                    ))}
                                </div>
                                <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-20 bg-muted/30 border-y border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                            <p className="text-muted-foreground">Active Students</p>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-secondary mb-2">4.9/5</div>
                            <p className="text-muted-foreground">Average Rating</p>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-accent mb-2">40%</div>
                            <p className="text-muted-foreground">Grade Improvement</p>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                            <p className="text-muted-foreground">Quizzes Generated</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Testimonials
