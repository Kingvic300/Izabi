import { Link } from 'react-router-dom';
import { Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    MarketingPage,
    MarketingSection,
} from '@/components/marketing/MarketingPage';

const SUPPORT_EMAIL = 'victor7ishola@gmail.com';
const WHATSAPP_DISPLAY = '+234 814 478 2521';
const WHATSAPP_LINK = 'https://wa.me/2348144782521';

const Contact = () => {
    return (
        <MarketingPage
            title="Talk to us"
            intro="Trouble with your account, a payment, or a study tool? Reach us directly."
        >
            <MarketingSection
                title="Two ways to reach us"
                intro="WhatsApp is usually fastest."
            >
                <div className="grid grid-cols-1 divide-y divide-border border-y border-border md:grid-cols-2 md:divide-x md:divide-y-0">
                    <div className="py-8 md:pr-8">
                        <MessageCircle className="h-5 w-5 text-muted-foreground" />
                        <h3 className="mt-4 text-2xl">WhatsApp</h3>
                        <p className="tabular mt-2 text-lg">{WHATSAPP_DISPLAY}</p>
                        <Button asChild className="mt-6">
                            <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
                                Chat on WhatsApp
                            </a>
                        </Button>
                    </div>
                    <div className="py-8 md:pl-8">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <h3 className="mt-4 text-2xl">Email</h3>
                        <p className="mt-2 break-all text-lg">{SUPPORT_EMAIL}</p>
                        <Button asChild variant="outline" className="mt-6">
                            <a href={`mailto:${SUPPORT_EMAIL}`}>Send an email</a>
                        </Button>
                    </div>
                </div>
            </MarketingSection>

            <MarketingSection
                title="Before you write"
                intro="Most questions about uploads, languages and plans are already answered."
                className="border-b-0"
            >
                <Button asChild variant="link">
                    <Link to="/faq">Read the questions and answers</Link>
                </Button>
            </MarketingSection>
        </MarketingPage>
    );
};

export default Contact;
