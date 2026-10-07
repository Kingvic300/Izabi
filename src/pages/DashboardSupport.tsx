import { Link } from 'react-router-dom';
import { Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/dashboard/PageHeader';

const SUPPORT_EMAIL = 'victor7ishola@gmail.com';
const WHATSAPP_LINK = 'https://wa.me/2348144782521';

export default function DashboardSupport() {
    return (
        <div className="w-full space-y-10 pb-16">
            <PageHeader
                title="Help"
                description="Stuck on something? Message us. WhatsApp is usually fastest."
            />

            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2">
                <section className="bg-card p-6 sm:p-7">
                    <MessageCircle className="h-5 w-5 text-muted-foreground" />
                    <h3 className="mt-4 text-2xl">WhatsApp</h3>
                    <p className="tabular mt-1 text-muted-foreground">
                        +234 814 478 2521
                    </p>
                    <Button asChild className="mt-6">
                        <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
                            Chat on WhatsApp
                        </a>
                    </Button>
                </section>
                <section className="bg-card p-6 sm:p-7">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <h3 className="mt-4 text-2xl">Email</h3>
                    <p className="mt-1 break-all text-muted-foreground">
                        {SUPPORT_EMAIL}
                    </p>
                    <Button asChild variant="outline" className="mt-6">
                        <a href={`mailto:${SUPPORT_EMAIL}`}>Send an email</a>
                    </Button>
                </section>
            </div>

            <section>
                <h3 className="text-2xl">Quick answers</h3>
                <p className="mt-1 text-muted-foreground">
                    Uploads, languages, plans and accounts.
                </p>
                <Button asChild variant="link" className="mt-3">
                    <Link to="/faq">Read the questions and answers</Link>
                </Button>
            </section>
        </div>
    );
}
