import { PageHero, Section, SectionHeader } from '@/components/sections';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FrontendLayout } from '@/layouts/frontend-layout';
import { useContactContent } from '@/hooks/use-cms';
import { useCMSStore } from '@/stores/cms-store';
import { motion } from 'motion/react';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

export default function ContactPage() {
    const { contactContent } = useCMSStore();
    const { data: serverContent } = useContactContent();
    const content = serverContent || contactContent;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1500));

        toast.success('Your inquiry has been submitted successfully!', {
            description: 'We will get back to you within 24 hours.',
        });

        setIsSubmitting(false);
        (e.target as HTMLFormElement).reset();
    };

    if (!content) {
        return (
            <FrontendLayout
                title="Contact Us"
                description="Get in touch with Nex Real Estate"
            >
                <PageHero
                    title="Contact Us"
                    subtitle="We'd love to hear from you"
                    breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
                />
                <div className="flex min-h-[400px] items-center justify-center">
                    <p className="text-muted-foreground">Loading content...</p>
                </div>
            </FrontendLayout>
        );
    }

    return (
        <FrontendLayout
            title="Contact Us"
            description="Get in touch with Nex Real Estate. We're here to help with all your property needs."
        >
            {/* Hero */}
            <PageHero
                title={content.heroSection.title}
                subtitle={content.heroSection.subtitle}
                backgroundImage={content.heroSection.backgroundImage.url}
                breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
            />

            {/* Contact Info & Form */}
            <Section>
                <div className="grid gap-12 lg:grid-cols-2">
                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="mb-6 text-3xl font-bold">Get in Touch</h2>
                        <p className="mb-8 text-muted-foreground">
                            Have questions about our properties or services? We're here to
                            help. Reach out to us through any of the following channels.
                        </p>

                        <div className="space-y-6">
                            {content.offices.map((office) => (
                                <Card key={office.id}>
                                    <CardContent className="p-6">
                                        <h3 className="mb-4 text-lg font-semibold">
                                            {office.title}
                                        </h3>
                                        <div className="space-y-3 text-sm text-muted-foreground">
                                            <div className="flex items-start gap-3">
                                                <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                                                <span>{office.address}</span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Phone className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                                                <div>
                                                    {office.phone.map((p, i) => (
                                                        <a
                                                            key={i}
                                                            href={`tel:${p.replace(/[^0-9+]/g, '')}`}
                                                            className="block hover:text-primary"
                                                        >
                                                            {p}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Mail className="h-5 w-5 flex-shrink-0 text-primary" />
                                                <a
                                                    href={`mailto:${office.email}`}
                                                    className="hover:text-primary"
                                                >
                                                    {office.email}
                                                </a>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="font-medium">Working Hours</p>
                                            <p className="text-sm text-muted-foreground">
                                                {content.workingHours.weekdays}
                                            </p>
                                            {content.workingHours.weekends && (
                                                <p className="text-sm text-muted-foreground">
                                                    {content.workingHours.weekends}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card>
                            <CardContent className="p-8">
                                <h3 className="mb-6 text-2xl font-bold">Send us a Message</h3>
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
                                            <Label htmlFor="email">Email Address *</Label>
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
                                            <Label htmlFor="phone">Phone Number *</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                placeholder="+880 1XXX-XXXXXX"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="type">Inquiry Type</Label>
                                            <Select name="type" defaultValue="general">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="general">
                                                        General Inquiry
                                                    </SelectItem>
                                                    <SelectItem value="property">
                                                        Property Inquiry
                                                    </SelectItem>
                                                    <SelectItem value="investment">
                                                        Investment
                                                    </SelectItem>
                                                    <SelectItem value="partnership">
                                                        Partnership
                                                    </SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject *</Label>
                                        <Input
                                            id="subject"
                                            name="subject"
                                            placeholder="What is this about?"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message *</Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            placeholder="Tell us more about your inquiry..."
                                            rows={5}
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </Section>

            {/* Map Section */}
            <Section className="bg-muted/50">
                <SectionHeader
                    title="Visit Our Office"
                    subtitle="We'd love to meet you in person"
                />
                <div className="aspect-[21/9] overflow-hidden rounded-lg bg-muted">
                    {/* Placeholder for map - you can integrate Google Maps or other map providers */}
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        <div className="text-center">
                            <MapPin className="mx-auto mb-4 h-12 w-12" />
                            <p>Interactive map will be displayed here</p>
                            <p className="text-sm">
                                House: 50, Level-5, Lake Circus Kalabagan, Dhaka 1209
                            </p>
                        </div>
                    </div>
                </div>
            </Section>
        </FrontendLayout>
    );
}
