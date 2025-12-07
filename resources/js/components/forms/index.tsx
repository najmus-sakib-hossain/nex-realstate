'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// =============================================================================
// Form Schemas
// =============================================================================

const contactFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    phone: z.string().optional(),
    inquiryType: z.enum(['general', 'sales', 'support', 'partnership']),
    subject: z.string().min(1, 'Subject is required'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const newsletterSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    name: z.string().optional(),
    acceptTerms: z.boolean().refine((val) => val === true, {
        message: 'You must accept the terms',
    }),
});

type NewsletterData = z.infer<typeof newsletterSchema>;

const careerApplicationSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    phone: z.string().min(1, 'Phone is required'),
    position: z.string().min(1, 'Position is required'),
    experience: z.string().min(1, 'Experience is required'),
    linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
    portfolio: z.string().url('Invalid URL').optional().or(z.literal('')),
    coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters'),
});

type CareerApplicationData = z.infer<typeof careerApplicationSchema>;

const partnershipSchema = z.object({
    companyName: z.string().min(1, 'Company name is required'),
    contactPerson: z.string().min(1, 'Contact person is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    phone: z.string().min(1, 'Phone is required'),
    partnershipType: z.enum(['investor', 'developer', 'agent', 'supplier', 'other']),
    website: z.string().url('Invalid URL').optional().or(z.literal('')),
    proposal: z.string().min(20, 'Proposal must be at least 20 characters'),
});

type PartnershipData = z.infer<typeof partnershipSchema>;

// =============================================================================
// Contact Form
// =============================================================================

interface ContactFormProps {
    onSuccess?: (data: ContactFormData) => void;
    className?: string;
}

export function ContactForm({ onSuccess, className }: ContactFormProps) {
    const form = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            inquiryType: 'general',
            subject: '',
            message: '',
        },
    });

    const onSubmit = async (data: ContactFormData) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success('Message sent successfully!');
            onSuccess?.(data);
            form.reset();
        } catch {
            toast.error('Failed to send message. Please try again.');
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-6', className)}>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                    <Input id="name" {...form.register('name')} placeholder="Your name" />
                    {form.formState.errors.name && (
                        <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                    <Input id="email" type="email" {...form.register('email')} placeholder="your@email.com" />
                    {form.formState.errors.email && (
                        <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                    )}
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" {...form.register('phone')} placeholder="+1 (555) 000-0000" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="inquiryType">Inquiry Type</Label>
                    <Select
                        value={form.watch('inquiryType')}
                        onValueChange={(value) => form.setValue('inquiryType', value as ContactFormData['inquiryType'])}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="sales">Sales</SelectItem>
                            <SelectItem value="support">Support</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="subject">Subject <span className="text-destructive">*</span></Label>
                <Input id="subject" {...form.register('subject')} placeholder="What is your inquiry about?" />
                {form.formState.errors.subject && (
                    <p className="text-sm text-destructive">{form.formState.errors.subject.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="message">Message <span className="text-destructive">*</span></Label>
                <Textarea id="message" {...form.register('message')} placeholder="Tell us more..." rows={5} />
                {form.formState.errors.message && (
                    <p className="text-sm text-destructive">{form.formState.errors.message.message}</p>
                )}
            </div>

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
        </form>
    );
}

// =============================================================================
// Newsletter Form
// =============================================================================

interface NewsletterFormProps {
    onSuccess?: (data: NewsletterData) => void;
    className?: string;
    variant?: 'default' | 'inline';
}

export function NewsletterForm({ onSuccess, className, variant = 'default' }: NewsletterFormProps) {
    const form = useForm<NewsletterData>({
        resolver: zodResolver(newsletterSchema),
        defaultValues: { email: '', name: '', acceptTerms: false },
    });

    const onSubmit = async (data: NewsletterData) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success('Successfully subscribed to newsletter!');
            onSuccess?.(data);
            form.reset();
        } catch {
            toast.error('Failed to subscribe. Please try again.');
        }
    };

    if (variant === 'inline') {
        return (
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn('flex gap-2', className)}>
                <Input {...form.register('email')} type="email" placeholder="Enter your email" className="flex-1" />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </Button>
            </form>
        );
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-4', className)}>
            <div className="space-y-2">
                <Label htmlFor="newsletter-email">Email <span className="text-destructive">*</span></Label>
                <Input id="newsletter-email" type="email" {...form.register('email')} placeholder="your@email.com" />
                {form.formState.errors.email && (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="newsletter-name">Name (optional)</Label>
                <Input id="newsletter-name" {...form.register('name')} placeholder="Your name" />
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="acceptTerms"
                    checked={form.watch('acceptTerms')}
                    onCheckedChange={(checked) => form.setValue('acceptTerms', checked as boolean)}
                />
                <Label htmlFor="acceptTerms" className="text-sm font-normal">
                    I agree to receive marketing emails
                </Label>
            </div>
            {form.formState.errors.acceptTerms && (
                <p className="text-sm text-destructive">{form.formState.errors.acceptTerms.message}</p>
            )}

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter'}
            </Button>
        </form>
    );
}

// =============================================================================
// Career Application Form
// =============================================================================

interface CareerApplicationFormProps {
    jobTitle: string;
    onSuccess?: (data: CareerApplicationData) => void;
    className?: string;
}

export function CareerApplicationForm({ jobTitle, onSuccess, className }: CareerApplicationFormProps) {
    const form = useForm<CareerApplicationData>({
        resolver: zodResolver(careerApplicationSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            position: jobTitle,
            experience: '',
            linkedin: '',
            portfolio: '',
            coverLetter: '',
        },
    });

    const onSubmit = async (data: CareerApplicationData) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            toast.success('Application submitted successfully!');
            onSuccess?.(data);
            form.reset();
        } catch {
            toast.error('Failed to submit application. Please try again.');
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-6', className)}>
            <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">Applying for: <strong>{jobTitle}</strong></p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="applicant-name">Full Name <span className="text-destructive">*</span></Label>
                    <Input id="applicant-name" {...form.register('name')} placeholder="John Doe" />
                    {form.formState.errors.name && (
                        <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="applicant-email">Email <span className="text-destructive">*</span></Label>
                    <Input id="applicant-email" type="email" {...form.register('email')} placeholder="john@example.com" />
                    {form.formState.errors.email && (
                        <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                    )}
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="applicant-phone">Phone <span className="text-destructive">*</span></Label>
                    <Input id="applicant-phone" type="tel" {...form.register('phone')} placeholder="+1 (555) 000-0000" />
                    {form.formState.errors.phone && (
                        <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience <span className="text-destructive">*</span></Label>
                    <Select
                        value={form.watch('experience')}
                        onValueChange={(value) => form.setValue('experience', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0-1">0-1 years</SelectItem>
                            <SelectItem value="1-3">1-3 years</SelectItem>
                            <SelectItem value="3-5">3-5 years</SelectItem>
                            <SelectItem value="5-10">5-10 years</SelectItem>
                            <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                    </Select>
                    {form.formState.errors.experience && (
                        <p className="text-sm text-destructive">{form.formState.errors.experience.message}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <Input id="linkedin" type="url" {...form.register('linkedin')} placeholder="https://linkedin.com/in/yourprofile" />
                {form.formState.errors.linkedin && (
                    <p className="text-sm text-destructive">{form.formState.errors.linkedin.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio URL</Label>
                <Input id="portfolio" type="url" {...form.register('portfolio')} placeholder="https://yourportfolio.com" />
                {form.formState.errors.portfolio && (
                    <p className="text-sm text-destructive">{form.formState.errors.portfolio.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="coverLetter">Cover Letter <span className="text-destructive">*</span></Label>
                <Textarea id="coverLetter" {...form.register('coverLetter')} placeholder="Tell us why you're a great fit..." rows={6} />
                {form.formState.errors.coverLetter && (
                    <p className="text-sm text-destructive">{form.formState.errors.coverLetter.message}</p>
                )}
            </div>

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
        </form>
    );
}

// =============================================================================
// Partnership Form
// =============================================================================

interface PartnershipFormProps {
    onSuccess?: (data: PartnershipData) => void;
    className?: string;
}

export function PartnershipForm({ onSuccess, className }: PartnershipFormProps) {
    const form = useForm<PartnershipData>({
        resolver: zodResolver(partnershipSchema),
        defaultValues: {
            companyName: '',
            contactPerson: '',
            email: '',
            phone: '',
            partnershipType: 'investor',
            website: '',
            proposal: '',
        },
    });

    const onSubmit = async (data: PartnershipData) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success('Partnership inquiry submitted!');
            onSuccess?.(data);
            form.reset();
        } catch {
            toast.error('Failed to submit inquiry. Please try again.');
        }
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-6', className)}>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name <span className="text-destructive">*</span></Label>
                    <Input id="company-name" {...form.register('companyName')} placeholder="Acme Corporation" />
                    {form.formState.errors.companyName && (
                        <p className="text-sm text-destructive">{form.formState.errors.companyName.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="contact-person">Contact Person <span className="text-destructive">*</span></Label>
                    <Input id="contact-person" {...form.register('contactPerson')} placeholder="John Smith" />
                    {form.formState.errors.contactPerson && (
                        <p className="text-sm text-destructive">{form.formState.errors.contactPerson.message}</p>
                    )}
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="partner-email">Email <span className="text-destructive">*</span></Label>
                    <Input id="partner-email" type="email" {...form.register('email')} placeholder="john@acme.com" />
                    {form.formState.errors.email && (
                        <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="partner-phone">Phone <span className="text-destructive">*</span></Label>
                    <Input id="partner-phone" type="tel" {...form.register('phone')} placeholder="+1 (555) 000-0000" />
                    {form.formState.errors.phone && (
                        <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
                    )}
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="partnership-type">Partnership Type <span className="text-destructive">*</span></Label>
                    <Select
                        value={form.watch('partnershipType')}
                        onValueChange={(value) => form.setValue('partnershipType', value as PartnershipData['partnershipType'])}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="investor">Investor</SelectItem>
                            <SelectItem value="developer">Developer</SelectItem>
                            <SelectItem value="agent">Agent/Broker</SelectItem>
                            <SelectItem value="supplier">Supplier</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="company-website">Company Website</Label>
                    <Input id="company-website" type="url" {...form.register('website')} placeholder="https://acme.com" />
                    {form.formState.errors.website && (
                        <p className="text-sm text-destructive">{form.formState.errors.website.message}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="proposal">Partnership Proposal <span className="text-destructive">*</span></Label>
                <Textarea id="proposal" {...form.register('proposal')} placeholder="Describe your partnership proposal..." rows={6} />
                {form.formState.errors.proposal && (
                    <p className="text-sm text-destructive">{form.formState.errors.proposal.message}</p>
                )}
            </div>

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Submitting...' : 'Submit Partnership Inquiry'}
            </Button>
        </form>
    );
}
