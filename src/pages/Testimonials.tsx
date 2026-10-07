import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MarketingPage } from '@/components/marketing/MarketingPage';
import { TESTIMONIALS } from '@/config/testimonials';

const Testimonials = () => {
    return (
        <MarketingPage
            title="Student stories"
            intro="What students tell us after a term of studying with Izabi."
        >
            <section className="page-gutter py-16 sm:py-20">
                <div className="grid grid-cols-1 gap-x-12 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
                    {TESTIMONIALS.map((item) => (
                        <figure
                            key={item.name}
                            className="border-t border-sheet/40 pt-6"
                        >
                            <blockquote className="font-display text-xl italic leading-snug sm:text-[1.375rem]">
                                “{item.quote}”
                            </blockquote>
                            <figcaption className="mt-5 text-sm">
                                <span className="font-bold">{item.name}</span>
                                <span className="text-muted-foreground">
                                    , {item.role}
                                </span>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </section>

            <section className="page-gutter border-t border-border py-16 sm:py-20">
                <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                    <h2 className="text-[1.75rem] sm:text-[2rem]">
                        Write your own story this term.
                    </h2>
                    <Button asChild size="lg">
                        <Link to="/signup">Create a free account</Link>
                    </Button>
                </div>
            </section>
        </MarketingPage>
    );
};

export default Testimonials;
