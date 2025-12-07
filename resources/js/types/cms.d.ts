// ================================
// NEX REAL ESTATE CMS TYPES
// ================================

// Base types
export interface BaseContent {
    id: string;
    createdAt: string;
    updatedAt: string;
}

export interface ImageAsset {
    id: string;
    url: string;
    alt: string;
    width?: number;
    height?: number;
}

export interface VideoAsset {
    id: string;
    url: string;
    thumbnail?: string;
    duration?: number;
}

// ================================
// HOME PAGE TYPES
// ================================

export interface HeroBanner extends BaseContent {
    tagline: string;
    title: string;
    subtitle: string;
    backgroundImage: ImageAsset;
    /**
     * Foreground artwork used in the parallax hero (e.g., transparent building illustration)
     */
    foregroundImage?: ImageAsset;
    ctaButtons: {
        primary: { text: string; link: string };
        secondary: { text: string; link: string };
    };
}

export interface FeaturedProject extends BaseContent {
    title: string;
    description: string;
    location: string;
    price: string;
    image: ImageAsset;
    category: 'residential' | 'commercial' | 'land' | 'resort' | 'hospital' | 'hotel';
    status: 'ongoing' | 'completed' | 'upcoming';
    slug: string;
    featured: boolean;
}

export interface HomePageContent {
    heroBanner: HeroBanner;
    featuredProjects: FeaturedProject[];
    ceoMessage: {
        name: string;
        title: string;
        message: string;
        image: ImageAsset;
        signature?: ImageAsset;
    };
    valuePropositions: Array<{
        id: string;
        title: string;
        description: string;
        icon: string;
    }>;
    marketingLines: string[];
}

// ================================
// ABOUT PAGE TYPES
// ================================

export interface TeamMember extends BaseContent {
    name: string;
    position: string;
    bio: string;
    image: ImageAsset;
    order: number;
    category: 'leadership' | 'advisor';
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
        email?: string;
    };
}

export interface Award extends BaseContent {
    title: string;
    year: string;
    description: string;
    image?: ImageAsset;
}

export interface AboutPageContent {
    ourStory: {
        title: string;
        content: string;
        image: ImageAsset;
    };
    mission: {
        title: string;
        content: string;
    };
    vision: {
        title: string;
        content: string;
    };
    values: Array<{
        id: string;
        title: string;
        description: string;
        icon: string;
    }>;
    leadershipTeam: TeamMember[];
    boardOfAdvisors: TeamMember[];
    awards: Award[];
}

// ================================
// SERVICES PAGE TYPES
// ================================

export interface Service extends BaseContent {
    title: string;
    slug: string;
    shortDescription: string;
    fullDescription: string;
    icon: string;
    image: ImageAsset;
    features: string[];
    order: number;
}

export interface ServicesPageContent {
    heroSection: {
        title: string;
        subtitle: string;
        backgroundImage: ImageAsset;
    };
    services: Service[];
    whyChooseUs: {
        title: string;
        subtitle: string;
        points: Array<{
            title: string;
            description: string;
        }>;
    };
}

// ================================
// PRODUCTS PAGE TYPES
// ================================

export interface ProductCategory extends BaseContent {
    title: string;
    slug: string;
    description: string;
    icon: string;
    image: ImageAsset;
    order: number;
}

export interface ProductsPageContent {
    heroSection: {
        title: string;
        subtitle: string;
        backgroundImage: ImageAsset;
    };
    categories: ProductCategory[];
}

// ================================
// PROJECTS PAGE TYPES
// ================================

export interface Project extends BaseContent {
    title: string;
    slug: string;
    description: string;
    fullDescription: string;
    location: string;
    address: string;
    price: string;
    priceRange?: { min: number; max: number };
    images: ImageAsset[];
    video?: VideoAsset;
    category: 'residential' | 'commercial' | 'land' | 'resort' | 'hospital' | 'hotel';
    status: 'ongoing' | 'completed' | 'upcoming';
    features: string[];
    amenities: string[];
    specifications: {
        landArea?: string;
        floors?: number;
        units?: number;
        parking?: number;
        completion?: string;
    };
    featured: boolean;
    order: number;
}

export interface ProjectsPageContent {
    heroSection: {
        title: string;
        subtitle: string;
        backgroundImage: ImageAsset;
    };
    ongoingProjects: Project[];
    completedProjects: Project[];
    upcomingProjects: Project[];
}

// ================================
// INVESTMENT PAGE TYPES
// ================================

export interface InvestmentOpportunity extends BaseContent {
    title: string;
    description: string;
    icon: string;
    benefits: string[];
}

export interface ROIProjection extends BaseContent {
    title: string;
    percentage: string;
    description: string;
    timeframe: string;
}

export interface InvestmentPageContent {
    heroSection: {
        title: string;
        subtitle: string;
        backgroundImage: ImageAsset;
    };
    whyInvest: {
        title: string;
        content: string;
        points: Array<{ title: string; description: string; icon: string }>;
    };
    roiProjections: ROIProjection[];
    landOwnerPartnership: {
        title: string;
        content: string;
        benefits: string[];
        image: ImageAsset;
    };
    jointVenture: {
        title: string;
        content: string;
        benefits: string[];
        image: ImageAsset;
    };
}

// ================================
// TESTIMONIALS
// ================================

export interface Testimonial extends BaseContent {
    name: string;
    position: string;
    company?: string;
    content: string;
    rating: number;
    image: ImageAsset;
    featured: boolean;
}

// ================================
// LAND WANTED PAGE TYPES
// ================================

export interface LandWantedPageContent {
    heroSection: {
        title: string;
        subtitle: string;
        backgroundImage: ImageAsset;
    };
    benefits: Array<{
        icon: string;
        title: string;
        description: string;
    }>;
    requirements: {
        title: string;
        description: string;
        items: Array<{
            id: string;
            title: string;
            description: string;
        }>;
    };
    preferredLocations: string[];
    landTypes: string[];
    ctaSection: {
        title: string;
        content: string;
        buttonText: string;
        buttonLink: string;
    };
}

// ================================
// MEDIA & NEWS PAGE TYPES
// ================================

export interface NewsArticle extends BaseContent {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: ImageAsset;
    category: 'news' | 'blog' | 'press' | 'launch';
    author: string;
    publishDate: string;
    featured: boolean;
    tags: string[];
}

export interface MediaPageContent {
    heroSection: {
        title: string;
        subtitle: string;
        backgroundImage: ImageAsset;
    };
    articles: NewsArticle[];
}

// ================================
// CAREER PAGE TYPES
// ================================

export interface JobOpening extends BaseContent {
    title: string;
    slug: string;
    department: string;
    location: string;
    type: 'full-time' | 'part-time' | 'contract' | 'internship';
    experience: string;
    salary?: string;
    description: string;
    requirements: string[];
    responsibilities: string[];
    benefits: string[];
    deadline?: string;
    active: boolean;
}

export interface CareerApplication extends BaseContent {
    jobId: string;
    jobTitle: string;
    name: string;
    email: string;
    phone: string;
    resume: string;
    coverLetter?: string;
    linkedIn?: string;
    portfolio?: string;
    status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
}

export interface CareerPageContent {
    heroSection: {
        title: string;
        subtitle: string;
        backgroundImage: ImageAsset;
    };
    lifeAtNex: {
        title: string;
        content: string;
        images: ImageAsset[];
        perks: Array<{ title: string; description: string; icon: string }>;
    };
    jobOpenings: JobOpening[];
    internshipProgram: {
        title: string;
        content: string;
        benefits: string[];
        image: ImageAsset;
    };
}

// ================================
// CONTACT PAGE TYPES
// ================================

export interface OfficeLocation extends BaseContent {
    title: string;
    type: 'hq' | 'corporate' | 'branch';
    address: string;
    phone: string[];
    email: string;
    mapCoordinates?: { lat: number; lng: number };
    image?: ImageAsset;
}

export interface ContactInquiry extends BaseContent {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    type: 'general' | 'property' | 'investment' | 'partnership' | 'other';
    status: 'pending' | 'responded' | 'closed';
    propertyInterest?: string;
    scheduledVisit?: string;
}

export interface ContactPageContent {
    heroSection: {
        title: string;
        subtitle: string;
        backgroundImage: ImageAsset;
    };
    offices: OfficeLocation[];
    socialLinks: {
        facebook?: string;
        youtube?: string;
        linkedin?: string;
        instagram?: string;
        twitter?: string;
    };
    workingHours: {
        weekdays: string;
        weekends?: string;
    };
}

// ================================
// BUSINESS PAGE TYPES
// ================================

export interface BusinessPartner extends BaseContent {
    name: string;
    slug: string;
    description: string;
    logo: ImageAsset;
    website?: string;
    category: string;
    order: number;
}

export interface BusinessPageContent {
    heroSection: {
        title: string;
        subtitle: string;
        backgroundImage: ImageAsset;
    };
    partners: BusinessPartner[];
    partnershipTypes: Array<{
        id: string;
        icon: string;
        title: string;
        description: string;
        benefits: string[];
    }>;
    whyPartner: Array<{
        icon: string;
        title: string;
        description: string;
    }>;
}

// ================================
// SITE SETTINGS
// ================================

export interface SiteSettings {
    siteName: string;
    tagline: string;
    logo: ImageAsset;
    logoDark?: ImageAsset;
    favicon: ImageAsset;
    contactEmail: string;
    contactPhone: string[];
    address: string;
    socialLinks: {
        facebook?: string;
        youtube?: string;
        linkedin?: string;
        instagram?: string;
        twitter?: string;
    };
    footer: {
        copyright: string;
        developedBy: {
            name: string;
            url: string;
        };
    };
    seo: {
        title: string;
        description: string;
        keywords: string[];
        ogImage: ImageAsset;
    };
    maintenanceMode: boolean;
    maintenanceMessage?: string;
}

// ================================
// ADMIN TYPES
// ================================

export interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'editor';
    lastLogin?: string;
}

export interface ActivityLog extends BaseContent {
    userId: string;
    userName: string;
    action: string;
    resource: string;
    resourceId: string;
    details?: string;
}

// ================================
// API RESPONSE TYPES
// ================================

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        currentPage: number;
        lastPage: number;
        perPage: number;
        total: number;
    };
}
