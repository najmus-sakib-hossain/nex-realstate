import { JobCard } from '@/components/cards';
import { PageHero, Section, SectionHeader } from '@/components/sections';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FrontendLayout } from '@/layouts/frontend-layout';
import { useCareerContent } from '@/hooks/use-cms';
import { useCMSStore } from '@/stores/cms-store';
import { motion } from 'motion/react';
import { Clock, GraduationCap, Heart, Users } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

const iconMap: Record<string, React.ReactNode> = {
    Heart: <Heart className="h-6 w-6 text-primary" />,
    GraduationCap: <GraduationCap className="h-6 w-6 text-primary" />,
    Clock: <Clock className="h-6 w-6 text-primary" />,
    Users: <Users className="h-6 w-6 text-primary" />,
};

export default function CareerPage() {
    const { careerContent } = useCMSStore();
    const { data: serverContent } = useCareerContent();
    const content = serverContent || careerContent;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        await new Promise((resolve) => setTimeout(resolve, 1500));

        toast.success('Application submitted successfully!', {
            description: 'We will review your application and get back to you.',
        });

        setIsSubmitting(false);
        (e.target as HTMLFormElement).reset();
    };

    if (!content) {
        return (
            <FrontendLayout
                title="Career"
                description="Join our team at Nex Real Estate"
            >
                <PageHero
                    title="Career"
                    subtitle="Build your future with us"
                    breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Career' }]}
                />
                <div className="flex min-h-[400px] items-center justify-center">
                    <p className="text-muted-foreground">Loading content...</p>
                </div>
            </FrontendLayout>
        );
    }

    return (
        <FrontendLayout
            title="Careers"
            description="Join our team and build your career with Nex Real Estate."
        >
            {/* Hero */}
            <PageHero
                title={content.heroSection.title}
                subtitle={content.heroSection.subtitle}
                backgroundImage={content.heroSection.backgroundImage.url}
                breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Careers' }]}
            />

            {/* Life at Nex */}
            <Section>
                <div className="grid gap-12 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="mb-6 text-3xl font-bold">
                            {content.lifeAtNex.title}
                        </h2>
                        <p className="mb-8 text-muted-foreground">
                            {content.lifeAtNex.content}
                        </p>
                        <div className="grid gap-6 sm:grid-cols-2">
                            {content.lifeAtNex.perks.map((perk, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        {iconMap[perk.icon] || (
                                            <Heart className="h-6 w-6 text-primary" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">{perk.title}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {perk.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="grid gap-4"
                    >
                        {content.lifeAtNex.images.map((image, i) => (
                            <div key={i} className="aspect-video overflow-hidden rounded-lg">
                                <img
                                    src={image.url}
                                    alt={image.alt}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </Section>

            {/* Job Openings */}
            <Section className="bg-muted/50">
                <SectionHeader
                    title="Current Openings"
                    subtitle="Join our growing team"
                />
                {content.jobOpenings.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {content.jobOpenings.map((job, index) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <JobCard
                                    title={job.title}
                                    department={job.department}
                                    location={job.location}
                                    type={job.type}
                                    experience={job.experience}
                                    slug={job.slug}
                                    deadline={job.deadline}
                                />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 text-center text-muted-foreground">
                        No open positions at the moment. Check back later!
                    </div>
                )}
            </Section>

            {/* Internship Program */}
            <Section>
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="aspect-[4/3] overflow-hidden rounded-lg"
                    >
                        <img
                            src={content.internshipProgram.image.url}
                            alt="Internship Program"
                            className="h-full w-full object-cover"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="mb-6 text-3xl font-bold">
                            {content.internshipProgram.title}
                        </h2>
                        <p className="mb-6 text-muted-foreground">
                            {content.internshipProgram.content}
                        </p>
                        <ul className="mb-8 space-y-3">
                            {content.internshipProgram.benefits.map((benefit, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-primary" />
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                        <Button size="lg">Apply for Internship</Button>
                    </motion.div>
                </div>
            </Section>

            {/* Application Form */}
            <Section className="bg-primary text-primary-foreground">
                <SectionHeader
                    title="Apply Now"
                    subtitle="Take the first step towards your new career"
                />
                <Card className="mx-auto max-w-2xl bg-card text-card-foreground">
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="Your name"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone *</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="+880 1XXX-XXXXXX"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="position">Position *</Label>
                                    <Input
                                        id="position"
                                        name="position"
                                        placeholder="Position applying for"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                                <Input
                                    id="linkedin"
                                    name="linkedin"
                                    type="url"
                                    placeholder="https://linkedin.com/in/yourprofile"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="resume">Resume/CV *</Label>
                                <Input
                                    id="resume"
                                    name="resume"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="coverLetter">Cover Letter</Label>
                                <Textarea
                                    id="coverLetter"
                                    name="coverLetter"
                                    placeholder="Tell us why you're a great fit..."
                                    rows={5}
                                />
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Section>
        </FrontendLayout>
    );
}
