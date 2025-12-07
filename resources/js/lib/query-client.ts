import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 30, // 30 minutes (previously cacheTime)
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnMount: true,
        },
        mutations: {
            retry: 0,
        },
    },
});

// Query Keys for consistent caching
export const queryKeys = {
    // Page Contents
    homeContent: ['home-content'] as const,
    aboutContent: ['about-content'] as const,
    servicesContent: ['services-content'] as const,
    productsContent: ['products-content'] as const,
    projectsContent: ['projects-content'] as const,
    investmentContent: ['investment-content'] as const,
    landWantedContent: ['land-wanted-content'] as const,
    mediaContent: ['media-content'] as const,
    careerContent: ['career-content'] as const,
    contactContent: ['contact-content'] as const,
    businessContent: ['business-content'] as const,

    // Collections
    projects: ['projects'] as const,
    project: (id: string) => ['projects', id] as const,
    projectsByStatus: (status: string) => ['projects', 'status', status] as const,
    projectsByCategory: (category: string) => ['projects', 'category', category] as const,

    services: ['services'] as const,
    service: (id: string) => ['services', id] as const,

    testimonials: ['testimonials'] as const,
    testimonial: (id: string) => ['testimonials', id] as const,

    newsArticles: ['news-articles'] as const,
    newsArticle: (slug: string) => ['news-articles', slug] as const,
    newsArticlesByCategory: (category: string) => ['news-articles', 'category', category] as const,

    jobOpenings: ['job-openings'] as const,
    jobOpening: (id: string) => ['job-openings', id] as const,

    // Form Submissions
    contactInquiries: ['contact-inquiries'] as const,
    contactInquiry: (id: string) => ['contact-inquiries', id] as const,

    careerApplications: ['career-applications'] as const,
    careerApplication: (id: string) => ['career-applications', id] as const,

    // Settings
    siteSettings: ['site-settings'] as const,

    // Team
    teamMembers: ['team-members'] as const,
    teamMember: (id: string) => ['team-members', id] as const,

    // Business Partners
    businessPartners: ['business-partners'] as const,
    businessPartner: (id: string) => ['business-partners', id] as const,
} as const;
