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
import { useLandWantedContent } from '@/hooks/use-cms';
import { useCMSStore } from '@/stores/cms-store';
import { CheckCircle, FileText, LucideIcon, MapPin, Phone, Shield, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// Icon mapping for dynamic icons from CMS
const iconMap: Record<string, LucideIcon> = {
    Shield,
    FileText,
    Users,
    Phone,
    MapPin,
    CheckCircle,
};

export default function LandWantedPage() {
    const { landWantedContent } = useCMSStore();
    const { data: serverContent } = useLandWantedContent();
    const content = serverContent || landWantedContent;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        ownerName: '',
        email: '',
        phone: '',
        landLocation: '',
        landArea: '',
        areaUnit: 'katha',
        landType: '',
        expectedPrice: '',
        documents: '',
        additionalInfo: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        toast.success('Your land submission has been received! We will contact you soon.');
        setIsSubmitting(false);
        setFormData({
            ownerName: '',
            email: '',
            phone: '',
            landLocation: '',
            landArea: '',
            areaUnit: 'katha',
            landType: '',
            expectedPrice: '',
            documents: '',
            additionalInfo: '',
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

            {/* Why Sell to Us */}
            <Section>
                <SectionHeader
                    title="Why Partner With Us?"
                    subtitle="Benefits of selling or developing your land with Nex Realstate"
                />
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {content.benefits.map((benefit) => {
                        const IconComponent = iconMap[benefit.icon] || Shield;
                        return (
                            <Card key={benefit.title} className="text-center">
                                <CardContent>
                                    <IconComponent className="mx-auto mb-4 h-12 w-12 text-primary" />
                                    <h3 className="mb-2 text-lg font-semibold">{benefit.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {benefit.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </Section>

            {/* Requirements Section */}
            <Section className="bg-muted/50">
                <div className="grid gap-12 lg:grid-cols-2">
                    <div>
                        <h2 className="mb-6 text-3xl font-bold">{content.requirements.title}</h2>
                        <p className="mb-6 text-muted-foreground">
                            {content.requirements.description}
                        </p>
                        <ul className="space-y-4">
                            {content.requirements.items.map((item) => (
                                <li key={item.id} className="flex items-start gap-3">
                                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                                    <span>
                                        <strong>{item.title}:</strong> {item.description}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-6 text-xl font-semibold">Preferred Locations</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {content.preferredLocations.map((location) => (
                                <div
                                    key={location}
                                    className="flex items-center gap-2 rounded-lg border bg-background p-3"
                                >
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span>{location}</span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-4 text-sm text-muted-foreground">
                            * We also consider land in other areas based on development potential
                        </p>
                    </div>
                </div>
            </Section>

            {/* Submission Form */}
            <Section>
                <div className="mx-auto max-w-3xl">
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">Submit Your Land Details</CardTitle>
                            <CardDescription>
                                Fill out the form below and our team will evaluate your property
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="ownerName">Owner's Name *</Label>
                                        <Input
                                            id="ownerName"
                                            value={formData.ownerName}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    ownerName: e.target.value,
                                                }))
                                            }
                                            required
                                        />
                                    </div>
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
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
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
                                    <div className="space-y-2">
                                        <Label htmlFor="landLocation">Land Location *</Label>
                                        <Input
                                            id="landLocation"
                                            placeholder="Area, Road, Block"
                                            value={formData.landLocation}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    landLocation: e.target.value,
                                                }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="landArea">Land Area *</Label>
                                        <Input
                                            id="landArea"
                                            type="number"
                                            value={formData.landArea}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    landArea: e.target.value,
                                                }))
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Unit</Label>
                                        <Select
                                            value={formData.areaUnit}
                                            onValueChange={(value) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    areaUnit: value,
                                                }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="katha">Katha</SelectItem>
                                                <SelectItem value="bigha">Bigha</SelectItem>
                                                <SelectItem value="decimal">Decimal</SelectItem>
                                                <SelectItem value="sqft">Square Feet</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Land Type *</Label>
                                        <Select
                                            value={formData.landType}
                                            onValueChange={(value) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    landType: value,
                                                }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {content.landTypes.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="expectedPrice">Expected Price (BDT)</Label>
                                    <Input
                                        id="expectedPrice"
                                        placeholder="Your expected selling price"
                                        value={formData.expectedPrice}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                expectedPrice: e.target.value,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="documents">Available Documents</Label>
                                    <Input
                                        id="documents"
                                        placeholder="e.g., CS, RS, SA, Mutation, City Jorip"
                                        value={formData.documents}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                documents: e.target.value,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="additionalInfo">Additional Information</Label>
                                    <Textarea
                                        id="additionalInfo"
                                        placeholder="Any additional details about the land"
                                        value={formData.additionalInfo}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                additionalInfo: e.target.value,
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
                                    {isSubmitting ? 'Submitting...' : 'Submit Land Details'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </Section>

            {/* Contact CTA */}
            <Section className="bg-primary text-primary-foreground">
                <div className="text-center">
                    <h2 className="mb-4 text-3xl font-bold">Have Questions?</h2>
                    <p className="mx-auto mb-8 max-w-2xl text-primary-foreground/80">
                        Our land acquisition team is ready to assist you. Contact us for a
                        confidential discussion about your property.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button size="lg" variant="secondary">
                            <Phone className="mr-2 h-4 w-4" />
                            Call +880 1234-567890
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                        >
                            Schedule a Meeting
                        </Button>
                    </div>
                </div>
            </Section>
        </FrontendLayout>
    );
}
