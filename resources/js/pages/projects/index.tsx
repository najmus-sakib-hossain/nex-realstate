import { ProjectCard } from '@/components/cards';
import { PageHero, Section } from '@/components/sections';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FrontendLayout } from '@/layouts/frontend-layout';
import { useProjectsContent, useProjects } from '@/hooks/use-cms';
import { useCMSStore } from '@/stores/cms-store';
import { motion } from 'motion/react';

interface ProjectsPageProps {
    defaultTab?: string;
}

export default function ProjectsPage({ defaultTab = 'ongoing' }: ProjectsPageProps) {
    const { projectsContent, projects } = useCMSStore();
    const { data: serverContent } = useProjectsContent();
    const { data: serverProjects } = useProjects();
    const content = serverContent || projectsContent;
    const allProjects = serverProjects || projects;

    if (!content || !allProjects) {
        return (
            <FrontendLayout
                title="Projects"
                description="Explore our portfolio of ongoing, completed, and upcoming real estate projects."
            >
                <PageHero
                    title="Projects"
                    subtitle="Explore our portfolio"
                    breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Projects' }]}
                />
                <div className="flex min-h-[400px] items-center justify-center">
                    <p className="text-muted-foreground">Loading projects...</p>
                </div>
            </FrontendLayout>
        );
    }

    const ongoingProjects = allProjects.filter((p) => p.status === 'ongoing');
    const completedProjects = allProjects.filter((p) => p.status === 'completed');
    const upcomingProjects = allProjects.filter((p) => p.status === 'upcoming');

    return (
        <FrontendLayout
            title="Projects"
            description="Explore our portfolio of ongoing, completed, and upcoming real estate projects."
        >
            {/* Hero */}
            <PageHero
                title={content.heroSection.title}
                subtitle={content.heroSection.subtitle}
                backgroundImage={content.heroSection.backgroundImage.url}
                breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Projects' }]}
            />

            {/* Projects Tabs */}
            <Section>
                <Tabs defaultValue={defaultTab} className="w-full">
                    <div className="mb-8 flex justify-center">
                        <TabsList className="grid w-full max-w-md grid-cols-3">
                            <TabsTrigger value="ongoing">
                                Ongoing ({ongoingProjects.length})
                            </TabsTrigger>
                            <TabsTrigger value="completed">
                                Completed ({completedProjects.length})
                            </TabsTrigger>
                            <TabsTrigger value="upcoming">
                                Upcoming ({upcomingProjects.length})
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="ongoing">
                        {ongoingProjects.length > 0 ? (
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {ongoingProjects.map((project, index) => (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <ProjectCard project={project} />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center text-muted-foreground">
                                No ongoing projects at the moment.
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="completed">
                        {completedProjects.length > 0 ? (
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {completedProjects.map((project, index) => (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <ProjectCard project={project} />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center text-muted-foreground">
                                No completed projects to display.
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="upcoming">
                        {upcomingProjects.length > 0 ? (
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {upcomingProjects.map((project, index) => (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <ProjectCard project={project} />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center text-muted-foreground">
                                No upcoming projects announced yet.
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </Section>

            {/* CTA */}
            <Section className="bg-primary text-primary-foreground">
                <div className="text-center">
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                        Interested in Our Projects?
                    </h2>
                    <p className="mx-auto mb-8 max-w-2xl text-primary-foreground/90">
                        Schedule a visit to explore our properties in person and find your
                        perfect space.
                    </p>
                    <Button size="lg" variant="secondary">
                        Schedule a Visit
                    </Button>
                </div>
            </Section>
        </FrontendLayout>
    );
}
