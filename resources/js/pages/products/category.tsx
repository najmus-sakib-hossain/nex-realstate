import { ProjectCard } from '@/components/cards';
import { PageHero, Section } from '@/components/sections';
import { Button } from '@/components/ui/button';
import { FrontendLayout } from '@/layouts/frontend-layout';
import { useProductsContent, useProjects } from '@/hooks/use-cms';
import { useCMSStore } from '@/stores/cms-store';
import { Link } from '@inertiajs/react';
import { motion } from 'motion/react';

interface ProductCategoryPageProps {
    categorySlug: string;
}

export default function ProductCategoryPage({ categorySlug }: ProductCategoryPageProps) {
    const { productsContent, projects } = useCMSStore();
    const { data: serverContent } = useProductsContent();
    const { data: serverProjects } = useProjects();
    const content = serverContent || productsContent;
    const allProjects = serverProjects || projects;
    
    const category = content?.categories.find(c => c.slug === categorySlug);
    const filteredProjects = allProjects.filter(p => p.category === categorySlug);

    if (!category) {
        return (
            <FrontendLayout title="Category Not Found">
                <Section className="py-32 text-center">
                    <h1 className="mb-4 text-4xl font-bold">Category Not Found</h1>
                    <p className="mb-8 text-muted-foreground">The product category you are looking for does not exist.</p>
                    <Button asChild>
                        <Link href="/products">Back to Products</Link>
                    </Button>
                </Section>
            </FrontendLayout>
        );
    }

    return (
        <FrontendLayout
            title={category.title}
            description={category.description}
        >
            <PageHero
                title={category.title}
                subtitle={category.description}
                backgroundImage={category.image.url}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Products', href: '/products' },
                    { label: category.title },
                ]}
            />

            <Section>
                {filteredProjects.length > 0 ? (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {filteredProjects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <ProjectCard project={project} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <h3 className="mb-2 text-xl font-semibold">No properties found</h3>
                        <p className="text-muted-foreground">
                            We currently don't have any properties listed in this category.
                            Please check back later or contact us for more information.
                        </p>
                        <Button className="mt-6" asChild>
                            <Link href="/contact">Contact Us</Link>
                        </Button>
                    </div>
                )}
            </Section>
        </FrontendLayout>
    );
}
