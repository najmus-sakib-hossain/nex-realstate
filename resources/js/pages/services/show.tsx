import { PageHero, Section } from '@/components/sections';
import { Button } from '@/components/ui/button';
import { FrontendLayout } from '@/layouts/frontend-layout';
import { useServices } from '@/hooks/use-cms';
import { useCMSStore } from '@/stores/cms-store';
import { Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';

interface ServiceShowPageProps {
    slug: string;
}

export default function ServiceShowPage({ slug }: ServiceShowPageProps) {
    const { services } = useCMSStore();
    const { data: serverServices } = useServices();
    const allServices = serverServices || services;
    const service = allServices.find(s => s.slug === slug);

    if (!service) {
        return (
            <FrontendLayout title="Service Not Found">
                <Section className="py-32 text-center">
                    <h1 className="mb-4 text-4xl font-bold">Service Not Found</h1>
                    <p className="mb-8 text-muted-foreground">The service you are looking for does not exist.</p>
                    <Button asChild>
                        <Link href="/services">Back to Services</Link>
                    </Button>
                </Section>
            </FrontendLayout>
        );
    }

    return (
        <FrontendLayout
            title={service.title}
            description={service.shortDescription}
        >
            <PageHero
                title={service.title}
                subtitle={service.shortDescription}
                backgroundImage={service.image.url}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Services', href: '/services' },
                    { label: service.title },
                ]}
            />

            <Section>
                <div className="grid gap-12 lg:grid-cols-2">
                    <div>
                        <h2 className="mb-6 text-3xl font-bold">Overview</h2>
                        <p className="mb-6 text-lg text-muted-foreground">
                            {service.fullDescription}
                        </p>
                        
                        <h3 className="mb-4 text-xl font-semibold">Key Features</h3>
                        <ul className="space-y-3">
                            {service.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8">
                            <Button size="lg" asChild>
                                <Link href="/contact">Inquire About This Service</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-lg shadow-lg">
                        <img 
                            src={service.image.url} 
                            alt={service.title} 
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
            </Section>
        </FrontendLayout>
    );
}
