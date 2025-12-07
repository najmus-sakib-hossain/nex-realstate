import { z } from 'zod';

// ================================
// COMMON VALIDATION SCHEMAS
// ================================

export const emailSchema = z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address');

export const phoneSchema = z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[+]?[\d\s-()]+$/, 'Please enter a valid phone number');

export const urlSchema = z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal(''));

export const requiredString = (fieldName: string) =>
    z.string().min(1, `${fieldName} is required`);

export const optionalString = z.string().optional().or(z.literal(''));

// ================================
// CONTACT FORM SCHEMA
// ================================

export const contactFormSchema = z.object({
    name: requiredString('Name'),
    email: emailSchema,
    phone: phoneSchema.optional().or(z.literal('')),
    subject: requiredString('Subject'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
    type: z.enum(['general', 'property', 'investment', 'partnership', 'other']).default('general'),
    propertyInterest: optionalString,
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// ================================
// CAREER APPLICATION SCHEMA
// ================================

export const careerApplicationSchema = z.object({
    name: requiredString('Name'),
    email: emailSchema,
    phone: phoneSchema,
    jobId: requiredString('Job ID'),
    jobTitle: requiredString('Job Title'),
    coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters').optional(),
    linkedIn: urlSchema,
    portfolio: urlSchema,
    resume: z.string().min(1, 'Resume is required'),
});

export type CareerApplicationData = z.infer<typeof careerApplicationSchema>;

// ================================
// LAND INQUIRY SCHEMA
// ================================

export const landInquirySchema = z.object({
    name: requiredString('Name'),
    email: emailSchema,
    phone: phoneSchema,
    landType: z.enum(['residential', 'commercial', 'industrial', 'agricultural', 'mixed']),
    location: requiredString('Preferred location'),
    minSize: z.coerce.number().min(1, 'Minimum size is required'),
    maxSize: z.coerce.number().min(1, 'Maximum size is required'),
    sizeUnit: z.enum(['katha', 'bigha', 'acre', 'sqft']).default('katha'),
    budget: optionalString,
    timeline: z.enum(['immediate', '3-months', '6-months', '1-year', 'flexible']).default('flexible'),
    additionalRequirements: optionalString,
});

export type LandInquiryData = z.infer<typeof landInquirySchema>;

// ================================
// PARTNERSHIP INQUIRY SCHEMA
// ================================

export const partnershipInquirySchema = z.object({
    companyName: requiredString('Company name'),
    contactPerson: requiredString('Contact person'),
    email: emailSchema,
    phone: phoneSchema,
    website: urlSchema,
    partnershipType: z.enum(['supplier', 'contractor', 'investor', 'consultant', 'other']),
    businessCategory: requiredString('Business category'),
    experience: z.coerce.number().min(0, 'Experience must be a positive number'),
    portfolio: optionalString,
    message: z.string().min(20, 'Message must be at least 20 characters'),
});

export type PartnershipInquiryData = z.infer<typeof partnershipInquirySchema>;

// ================================
// ADMIN LOGIN SCHEMA
// ================================

export const adminLoginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
    remember: z.boolean().default(false),
});

export type AdminLoginData = z.infer<typeof adminLoginSchema>;

// ================================
// PROJECT SCHEMA (Admin)
// ================================

export const projectSchema = z.object({
    title: requiredString('Title'),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
    description: requiredString('Description'),
    fullDescription: z.string().min(50, 'Full description must be at least 50 characters'),
    location: requiredString('Location'),
    address: requiredString('Address'),
    price: requiredString('Price'),
    priceRange: z.object({
        min: z.coerce.number().min(0),
        max: z.coerce.number().min(0),
    }).optional(),
    category: z.enum(['residential', 'commercial', 'land', 'resort', 'hospital', 'hotel']),
    status: z.enum(['ongoing', 'completed', 'upcoming']),
    features: z.array(z.string()).min(1, 'At least one feature is required'),
    amenities: z.array(z.string()).min(1, 'At least one amenity is required'),
    specifications: z.object({
        landArea: optionalString,
        floors: z.coerce.number().optional(),
        units: z.coerce.number().optional(),
        parking: z.coerce.number().optional(),
        completion: optionalString,
    }).optional(),
    featured: z.boolean().default(false),
    order: z.coerce.number().min(0).default(0),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

// ================================
// SERVICE SCHEMA (Admin)
// ================================

export const serviceSchema = z.object({
    title: requiredString('Title'),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
    shortDescription: z.string().min(10, 'Short description must be at least 10 characters'),
    fullDescription: z.string().min(50, 'Full description must be at least 50 characters'),
    icon: requiredString('Icon'),
    features: z.array(z.string()).min(1, 'At least one feature is required'),
    order: z.coerce.number().min(0).default(0),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

// ================================
// NEWS ARTICLE SCHEMA (Admin)
// ================================

export const newsArticleSchema = z.object({
    title: requiredString('Title'),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
    excerpt: z.string().min(20, 'Excerpt must be at least 20 characters'),
    content: z.string().min(100, 'Content must be at least 100 characters'),
    category: z.enum(['news', 'blog', 'press-release', 'event']),
    author: requiredString('Author'),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
    publishedAt: z.string().optional(),
});

export type NewsArticleFormData = z.infer<typeof newsArticleSchema>;

// ================================
// SITE SETTINGS SCHEMA (Admin)
// ================================

export const siteSettingsSchema = z.object({
    siteName: requiredString('Site name'),
    tagline: requiredString('Tagline'),
    contactEmail: emailSchema,
    contactPhone: z.array(z.string()).min(1, 'At least one phone number is required'),
    address: requiredString('Address'),
    socialLinks: z.object({
        facebook: urlSchema,
        youtube: urlSchema,
        linkedin: urlSchema,
        instagram: urlSchema,
        twitter: urlSchema,
    }),
    seo: z.object({
        title: requiredString('SEO title'),
        description: z.string().min(50, 'SEO description must be at least 50 characters'),
        keywords: z.array(z.string()).min(1, 'At least one keyword is required'),
    }),
    footer: z.object({
        copyright: requiredString('Copyright text'),
        developedBy: z.object({
            name: requiredString('Developer name'),
            url: urlSchema,
        }),
    }),
    maintenanceMode: z.boolean().default(false),
    maintenanceMessage: optionalString,
});

export type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>;
