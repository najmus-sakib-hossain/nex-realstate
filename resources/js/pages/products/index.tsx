import { PageHero, Section } from '@/components/sections';
import { Button } from '@/components/ui/button';
import { FrontendLayout } from '@/layouts/frontend-layout';
import { useProductsContent } from '@/hooks/use-cms';
import { useCMSStore } from '@/stores/cms-store';
import { Link } from '@inertiajs/react';
import { motion } from 'motion/react';
import {
    Building,
    Home,
    Hotel,
    Map,
    Palmtree,
    Hospital,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
    Home: <Home className="h-8 w-8 text-primary" />,
    Building: <Building className="h-8 w-8 text-primary" />,
    Map: <Map className="h-8 w-8 text-primary" />,
    Palmtree: <Palmtree className="h-8 w-8 text-primary" />,
    Hospital: <Hospital className="h-8 w-8 text-primary" />,
    Hotel: <Hotel className="h-8 w-8 text-primary" />,
};

export default function ProductsPage() {
    const { productsContent } = useCMSStore();
    const { data: serverContent } = useProductsContent();
    const content = serverContent || productsContent;

    if (!content) {
        return (
            <FrontendLayout
                title="Products"
                description="Explore our diverse range of property types and real estate solutions."
            >
                <PageHero
                    title="Products"
                    subtitle="Explore our offerings"
                    breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Products' }]}
                />
                <div className="flex min-h-[400px] items-center justify-center">
                    <p className="text-muted-foreground">Loading products...</p>
                </div>
            </FrontendLayout>
        );
    }

    return (
        <FrontendLayout
            title="Products"
            description="Explore our diverse range of property types and real estate solutions."
        >
            <PageHero
                title={content.heroSection.title}
                subtitle={content.heroSection.subtitle}
                backgroundImage={content.heroSection.backgroundImage.url}
                breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Products' }]}
            />

            <Section>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {content.categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md"
                        >
                            <div className="mb-4 inline-flex rounded-full bg-primary/10 p-3">
                                {iconMap[category.icon] || <Home className="h-8 w-8 text-primary" />}
                            </div>
                            <h3 className="mb-2 text-xl font-bold">{category.title}</h3>
                            <p className="mb-4 text-muted-foreground">
                                {category.description}
                            </p>
                            <Button variant="outline" asChild className="w-full">
                                <Link href={`/products/${category.slug}`}>
                                    View {category.title}
                                </Link>
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </Section>
        </FrontendLayout>
    );
}
