import { ProjectCard, ServiceCard, TestimonialCard } from '@/components/cards';
import { Section, SectionHeader } from '@/components/sections';
import { Button } from '@/components/ui/button';
import { FrontendLayout } from '@/layouts/frontend-layout';
import { useHomeContent, useServices, useTestimonials } from '@/hooks/use-cms';
import { useCMSStore } from '@/stores/cms-store';
import { Link } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import {
    ArrowRight,
    Building,
    ClipboardList,
    Crown,
    Headphones,
    Home,
    Map,
    MessageSquare,
    Palette,
    Shield,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
    Shield: <Shield className="h-6 w-6 text-primary" />,
    Home: <Home className="h-6 w-6 text-primary" />,
    Crown: <Crown className="h-6 w-6 text-primary" />,
    ClipboardList: <ClipboardList className="h-6 w-6 text-primary" />,
    MessageSquare: <MessageSquare className="h-6 w-6 text-primary" />,
    Map: <Map className="h-6 w-6 text-primary" />,
    Building: <Building className="h-6 w-6 text-primary" />,
    Palette: <Palette className="h-6 w-6 text-primary" />,
    HeadphonesIcon: <Headphones className="h-6 w-6 text-primary" />,
};

export default function HomePage() {
    // Get content from Zustand store (auto-updates when admin saves changes)
    const { homeContent, services: allServices, testimonials: storeTestimonials } = useCMSStore();

    // Fetch server content (populates store on success)
    const { data: serverHomeContent } = useHomeContent();
    const { data: serverServices } = useServices();
    const { data: serverTestimonials } = useTestimonials();

    const content = serverHomeContent || homeContent!;
    const services = (serverServices || allServices).slice(0, 6);
    const testimonials = serverTestimonials || storeTestimonials;

    const heroBackground = content.heroBanner.backgroundImage;
    const heroBackgroundUrl =
        heroBackground?.url ||
        'https://images.unsplash.com/photo-1544829728-e5cb9eedc20e?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    const heroBackgroundAlt = heroBackground?.alt || 'Clear blue sky';
    const heroForegroundImage = content.heroBanner.foregroundImage;
    const heroForegroundUrl = heroForegroundImage?.url || '/building.png';
    const heroForegroundAlt = heroForegroundImage?.alt || 'Transparent modern building';

    // Parallax effect for the hero section
    const heroRef = useRef<HTMLDivElement>(null);
    const [isHeroVisible, setIsHeroVisible] = useState(true);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });

    // Building moves up as user scrolls (starts from bottom, moves up)
    const buildingY = useTransform(scrollYProgress, [0, 1], ['5%', '0%']);
    // Text fades out as building covers it
    const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Hide the text completely when scrolled past hero section
    useEffect(() => {
        const handleScroll = () => {
            if (heroRef.current) {
                const heroBottom = heroRef.current.getBoundingClientRect().bottom;
                // Hide when hero section is scrolled past (bottom of hero is above viewport top)
                setIsHeroVisible(heroBottom > 100);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial state

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <FrontendLayout
            title="Home"
            description="Discover premium properties, connect with trusted experts, and find a space that perfectly reflects your lifestyle — only at Nex Real Estate."
        >
            {/* Custom Hero Section with Blue Sky and Parallax Building */}
            <div
                ref={heroRef}
                className="relative flex min-h-[92.5vh] lg:min-h-[95vh] items-center justify-center overflow-hidden"
            >
                {/* Clear Blue Sky Background Image */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url(${heroBackgroundUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />

                {/* Content Layer - z-index 10 */}
                {isHeroVisible && (
                    <motion.div
                        className="fixed top-[25%] md:top-[15%] lg:top-32 left-1/2 translate-x-[-50%] px-4 text-center w-full lg:w-[80%] overflow-hidden"
                        style={{ opacity: textOpacity }}
                    >
                        <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-white drop-shadow-lg">
                            {content.heroBanner.title}
                        </h1>
                        <p className="mx-auto mt-6 text-white text-xl md:text-2xl w-full">
                            {content.heroBanner.subtitle}
                        </p>
                    </motion.div>
                )}

                {/* Parallax Transparent Building - z-index 20 (above text) */}
                <motion.div
                    className="pointer-events-none absolute bottom-0 left-0 z-20 w-full"
                    style={{ y: buildingY }}
                >
                    <img
                        src={heroForegroundUrl}
                        alt={heroForegroundAlt}
                        className="h-auto min-w-full max-h-[75vh]"
                    />
                </motion.div>
            </div>

            {/* Value Propositions */}
            <Section className="bg-background">
                <div className="grid gap-8 md:grid-cols-3">
                    {content.valuePropositions.map((prop, index) => (
                        <motion.div
                            key={prop.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="mx-auto mb-4 inline-flex rounded-full bg-primary/10 p-4">
                                {iconMap[prop.icon] || <Shield className="h-6 w-6 text-primary" />}
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">{prop.title}</h3>
                            <p className="text-muted-foreground">{prop.description}</p>
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* Featured Projects */}
            <Section>
                <SectionHeader
                    title="Featured Work"
                    subtitle="A handpicked showcase of recent projects where innovation meets elegance, built with purpose and modern design sensibility."
                />
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {content.featuredProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <ProjectCard project={project} variant="featured" />
                        </motion.div>
                    ))}
                </div>
                <div className="mt-12 text-center">
                    <Button size="lg" variant="outline" asChild>
                        <Link href="/projects">
                            View All Projects
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </Section>

            {/* CEO Message */}
            <Section className="bg-primary text-primary-foreground min-w-full">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                            CEO's Message
                        </h2>
                        <div className="space-y-4 text-primary-foreground/90">
                            {content.ceoMessage.message.split('\n\n').map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                            ))}
                        </div>
                        <div className="mt-8">
                            <p className="font-semibold text-primary-foreground">
                                — {content.ceoMessage.name}
                            </p>
                            <p className="text-primary-foreground/80">{content.ceoMessage.title}</p>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative aspect-[4/3] overflow-hidden rounded-lg"
                    >
                        <img
                            src={content.ceoMessage.image.url}
                            alt={content.ceoMessage.name}
                            className="h-full w-full object-cover shadow-2xl"
                        />
                    </motion.div>
                </div>
            </Section>

            {/* Services */}
            <Section>
                <SectionHeader
                    title="Our Services"
                    subtitle="Comprehensive real estate solutions tailored to your needs"
                />
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => (
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
                <div className="mt-12 text-center">
                    <Button size="lg" variant="outline" asChild>
                        <Link href="/services">
                            View All Services
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </Section>

            {/* Testimonials */}
            <Section className="bg-muted/50 min-w-full">
                <SectionHeader
                    title="Client Testimonials"
                    subtitle="What our clients say about us"
                />
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <TestimonialCard
                                name={testimonial.name}
                                position={testimonial.position}
                                company={testimonial.company}
                                content={testimonial.content}
                                rating={testimonial.rating}
                                image={testimonial.image.url}
                            />
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* CTA Section */}
            <Section className="bg-primary text-primary-foreground min-w-full">
                <div className="text-center">
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                        Ready to Find Your Dream Property?
                    </h2>
                    <p className="mx-auto mb-8 max-w-2xl text-primary-foreground/90">
                        Discover premium properties, connect with trusted experts, and find a
                        space that perfectly reflects your lifestyle — only at Nex Real
                        Estate.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/projects">Explore Properties</Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                            asChild
                        >
                            <Link href="/contact">Contact Us</Link>
                        </Button>
                    </div>
                </div>
            </Section>
        </FrontendLayout>
    );
}
