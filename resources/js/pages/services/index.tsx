import { ServiceCard } from '@/components/cards';
import { PageHero, Section, SectionHeader } from '@/components/sections';
import { FrontendLayout } from '@/layouts/frontend-layout';
import { useServicesContent, useServices } from '@/hooks/use-cms';
import { useCMSStore } from '@/stores/cms-store';
import { motion } from 'motion/react';
import {
    Building,
    ClipboardList,
    Headphones,
    Home,
    Map,
    MessageSquare,
    Palette,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
    ClipboardList: <ClipboardList className="h-6 w-6 text-primary" />,
    MessageSquare: <MessageSquare className="h-6 w-6 text-primary" />,
    Home: <Home className="h-6 w-6 text-primary" />,
    Map: <Map className="h-6 w-6 text-primary" />,
    HardHat: <Building className="h-6 w-6 text-primary" />,
    Palette: <Palette className="h-6 w-6 text-primary" />,
    HeadphonesIcon: <Headphones className="h-6 w-6 text-primary" />,
};

export default function ServicesPage() {
    const { servicesContent, services } = useCMSStore();
    const { data: serverContent } = useServicesContent();
    const { data: serverServices } = useServices();
    const content = serverContent || servicesContent;
    const allServices = serverServices || services;

    if (!content || !allServices) {
        return (
            <FrontendLayout
                title="Services"
                description="Comprehensive real estate solutions tailored to your needs."
            >
                <PageHero
                    title="Our Services"
                    subtitle="Comprehensive real estate solutions"
                    breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Services' }]}
                />
                <div className="flex min-h-[400px] items-center justify-center">
                    <p className="text-muted-foreground">Loading services...</p>
                </div>
            </FrontendLayout>
        );
    }

    return (
        <FrontendLayout
            title="Services"
            description="Comprehensive real estate solutions tailored to your needs."
        >
            {/* Hero */}
            <PageHero
                title={content.heroSection.title}
                subtitle={content.heroSection.subtitle}
                backgroundImage={content.heroSection.backgroundImage.url}
                breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Services' }]}
            />

            {/* Services Grid */}
            <Section>
                <SectionHeader
                    title="What We Offer"
                    subtitle="End-to-end real estate services for every need"
                />
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {allServices.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <ServiceCard
                                title={service.title}
                                description={service.shortDescription}
                                icon={iconMap[service.icon] || <Building className="h-6 w-6 text-primary" />}
                                image={service.image.url}
                                href={`/services/${service.slug}`}
                            />
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* Why Choose Us */}
            <Section className="bg-muted/50">
                <SectionHeader
                    title={content.whyChooseUs.title}
                    subtitle={content.whyChooseUs.subtitle}
                />
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {content.whyChooseUs.points.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                                {index + 1}
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                            <p className="text-muted-foreground">{item.description}</p>
                        </motion.div>
                    ))}
                </div>
            </Section>
        </FrontendLayout>
    );
}
