import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FrontendLayout } from '@/layouts/frontend-layout';
import { useProjects } from '@/hooks/use-cms';
import { useCMSStore } from '@/stores/cms-store';
import type { Project } from '@/types/cms';
import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    Download,
    Expand,
    MapPin,
    Phone,
    Share2,
} from 'lucide-react';
import { useState } from 'react';
import { Section } from '@/components/sections';
import { Link } from '@inertiajs/react';

interface ProjectDetailPageProps {
    id: string;
}

export default function ProjectDetailPage({ id }: ProjectDetailPageProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const { projects } = useCMSStore();
    const { data: serverProjects } = useProjects();
    const allProjects = serverProjects || projects;
    const project = allProjects.find(p => p.id === id || p.slug === id);

    const formatPrice = (price: number) => {
        if (price >= 10000000) {
            return `৳${(price / 10000000).toFixed(2)} Cr`;
        }
        return `৳${(price / 100000).toFixed(2)} Lac`;
    };

    if (!project) {
        return (
            <FrontendLayout title="Project Not Found">
                <Section className="py-32 text-center">
                    <h1 className="mb-4 text-4xl font-bold">Project Not Found</h1>
                    <p className="mb-8 text-muted-foreground">The project you are looking for does not exist.</p>
                    <Button asChild>
                        <Link href="/projects">Back to Projects</Link>
                    </Button>
                </Section>
            </FrontendLayout>
        );
    }

    return (
        <FrontendLayout>
            <div className='flex items-center justify-center flex-col w-full'>
                {/* Back Button */}
                <div className="container py-4">
                    <Button variant="ghost" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Projects
                    </Button>
                </div>

                {/* Image Gallery */}
                <section className="container pb-8">
                    <div className="grid gap-4 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <div className="relative aspect-video overflow-hidden rounded-lg">
                                <img
                                    src={project.images[selectedImage]?.url || project.images[0]?.url}
                                    alt={project.title}
                                    className="h-full w-full object-cover"
                                />
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="absolute bottom-4 right-4"
                                >
                                    <Expand className="mr-2 h-4 w-4" />
                                    View Full Gallery
                                </Button>
                            </div>
                            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                                {project.images.map((image, index) => (
                                    <button
                                        key={image.id}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-shrink-0 overflow-hidden rounded-lg border-2 ${selectedImage === index
                                                ? 'border-primary'
                                                : 'border-transparent'
                                            }`}
                                    >
                                        <img
                                            src={image.url}
                                            alt={`View ${index + 1}`}
                                            className="h-16 w-24 object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quick Info Card */}
                        <Card className='relative'>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <Badge
                                        variant={
                                            project.status === 'ongoing'
                                                ? 'default'
                                                : project.status === 'completed'
                                                    ? 'secondary'
                                                    : 'outline'
                                        }
                                    >
                                        {project.status}
                                    </Badge>
                                    <Button variant="ghost" size="icon">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardTitle className="text-2xl">{project.title}</CardTitle>
                                <p className="text-muted-foreground">{project.description}</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>{project.location}</span>
                                </div>

                                <div className="rounded-lg bg-muted p-4">
                                    <div className="text-sm text-muted-foreground">Price</div>
                                    <div className="text-2xl font-bold text-primary">
                                        {project.price}
                                    </div>
                                    {project.priceRange && (
                                        <div className="text-sm text-muted-foreground">
                                            Range: {formatPrice(project.priceRange.min)} - {formatPrice(project.priceRange.max)}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span>
                                            Completion: {project.specifications?.completion || 'Dec 2025'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                        <span>
                                            {project.specifications?.units || 0} Units
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2 absolute bottom-0 left-0 w-full px-6 py-4">
                                    <Button className="w-full" size="lg">
                                        <Phone className="mr-2 h-4 w-4" />
                                        Contact Sales
                                    </Button>
                                    <Button variant="outline" className="w-full">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Brochure
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Project Details */}
                <section className="container pb-16">
                    <Tabs defaultValue="overview">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="amenities">Amenities</TabsTrigger>
                            <TabsTrigger value="location">Location</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="mt-6">
                            <div className="grid gap-8 lg:grid-cols-3">
                                <div className="lg:col-span-2 space-y-6">
                                    <div>
                                        <h2 className="mb-4 text-2xl font-bold">About This Project</h2>
                                        <p className="text-muted-foreground whitespace-pre-line">
                                            {project.fullDescription}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="mb-4 text-xl font-semibold">Key Features</h3>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {project.features.map((feature) => (
                                                <div
                                                    key={feature}
                                                    className="flex items-center gap-2"
                                                >
                                                    <CheckCircle className="h-4 w-4 text-primary" />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Project Specifications</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <dl className="space-y-4">
                                                <div className="flex justify-between">
                                                    <dt className="text-muted-foreground">
                                                        Category
                                                    </dt>
                                                    <dd className="font-medium capitalize">
                                                        {project.category}
                                                    </dd>
                                                </div>
                                                {project.specifications?.landArea && (
                                                    <div className="flex justify-between">
                                                        <dt className="text-muted-foreground">
                                                            Land Area
                                                        </dt>
                                                        <dd className="font-medium">
                                                            {project.specifications.landArea}
                                                        </dd>
                                                    </div>
                                                )}
                                                {project.specifications?.floors && (
                                                    <div className="flex justify-between">
                                                        <dt className="text-muted-foreground">
                                                            Total Floors
                                                        </dt>
                                                        <dd className="font-medium">{project.specifications.floors}</dd>
                                                    </div>
                                                )}
                                                {project.specifications?.units && (
                                                    <div className="flex justify-between">
                                                        <dt className="text-muted-foreground">
                                                            Total Units
                                                        </dt>
                                                        <dd className="font-medium">
                                                            {project.specifications.units}
                                                        </dd>
                                                    </div>
                                                )}
                                                {project.specifications?.parking && (
                                                    <div className="flex justify-between">
                                                        <dt className="text-muted-foreground">
                                                            Parking
                                                        </dt>
                                                        <dd className="font-medium">
                                                            {project.specifications.parking} spaces
                                                        </dd>
                                                    </div>
                                                )}
                                                <div className="flex justify-between">
                                                    <dt className="text-muted-foreground">Status</dt>
                                                    <dd className="font-medium capitalize">
                                                        {project.status}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="amenities" className="mt-6">
                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {project.amenities.map((amenity) => (
                                    <div
                                        key={amenity}
                                        className="flex items-center gap-3 rounded-lg border p-4"
                                    >
                                        <CheckCircle className="h-5 w-5 text-primary" />
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="location" className="mt-6">
                            <div className="grid gap-8 lg:grid-cols-2">
                                <div>
                                    <h3 className="mb-4 text-xl font-semibold">Location Details</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                                            <div>
                                                <div className="font-medium">Address</div>
                                                <div className="text-muted-foreground">
                                                    {project.address}
                                                </div>
                                                <div className="text-muted-foreground">
                                                    {project.location}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <h4 className="mb-4 mt-8 text-lg font-semibold">Nearby Places</h4>
                                    <div className="space-y-3">
                                        {[
                                            { name: 'Airport', distance: '15 min' },
                                            { name: 'Shopping Mall', distance: '5 min' },
                                            { name: 'Hospital', distance: '10 min' },
                                            { name: 'School', distance: '8 min' },
                                            { name: 'Metro Station', distance: '12 min' },
                                        ].map((place) => (
                                            <div
                                                key={place.name}
                                                className="flex items-center justify-between"
                                            >
                                                <span>{place.name}</span>
                                                <span className="text-muted-foreground">
                                                    {place.distance}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="aspect-video rounded-lg bg-muted">
                                    {/* Map placeholder */}
                                    <div className="flex h-full items-center justify-center text-muted-foreground">
                                        <div className="text-center">
                                            <MapPin className="mx-auto mb-2 h-12 w-12" />
                                            <p>Interactive Map</p>
                                            <p className="text-sm">{project.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </section>

                {/* Related Projects CTA */}
                <section className="bg-muted/50 py-16 min-w-full flex items-center justify-center">
                    <div className="container text-center">
                        <h2 className="mb-4 text-2xl font-bold">Interested in This Project?</h2>
                        <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
                            Schedule a site visit or talk to our sales team to learn more about
                            {project.title} and find your perfect home.
                        </p>
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Button size="lg">
                                <Phone className="mr-2 h-4 w-4" />
                                Call +880 1234-567890
                            </Button>
                            <Button size="lg" variant="outline">
                                Schedule Site Visit
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </FrontendLayout>
    );
}
