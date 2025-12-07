import { TeamMemberCard } from '@/components/cards';
import { PageHero, Section, SectionHeader } from '@/components/sections';
import { FrontendLayout } from '@/layouts/frontend-layout';
import { useCMSStore } from '@/stores/cms-store';
import { useAboutContent } from '@/hooks/use-cms';
import { motion } from 'motion/react';
import { Lightbulb, Shield, Star, Target, Users } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
    Shield: <Shield className="h-8 w-8 text-primary" />,
    Star: <Star className="h-8 w-8 text-primary" />,
    Target: <Target className="h-8 w-8 text-primary" />,
    Lightbulb: <Lightbulb className="h-8 w-8 text-primary" />,
    Users: <Users className="h-8 w-8 text-primary" />,
};

export default function AboutPage() {
    const { aboutContent } = useCMSStore();
    const { data: serverContent } = useAboutContent();
    const content = serverContent || aboutContent;

    if (!content) {
        return (
            <FrontendLayout
                title="About Us"
                description="Learn about Nex Real Estate's story, mission, vision, and the team behind our success."
            >
                <PageHero
                    title="About Us"
                    subtitle="Building trust, delivering excellence"
                    breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About Us' }]}
                    backgroundImage="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80"
                />
                <div className="flex min-h-[400px] items-center justify-center">
                    <p className="text-muted-foreground">Loading content...</p>
                </div>
            </FrontendLayout>
        );
    }

    return (
        <FrontendLayout
            title="About Us"
            description="Learn about Nex Real Estate's story, mission, vision, and the team behind our success."
        >
            {/* Hero */}
            <PageHero
                title="About Us"
                subtitle="Building trust, delivering excellence"
                breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About Us' }]}
                backgroundImage="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80"
            />

            {/* Our Story */}
            <Section>
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                            {content.ourStory.title}
                        </h2>
                        <div className="space-y-4 text-muted-foreground">
                            {content.ourStory.content.split('\n\n').map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="aspect-[4/3] overflow-hidden rounded-lg"
                    >
                        <img
                            src={content?.ourStory?.image?.url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80'}
                            alt={content?.ourStory?.image?.alt || 'Our Story'}
                            className="h-full w-full object-cover shadow-lg"
                        />
                    </motion.div>
                </div>
            </Section>

            {/* Mission & Vision */}
            <Section className="bg-muted/50">
                <div className="grid gap-8 md:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-lg bg-card p-8 shadow-md"
                    >
                        <h3 className="mb-4 text-2xl font-bold text-primary">
                            {content.mission.title}
                        </h3>
                        <p className="text-lg text-muted-foreground">
                            {content.mission.content}
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="rounded-lg bg-card p-8 shadow-md"
                    >
                        <h3 className="mb-4 text-2xl font-bold text-primary">
                            {content.vision.title}
                        </h3>
                        <p className="text-lg text-muted-foreground">
                            {content.vision.content}
                        </p>
                    </motion.div>
                </div>
            </Section>

            {/* Values */}
            <Section>
                <SectionHeader
                    title="Our Values"
                    subtitle="The principles that guide everything we do"
                />
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {content.values.map((value, index) => (
                        <motion.div
                            key={value.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="mx-auto mb-4 inline-flex rounded-full bg-primary/10 p-4">
                                {iconMap[value.icon] || <Shield className="h-8 w-8 text-primary" />}
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">{value.title}</h3>
                            <p className="text-sm text-muted-foreground">
                                {value.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* Leadership Team */}
            <Section className="bg-muted/50">
                <SectionHeader
                    title="Leadership Team"
                    subtitle="Meet the people driving our vision forward"
                />
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {content.leadershipTeam.map((member, index) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <TeamMemberCard
                                name={member.name}
                                position={member.position}
                                image={member.image?.url || ''}
                                socialLinks={member.socialLinks}
                            />
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* Board of Advisors */}
            <Section>
                <SectionHeader
                    title="Board of Advisors"
                    subtitle="Expert guidance shaping our strategic direction"
                />
                <div className="mx-auto grid max-w-2xl gap-8 sm:grid-cols-2">
                    {content.boardOfAdvisors.map((advisor, index) => (
                        <motion.div
                            key={advisor.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <TeamMemberCard
                                name={advisor.name}
                                position={advisor.position}
                                bio={advisor.bio}
                                image={advisor.image?.url || ''}
                            />
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* Awards */}
            {content.awards.length > 0 && (
                <Section className="bg-primary text-primary-foreground">
                    <SectionHeader
                        title="Awards & Recognition"
                        subtitle="Celebrating our achievements and milestones"
                    />
                    <div className="grid gap-8 md:grid-cols-2">
                        {content.awards.map((award, index) => (
                            <motion.div
                                key={award.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="rounded-lg bg-primary-foreground/10 p-6"
                            >
                                <p className="mb-2 text-sm text-primary-foreground/70">{award.year}</p>
                                <h3 className="mb-2 text-xl font-semibold">{award.title}</h3>
                                <p className="text-primary-foreground/80">{award.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </Section>
            )}
        </FrontendLayout>
    );
}
