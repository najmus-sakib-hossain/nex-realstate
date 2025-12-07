import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { PageHero, Section, SectionHeader } from '@/components/sections';
import { FrontendLayout } from '@/layouts/frontend-layout';
import { useBusinessContent } from '@/hooks/use-cms';
import { useCMSStore } from '@/stores/cms-store';
import {
    ArrowRight,
    Briefcase,
    Building2,
    CheckCircle,
    Handshake,
    LucideIcon,
    ShieldCheck,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// Icon mapping for dynamic icons from CMS
const iconMap: Record<string, LucideIcon> = {
    Briefcase,
    Building2,
    Users,
    TrendingUp,
    ShieldCheck,
    Handshake,
    CheckCircle,
};

export default function BusinessPage() {
    const { businessContent } = useCMSStore();
    const { data: serverContent } = useBusinessContent();
    const content = serverContent || businessContent;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedType, setSelectedType] = useState<string>('');
    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        partnershipType: '',
        experience: '',
        portfolio: '',
        message: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        toast.success(
            'Your business partnership inquiry has been submitted! We will contact you soon.',
        );
        setIsSubmitting(false);
        setFormData({
            companyName: '',
            contactPerson: '',
            email: '',
            phone: '',
            partnershipType: '',
            experience: '',
            portfolio: '',
            message: '',
        });
    };

    if (!content) {
        return (
            <FrontendLayout>
                <div className="flex min-h-[400px] items-center justify-center">
                    <p>Loading...</p>
                </div>
            </FrontendLayout>
        );
    }

    return (
        <FrontendLayout>
            {/* Hero Section */}
            <PageHero
                title={content.heroSection.title}
                subtitle={content.heroSection.subtitle}
                backgroundImage={content.heroSection.backgroundImage.url}
            />

            {/* Why Partner Section */}
            <Section>
                <SectionHeader
                    title="Why Partner With Nex Realstate?"
                    subtitle="Join a network of excellence and grow your business with us"
                />
                <div className="grid gap-8 md:grid-cols-3">
                    {content.whyPartner.map((item) => {
                        const IconComponent = iconMap[item.icon] || ShieldCheck;
                        return (
                            <Card key={item.title} className="text-center">
                                <CardContent>
                                    <IconComponent className="mx-auto mb-4 h-12 w-12 text-primary" />
                                    <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {item.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </Section>

            {/* Partnership Types */}
            <Section className="bg-muted/50">
                <SectionHeader
                    title="Partnership Opportunities"
                    subtitle="Choose how you'd like to work with us"
                />
                <div className="grid gap-6 md:grid-cols-2">
                    {content.partnershipTypes.map((type) => {
                        const IconComponent = iconMap[type.icon] || Briefcase;
                        return (
                            <Card
                                key={type.id}
                                className={`cursor-pointer transition-all hover:shadow-lg ${
                                    selectedType === type.id
                                        ? 'border-primary ring-2 ring-primary'
                                        : ''
                                }`}
                                onClick={() => {
                                    setSelectedType(type.id);
                                    setFormData((prev) => ({
                                        ...prev,
                                        partnershipType: type.title,
                                    }));
                                }}
                            >
                                <CardHeader>
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                            <IconComponent className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">{type.title}</CardTitle>
                                            <CardDescription className="mt-1">
                                                {type.description}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <h4 className="mb-3 text-sm font-medium">Benefits:</h4>
                                    <ul className="space-y-2">
                                        {type.benefits.map((benefit) => (
                                            <li
                                                key={benefit}
                                                className="flex items-center gap-2 text-sm text-muted-foreground"
                                            >
                                                <CheckCircle className="h-4 w-4 text-primary" />
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </Section>

            {/* Registration Process */}
            <Section>
                <div className="mx-auto max-w-3xl">
                    <h2 className="mb-6 text-center text-3xl font-bold">Registration Process</h2>
                    <p className="mb-8 text-center text-muted-foreground">
                        We are actively seeking partners in various areas for our
                        ongoing and upcoming projects.
                    </p>
                    <div className="space-y-6">
                        {[
                            {
                                step: 1,
                                title: 'Submit Application',
                                description:
                                    'Fill out the partnership inquiry form with your details and portfolio.',
                            },
                            {
                                step: 2,
                                title: 'Document Verification',
                                description:
                                    'Our team will review your credentials and business documents.',
                            },
                            {
                                step: 3,
                                title: 'Meeting & Discussion',
                                description:
                                    'Meet with our team to discuss partnership terms and opportunities.',
                            },
                            {
                                step: 4,
                                title: 'Agreement & Onboarding',
                                description:
                                    'Sign the partnership agreement and get onboarded to our vendor portal.',
                            },
                        ].map((item) => (
                            <div key={item.step} className="flex gap-4">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                    {item.step}
                                </div>
                                <div>
                                    <h4 className="font-semibold">{item.title}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Partnership Inquiry Form */}
            <Section className="bg-muted/50">
                <div className="mx-auto max-w-3xl">
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">
                                Partnership Inquiry Form
                            </CardTitle>
                            <CardDescription>
                                Tell us about your business and how you'd like to partner with
                                us
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="companyName">Company Name *</Label>
                                        <Input
                                            id="companyName"
                                            value={formData.companyName}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    companyName: e.target.value,
                                                }))
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="contactPerson">Contact Person *</Label>
                                        <Input
                                            id="contactPerson"
                                            value={formData.contactPerson}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    contactPerson: e.target.value,
                                                }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    email: e.target.value,
                                                }))
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number *</Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    phone: e.target.value,
                                                }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Partnership Type *</Label>
                                        <Select
                                            value={formData.partnershipType}
                                            onValueChange={(value) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    partnershipType: value,
                                                }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {content.partnershipTypes.map((type) => (
                                                    <SelectItem key={type.id} value={type.title}>
                                                        {type.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="experience">
                                            Years of Experience *
                                        </Label>
                                        <Select
                                            value={formData.experience}
                                            onValueChange={(value) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    experience: value,
                                                }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1-3">1-3 years</SelectItem>
                                                <SelectItem value="3-5">3-5 years</SelectItem>
                                                <SelectItem value="5-10">5-10 years</SelectItem>
                                                <SelectItem value="10+">10+ years</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="portfolio">
                                        Portfolio / Previous Work
                                    </Label>
                                    <Input
                                        id="portfolio"
                                        placeholder="Website URL or list of previous clients"
                                        value={formData.portfolio}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                portfolio: e.target.value,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">
                                        Additional Information
                                    </Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Tell us more about your company and how you can add value"
                                        value={formData.message}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                message: e.target.value,
                                            }))
                                        }
                                        rows={4}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </Section>

            {/* Stats Section */}
            <Section>
                <div className="grid gap-8 md:grid-cols-4">
                    {[
                        { value: '500+', label: 'Active Partners' },
                        { value: '₹100Cr+', label: 'Annual Procurement' },
                        { value: '98%', label: 'Partner Retention' },
                        { value: '30', label: 'Days Avg. Payment Cycle' },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-4xl font-bold text-primary">{stat.value}</div>
                            <div className="text-muted-foreground">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </Section>
        </FrontendLayout>
    );
}
