import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { BackButton } from "@/components/BackButton"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const FAQ = () => {
    const faqs = [
        {
            category: "Getting Started",
            items: [
                {
                    q: "How do I create an account?",
                    a: "Click 'Get Started' and fill in your email and password. You'll receive a verification email to confirm your account.",
                },
                {
                    q: "What file formats do you support?",
                    a: "We support PDF, images (JPG, PNG), and text files. You can also paste text directly into the app.",
                },
                {
                    q: "Is there a file size limit?",
                    a: "No, there's no file size limit. Upload documents as large as you need.",
                },
                {
                    q: "Can I upload multiple files at once?",
                    a: "Yes, you can upload multiple files simultaneously. They'll be processed in parallel.",
                },
            ],
        },
        {
            category: "Features",
            items: [
                {
                    q: "How does the AI summary work?",
                    a: "Our AI analyzes your content and extracts key concepts, then generates a concise summary highlighting the most important information.",
                },
                {
                    q: "Can I customize quiz difficulty?",
                    a: "Yes, you can choose from easy, medium, and hard difficulty levels for generated quizzes.",
                },
                {
                    q: "Does voice learning work offline?",
                    a: "Yes, you can download audio lessons and listen offline on the mobile app.",
                },
                {
                    q: "How many languages are supported?",
                    a: "Currently, we support English and Pidgin. More languages are coming soon.",
                },
            ],
        },
        {
            category: "Subscription",
            items: [
                {
                    q: "Can I change my plan anytime?",
                    a: "Yes, you can upgrade or downgrade your plan anytime. Changes take effect immediately.",
                },
                {
                    q: "What happens if I cancel?",
                    a: "Your account will be downgraded to the Free plan. You'll keep access to your study materials.",
                },
                {
                    q: "Do you offer refunds?",
                    a: "Yes, we offer a 30-day money-back guarantee if you're not satisfied.",
                },
                {
                    q: "Is there a student discount?",
                    a: "Yes, students get 30% off with a valid student ID. Contact support for details.",
                },
            ],
        },
        {
            category: "Technical",
            items: [
                {
                    q: "Is my data secure?",
                    a: "Yes, all data is encrypted end-to-end. We comply with GDPR and other privacy regulations.",
                },
                {
                    q: "Can I export my data?",
                    a: "Yes, you can export all your study materials and progress data anytime.",
                },
                {
                    q: "What devices are supported?",
                    a: "Izabi works on web browsers, iOS, and Android. Full sync across all devices.",
                },
                {
                    q: "How often is the app updated?",
                    a: "We release updates weekly with new features and improvements.",
                },
            ],
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
                            Frequently Asked <span className="bg-gradient-hero bg-clip-text text-transparent">Questions</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            Find answers to common questions about Izabi
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-12">
                        {faqs.map((category) => (
                            <div key={category.category}>
                                <h2 className="text-2xl font-bold mb-6">{category.category}</h2>
                                <Accordion type="single" collapsible className="space-y-4">
                                    {category.items.map((item, index) => (
                                        <AccordionItem
                                            key={index}
                                            value={`${category.category}-${index}`}
                                            className="border-0 bg-card rounded-lg px-6 shadow-sm"
                                        >
                                            <AccordionTrigger className="hover:no-underline py-4">
                                                <span className="text-left font-semibold">{item.q}</span>
                                            </AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground pb-4">{item.a}</AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default FAQ
