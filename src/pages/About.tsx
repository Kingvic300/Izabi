import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { BackButton } from "@/components/BackButton"
import { Card } from "@/components/ui/card"
import { Users, Target, Lightbulb, Heart } from "lucide-react"

const About = () => {
    const values = [
        {
            icon: <Target className="h-8 w-8" />,
            title: "Mission",
            description: "Democratize quality education by making personalized learning accessible to every student.",
        },
        {
            icon: <Lightbulb className="h-8 w-8" />,
            title: "Innovation",
            description: "Continuously push the boundaries of AI-powered learning to create better educational outcomes.",
        },
        {
            icon: <Heart className="h-8 w-8" />,
            title: "Student-Centric",
            description: "Every feature is designed with students in mind, prioritizing their learning success.",
        },
        {
            icon: <Users className="h-8 w-8" />,
            title: "Community",
            description: "Build a supportive community where students learn together and grow together.",
        },
    ]

    const team = [
        {
            name: "Chioma Okafor",
            role: "Founder & CEO",
            bio: "EdTech entrepreneur with 10+ years in AI and education",
            initials: "CO",
        },
        {
            name: "Tunde Adeyemi",
            role: "CTO",
            bio: "AI researcher and full-stack developer",
            initials: "TA",
        },
        {
            name: "Zainab Hassan",
            role: "Head of Product",
            bio: "Product designer focused on user experience",
            initials: "ZH",
        },
        {
            name: "Emeka Nwosu",
            role: "Head of Education",
            bio: "Curriculum expert and learning specialist",
            initials: "EN",
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
                            About <span className="bg-gradient-hero bg-clip-text text-transparent">Izabi</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            We're on a mission to transform education through AI-powered personalized learning
                        </p>
                    </div>
                </div>
            </section>

            {/* Story */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-invert max-w-none">
                        <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                            Izabi was born from a simple observation: students spend countless hours studying, yet many struggle to
                            retain information and improve their grades. We realized that the problem wasn't the students—it was the
                            tools they were using.
                        </p>
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                            In 2023, our founder Chioma Okafor started Izabi with a vision to leverage artificial intelligence to
                            create personalized learning experiences that adapt to each student's unique needs. Today, we're proud to
                            serve over 10,000 students across Africa.
                        </p>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Our platform has helped students improve their grades by an average of 40%, save 10+ hours per week on
                            studying, and most importantly, fall in love with learning again.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-muted/30 border-y border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value) => (
                            <Card key={value.title} className="p-6 border-0 bg-card shadow-sm text-center">
                                <div className="text-primary mb-4 flex justify-center">{value.icon}</div>
                                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                                <p className="text-muted-foreground">{value.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member) => (
                            <Card key={member.name} className="p-6 border-0 bg-card shadow-sm text-center">
                                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-xl font-bold text-primary-foreground">{member.initials}</span>
                                </div>
                                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                                <p className="text-sm text-primary mb-3">{member.role}</p>
                                <p className="text-sm text-muted-foreground">{member.bio}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default About
