import { z } from 'zod';

// ================================
// SHARED SCHEMAS
// ================================

export const imageSchema = z.object({
    id: z.string(),
    url: z.string().url('Must be a valid URL'),
    alt: z.string().min(1, 'Alt text is required'),
});

export const ctaButtonSchema = z.object({
    text: z.string().min(1, 'Button text is required'),
    link: z.string().min(1, 'Button link is required'),
});

export const heroSectionSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    subtitle: z.string().min(1, 'Subtitle is required'),
    backgroundImage: imageSchema,
});

// ================================
// HOME PAGE SCHEMAS
// ================================

export const heroBannerSchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    tagline: z.string().min(1, 'Tagline is required'),
    title: z.string().min(1, 'Title is required'),
    subtitle: z.string().min(1, 'Subtitle is required'),
    backgroundImage: imageSchema,
    foregroundImage: imageSchema.optional(),
    ctaButtons: z.object({
        primary: ctaButtonSchema,
        secondary: ctaButtonSchema,
    }),
});

export const valuePropositionSchema = z.object({
    id: z.string(),
    icon: z.string().min(1, 'Icon is required'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
});

export const ceoMessageSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    title: z.string().min(1, 'Title is required'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
    image: imageSchema,
});

export const featuredProjectSchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    location: z.string().min(1, 'Location is required'),
    price: z.string().min(1, 'Price is required'),
    image: imageSchema,
    category: z.enum(['residential', 'commercial', 'land', 'resort', 'hospital', 'hotel']),
    status: z.enum(['ongoing', 'completed', 'upcoming']),
    slug: z.string().min(1, 'Slug is required'),
    featured: z.boolean(),
});

export const homePageSchema = z.object({
    heroBanner: heroBannerSchema,
    featuredProjects: z.array(featuredProjectSchema),
    valuePropositions: z.array(valuePropositionSchema).min(1, 'At least one value proposition is required'),
    ceoMessage: ceoMessageSchema,
    marketingLines: z.array(z.string().min(1, 'Marketing line cannot be empty')),
});

// ================================
// ABOUT PAGE SCHEMAS
// ================================

export const storySchema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(10, 'Content must be at least 10 characters'),
    image: imageSchema,
});

export const missionVisionSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(10, 'Content must be at least 10 characters'),
});

export const valueSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    icon: z.string().min(1, 'Icon is required'),
});

export const teamMemberSchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    name: z.string().min(1, 'Name is required'),
    position: z.string().min(1, 'Position is required'),
    bio: z.string().min(10, 'Bio must be at least 10 characters'),
    image: imageSchema,
    order: z.number(),
    category: z.enum(['leadership', 'advisor']),
    socialLinks: z.object({
        linkedin: z.string().url().optional(),
        twitter: z.string().url().optional(),
        facebook: z.string().url().optional(),
    }).optional(),
});

export const awardSchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    title: z.string().min(1, 'Title is required'),
    year: z.string().min(4, 'Year is required'),
    description: z.string().min(1, 'Description is required'),
});

export const aboutPageSchema = z.object({
    ourStory: storySchema,
    mission: missionVisionSchema,
    vision: missionVisionSchema,
    values: z.array(valueSchema).min(1, 'At least one value is required'),
    leadershipTeam: z.array(teamMemberSchema),
    boardOfAdvisors: z.array(teamMemberSchema),
    awards: z.array(awardSchema),
});

// ================================
// SERVICES PAGE SCHEMAS
// ================================

export const serviceSchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    shortDescription: z.string().min(10, 'Short description must be at least 10 characters'),
    fullDescription: z.string().min(20, 'Full description must be at least 20 characters'),
    icon: z.string().min(1, 'Icon is required'),
    image: imageSchema,
    features: z.array(z.string()).min(1, 'At least one feature is required'),
    order: z.number(),
});

export const servicesPageSchema = z.object({
    heroSection: heroSectionSchema,
    services: z.array(serviceSchema),
});

// ================================
// PRODUCTS PAGE SCHEMAS
// ================================

export const productCategorySchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    icon: z.string().min(1, 'Icon is required'),
    image: imageSchema,
    order: z.number(),
});

export const productsPageSchema = z.object({
    heroSection: heroSectionSchema,
    categories: z.array(productCategorySchema),
});

// ================================
// PROJECTS PAGE SCHEMAS
// ================================

export const projectSchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    fullDescription: z.string().min(20, 'Full description must be at least 20 characters'),
    location: z.string().min(1, 'Location is required'),
    address: z.string().min(1, 'Address is required'),
    price: z.string().min(1, 'Price is required'),
    images: z.array(imageSchema).min(1, 'At least one image is required'),
    category: z.enum(['residential', 'commercial', 'land', 'resort', 'hospital', 'hotel']),
    status: z.enum(['ongoing', 'completed', 'upcoming']),
    features: z.array(z.string()),
    amenities: z.array(z.string()),
    specifications: z.object({
        landArea: z.string(),
        floors: z.number(),
        units: z.number(),
        parking: z.number(),
        completion: z.string(),
    }),
    featured: z.boolean(),
    order: z.number(),
});

export const projectsPageSchema = z.object({
    heroSection: heroSectionSchema,
    ongoingProjects: z.array(projectSchema),
    completedProjects: z.array(projectSchema),
    upcomingProjects: z.array(projectSchema),
});

// ================================
// INVESTMENT PAGE SCHEMAS
// ================================

export const investmentPointSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    icon: z.string().min(1, 'Icon is required'),
});

export const roiProjectionSchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    title: z.string().min(1, 'Title is required'),
    percentage: z.string().min(1, 'Percentage is required'),
    description: z.string().min(1, 'Description is required'),
    timeframe: z.string().min(1, 'Timeframe is required'),
});

export const partnershipSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(10, 'Content must be at least 10 characters'),
    benefits: z.array(z.string()).min(1, 'At least one benefit is required'),
    image: imageSchema,
});

export const investmentPageSchema = z.object({
    heroSection: heroSectionSchema,
    whyInvest: z.object({
        title: z.string().min(1, 'Title is required'),
        content: z.string().min(10, 'Content must be at least 10 characters'),
        points: z.array(investmentPointSchema),
    }),
    roiProjections: z.array(roiProjectionSchema),
    landOwnerPartnership: partnershipSchema,
    jointVenture: partnershipSchema,
});

// ================================
// CAREER PAGE SCHEMAS
// ================================

export const perkSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    icon: z.string().min(1, 'Icon is required'),
});

export const jobOpeningSchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    department: z.string().min(1, 'Department is required'),
    location: z.string().min(1, 'Location is required'),
    type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
    experience: z.string().min(1, 'Experience is required'),
    salary: z.string().min(1, 'Salary is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    requirements: z.array(z.string()).min(1, 'At least one requirement is required'),
    responsibilities: z.array(z.string()).min(1, 'At least one responsibility is required'),
    benefits: z.array(z.string()),
    deadline: z.string().min(1, 'Deadline is required'),
    active: z.boolean(),
});

export const careerPageSchema = z.object({
    heroSection: heroSectionSchema,
    lifeAtNex: z.object({
        title: z.string().min(1, 'Title is required'),
        content: z.string().min(10, 'Content must be at least 10 characters'),
        images: z.array(imageSchema),
        perks: z.array(perkSchema),
    }),
    jobOpenings: z.array(jobOpeningSchema),
    internshipProgram: z.object({
        title: z.string().min(1, 'Title is required'),
        content: z.string().min(10, 'Content must be at least 10 characters'),
        benefits: z.array(z.string()),
        image: imageSchema,
    }),
});

// ================================
// CONTACT PAGE SCHEMAS
// ================================

export const officeSchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    title: z.string().min(1, 'Title is required'),
    type: z.enum(['hq', 'corporate', 'branch']),
    address: z.string().min(1, 'Address is required'),
    phone: z.array(z.string()),
    email: z.string().email('Must be a valid email'),
});

export const contactPageSchema = z.object({
    heroSection: heroSectionSchema,
    offices: z.array(officeSchema).min(1, 'At least one office is required'),
    socialLinks: z.object({
        facebook: z.string().url().optional(),
        youtube: z.string().url().optional(),
        linkedin: z.string().url().optional(),
        instagram: z.string().url().optional(),
        twitter: z.string().url().optional(),
    }),
    workingHours: z.object({
        weekdays: z.string().min(1, 'Weekday hours are required'),
        weekends: z.string().min(1, 'Weekend hours are required'),
    }),
});

// ================================
// MEDIA PAGE SCHEMAS
// ================================

export const newsArticleSchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
    content: z.string().min(20, 'Content must be at least 20 characters'),
    image: imageSchema,
    category: z.enum(['blog', 'press', 'launch', 'event']),
    author: z.string().min(1, 'Author is required'),
    publishDate: z.string().min(1, 'Publish date is required'),
    featured: z.boolean(),
    tags: z.array(z.string()),
});

export const mediaPageSchema = z.object({
    heroSection: heroSectionSchema,
    articles: z.array(newsArticleSchema),
});

// ================================
// BUSINESS PAGE SCHEMAS
// ================================

export const businessPartnerSchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    logo: imageSchema,
    website: z.string().url().optional(),
    category: z.string().min(1, 'Category is required'),
    order: z.number(),
});

export const businessPageSchema = z.object({
    heroSection: heroSectionSchema,
    partners: z.array(businessPartnerSchema),
});

// ================================
// LAND WANTED PAGE SCHEMAS
// ================================

export const requirementItemSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
});

export const benefitSchema = z.object({
    icon: z.string().min(1, 'Icon is required'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
});

export const landWantedPageSchema = z.object({
    heroSection: heroSectionSchema,
    benefits: z.array(benefitSchema),
    requirements: z.object({
        title: z.string().min(1, 'Title is required'),
        description: z.string().min(10, 'Description must be at least 10 characters'),
        items: z.array(requirementItemSchema),
    }),
    preferredLocations: z.array(z.string()),
    landTypes: z.array(z.string()),
    ctaSection: z.object({
        title: z.string().min(1, 'Title is required'),
        content: z.string().min(10, 'Content must be at least 10 characters'),
        buttonText: z.string().min(1, 'Button text is required'),
        buttonLink: z.string().min(1, 'Button link is required'),
    }),
});

// ================================
// TESTIMONIAL SCHEMA
// ================================

export const testimonialSchema = z.object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    name: z.string().min(1, 'Name is required'),
    position: z.string().min(1, 'Position is required'),
    company: z.string().min(1, 'Company is required'),
    content: z.string().min(20, 'Testimonial must be at least 20 characters'),
    rating: z.number().min(1).max(5),
    image: imageSchema,
    featured: z.boolean(),
});

// ================================
// HEADER SETTINGS SCHEMA
// ================================

export const navigationChildItemSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Name is required'),
    href: z.string().min(1, 'Link is required'),
    order: z.number().int().min(0),
});

export const navigationItemSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Name is required'),
    href: z.string().min(1, 'Link is required'),
    order: z.number().int().min(0),
    children: z.array(navigationChildItemSchema).optional(),
});

export const headerSettingsSchema = z.object({
    logo: imageSchema,
    brandName: z.string().min(1, 'Brand name is required'),
    brandNameHighlight: z.string().min(1, 'Brand name highlight is required'),
    showTopBar: z.boolean(),
    topBar: z.object({
        contactPhone: z.string().min(1, 'Contact phone is required'),
        contactEmail: z.string().email('Must be a valid email'),
        socialLinks: z.object({
            facebook: z.string().url('Must be a valid URL').optional().or(z.literal('')),
            youtube: z.string().url('Must be a valid URL').optional().or(z.literal('')),
            linkedin: z.string().url('Must be a valid URL').optional().or(z.literal('')),
        }),
    }),
    navigation: z.array(navigationItemSchema).min(1, 'At least one navigation item is required'),
    ctaButton: z.object({
        text: z.string().min(1, 'Button text is required'),
        href: z.string().min(1, 'Button link is required'),
    }),
});

// ================================
// TYPE EXPORTS
// ================================

export type HomePageFormData = z.infer<typeof homePageSchema>;
export type AboutPageFormData = z.infer<typeof aboutPageSchema>;
export type ServicesPageFormData = z.infer<typeof servicesPageSchema>;
export type ProductsPageFormData = z.infer<typeof productsPageSchema>;
export type ProjectsPageFormData = z.infer<typeof projectsPageSchema>;
export type InvestmentPageFormData = z.infer<typeof investmentPageSchema>;
export type CareerPageFormData = z.infer<typeof careerPageSchema>;
export type ContactPageFormData = z.infer<typeof contactPageSchema>;
export type MediaPageFormData = z.infer<typeof mediaPageSchema>;
export type BusinessPageFormData = z.infer<typeof businessPageSchema>;
export type LandWantedPageFormData = z.infer<typeof landWantedPageSchema>;
export type ServiceFormData = z.infer<typeof serviceSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type NewsArticleFormData = z.infer<typeof newsArticleSchema>;
export type TestimonialFormData = z.infer<typeof testimonialSchema>;
export type JobOpeningFormData = z.infer<typeof jobOpeningSchema>;
export type HeaderSettingsFormData = z.infer<typeof headerSettingsSchema>;
export type NavigationItemFormData = z.infer<typeof navigationItemSchema>;
export type NavigationChildItemFormData = z.infer<typeof navigationChildItemSchema>;
