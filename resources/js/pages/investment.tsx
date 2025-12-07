import { PageHero, Section, SectionHeader } from '@/components/sections';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FrontendLayout } from '@/layouts/frontend-layout';
import { useInvestmentContent } from '@/hooks/use-cms';
import { useCMSStore } from '@/stores/cms-store';
import { Link } from '@inertiajs/react';
import { motion } from 'motion/react';
import { ArrowRight, Eye, Grid, TrendingUp, Users } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
    TrendingUp: <TrendingUp className="h-8 w-8 text-primary" />,
    Users: <Users className="h-8 w-8 text-primary" />,
    Eye: <Eye className="h-8 w-8 text-primary" />,
    Grid: <Grid className="h-8 w-8 text-primary" />,
};

export default function InvestmentPage() {
    const { investmentContent } = useCMSStore();
    const { data: serverContent } = useInvestmentContent();
    const content = serverContent || investmentContent;

    if (!content) {
        return (
            <FrontendLayout
                title="Investment"
                description="Explore investment opportunities with Nex Real Estate."
            >
                <PageHero
                    title="Investment"
                    subtitle="Invest with confidence"
                    breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Investment' }]}
                />
                <div className="flex min-h-[400px] items-center justify-center">
                    <p className="text-muted-foreground">Loading content...</p>
                </div>
            </FrontendLayout>
        );
    }

    return (
        <FrontendLayout
            title="Investment"
            description="Explore investment opportunities with Nex Real Estate."
        >
            {/* Hero */}
            <PageHero
                title={content.heroSection.title}
                subtitle={content.heroSection.subtitle}
                backgroundImage={content.heroSection.backgroundImage.url}
                breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Investment' }]}
            />

            {/* Why Invest */}
            <Section>
                <SectionHeader
                    title={content.whyInvest.title}
                    subtitle={content.whyInvest.content}
                />
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {content.whyInvest.points.map((point, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full text-center">
                                <CardContent className="p-6">
                                    <div className="mx-auto mb-4 inline-flex rounded-full bg-primary/10 p-4">
                                        {iconMap[point.icon] || <TrendingUp className="h-8 w-8 text-primary" />}
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold">{point.title}</h3>
                                    <p className="text-muted-foreground">{point.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* ROI Projections */}
            <Section className="bg-muted/50">
                <SectionHeader
                    title="ROI Projections"
                    subtitle="Expected returns on your investment"
                />
                <div className="grid gap-8 md:grid-cols-3">
                    {content.roiProjections.map((roi, index) => (
                        <motion.div
                            key={roi.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full">
                                <CardContent className="p-6 text-center">
                                    <div className="mb-4 text-5xl font-bold text-primary">
                                        {roi.percentage}
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold">{roi.title}</h3>
                                    <p className="mb-4 text-muted-foreground">{roi.description}</p>
                                    <p className="text-sm font-medium text-primary">
                                        Timeframe: {roi.timeframe}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* Landowner Partnership */}
            <Section>
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="mb-6 text-3xl font-bold">
                            {content.landOwnerPartnership.title}
                        </h2>
                        <p className="mb-6 text-muted-foreground">
                            {content.landOwnerPartnership.content}
                        </p>
                        <ul className="mb-8 space-y-3">
                            {content.landOwnerPartnership.benefits.map((benefit, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-primary" />
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                        <Button asChild>
                            <Link href="/contact">
                                Become a Partner
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="aspect-[4/3] overflow-hidden rounded-lg"
                    >
                        <img
                            src={content.landOwnerPartnership.image.url}
                            alt="Landowner Partnership"
                            className="h-full w-full object-cover shadow-lg"
                        />
                    </motion.div>
                </div>
            </Section>

            {/* Joint Venture */}
            <Section className="bg-primary text-primary-foreground">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="order-2 aspect-[4/3] overflow-hidden rounded-lg lg:order-1"
                    >
                        <img
                            src={content.jointVenture.image.url}
                            alt="Joint Venture"
                            className="h-full w-full object-cover shadow-lg"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="order-1 lg:order-2"
                    >
                        <h2 className="mb-6 text-3xl font-bold">
                            {content.jointVenture.title}
                        </h2>
                        <p className="mb-6 text-primary-foreground/80">
                            {content.jointVenture.content}
                        </p>
                        <ul className="mb-8 space-y-3">
                            {content.jointVenture.benefits.map((benefit, i) => (
                                <li key={i} className="flex items-center gap-2 text-primary-foreground/90">
                                    <span className="h-2 w-2 rounded-full bg-primary-foreground" />
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                        <Button variant="secondary" asChild>
                            <Link href="/contact">
                                Explore JV Opportunities
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </Section>

            {/* CTA */}
            <Section className="bg-primary text-primary-foreground">
                <div className="text-center">
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                        Ready to Invest?
                    </h2>
                    <p className="mx-auto mb-8 max-w-2xl text-primary-foreground/90">
                        Let our experts guide you through the best investment opportunities
                        tailored to your goals.
                    </p>
                    <Button size="lg" variant="secondary" asChild>
                        <Link href="/contact">Schedule a Consultation</Link>
                    </Button>
                </div>
            </Section>
        </FrontendLayout>
    );
}
