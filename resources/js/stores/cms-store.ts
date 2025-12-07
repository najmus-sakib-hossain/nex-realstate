import type {
    AboutPageContent,
    BusinessPageContent,
    CareerApplication,
    CareerPageContent,
    ContactInquiry,
    ContactPageContent,
    FeaturedProject,
    HeaderSettings,
    HomePageContent,
    InvestmentPageContent,
    LandWantedPageContent,
    MediaPageContent,
    NewsArticle,
    Project,
    ProjectsPageContent,
    ProductsPageContent,
    Service,
    ServicesPageContent,
    SiteSettings,
    Testimonial,
} from '@/types/cms';
import {
    dummyAboutContent,
    dummyBusinessContent,
    dummyCareerApplications,
    dummyCareerContent,
    dummyContactContent,
    dummyContactInquiries,
    dummyHomeContent,
    dummyInvestmentContent,
    dummyLandWantedContent,
    dummyMediaContent,
    dummyNewsArticles,
    dummyProductsContent,
    dummyProjects,
    dummyProjectsContent,
    dummyServices,
    dummyServicesContent,
    dummyTestimonials,
} from '@/data/dummy-data';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ================================
// ACTIVITY LOG
// ================================
export interface ActivityLogEntry {
    id: string;
    type: 'create' | 'update' | 'delete' | 'status_change';
    entity: string;
    entityId: string;
    entityName: string;
    description: string;
    timestamp: string;
    userId?: string;
    userName?: string;
}

// ================================
// CMS CONTENT STORE
// ================================

interface CMSState {
    // Initialization flag
    isInitialized: boolean;

    // Activity Log
    activityLog: ActivityLogEntry[];

    // Page Contents
    homeContent: HomePageContent | null;
    aboutContent: AboutPageContent | null;
    servicesContent: ServicesPageContent | null;
    productsContent: ProductsPageContent | null;
    projectsContent: ProjectsPageContent | null;
    investmentContent: InvestmentPageContent | null;
    landWantedContent: LandWantedPageContent | null;
    mediaContent: MediaPageContent | null;
    careerContent: CareerPageContent | null;
    contactContent: ContactPageContent | null;
    businessContent: BusinessPageContent | null;

    // Individual Items
    projects: Project[];
    services: Service[];
    testimonials: Testimonial[];
    newsArticles: NewsArticle[];
    featuredProjects: FeaturedProject[];

    // Form Submissions
    contactInquiries: ContactInquiry[];
    careerApplications: CareerApplication[];

    // Site Settings
    siteSettings: SiteSettings | null;
    headerSettings: HeaderSettings | null;

    // Initialize with default data
    initialize: () => void;

    // Activity Log Actions
    addActivity: (activity: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => void;
    clearActivityLog: () => void;

    // Actions
    setHomeContent: (content: HomePageContent) => void;
    setAboutContent: (content: AboutPageContent) => void;
    setServicesContent: (content: ServicesPageContent) => void;
    setProductsContent: (content: ProductsPageContent) => void;
    setProjectsContent: (content: ProjectsPageContent) => void;
    setInvestmentContent: (content: InvestmentPageContent) => void;
    setLandWantedContent: (content: LandWantedPageContent) => void;
    setMediaContent: (content: MediaPageContent) => void;
    setCareerContent: (content: CareerPageContent) => void;
    setContactContent: (content: ContactPageContent) => void;
    setBusinessContent: (content: BusinessPageContent) => void;

    setProjects: (projects: Project[]) => void;
    setServices: (services: Service[]) => void;
    setTestimonials: (testimonials: Testimonial[]) => void;
    setNewsArticles: (articles: NewsArticle[]) => void;
    setFeaturedProjects: (projects: FeaturedProject[]) => void;

    setContactInquiries: (inquiries: ContactInquiry[]) => void;
    setCareerApplications: (applications: CareerApplication[]) => void;

    setSiteSettings: (settings: SiteSettings) => void;
    setHeaderSettings: (settings: HeaderSettings) => void;

    // Utility actions
    updateProject: (id: string, updates: Partial<Project>) => void;
    deleteProject: (id: string) => void;
    addProject: (project: Project) => void;

    updateService: (id: string, updates: Partial<Service>) => void;
    deleteService: (id: string) => void;
    addService: (service: Service) => void;

    updateTestimonial: (id: string, updates: Partial<Testimonial>) => void;
    deleteTestimonial: (id: string) => void;
    addTestimonial: (testimonial: Testimonial) => void;

    updateNewsArticle: (id: string, updates: Partial<NewsArticle>) => void;
    deleteNewsArticle: (id: string) => void;
    addNewsArticle: (article: NewsArticle) => void;

    updateInquiryStatus: (id: string, status: ContactInquiry['status']) => void;
    deleteInquiry: (id: string) => void;

    updateApplicationStatus: (
        id: string,
        status: CareerApplication['status'],
    ) => void;
    deleteApplication: (id: string) => void;

    // Reset
    reset: () => void;
}

const initialState = {
    isInitialized: false,
    activityLog: [] as ActivityLogEntry[],
    homeContent: dummyHomeContent,
    aboutContent: dummyAboutContent,
    servicesContent: dummyServicesContent,
    productsContent: dummyProductsContent,
    projectsContent: dummyProjectsContent,
    investmentContent: dummyInvestmentContent,
    landWantedContent: dummyLandWantedContent,
    mediaContent: dummyMediaContent,
    careerContent: dummyCareerContent,
    contactContent: dummyContactContent,
    businessContent: dummyBusinessContent,
    projects: dummyProjects,
    services: dummyServices,
    testimonials: dummyTestimonials,
    newsArticles: dummyNewsArticles,
    featuredProjects: [] as FeaturedProject[],
    contactInquiries: dummyContactInquiries,
    careerApplications: dummyCareerApplications,
    siteSettings: null as SiteSettings | null,
    headerSettings: {
        logo: {
            id: 'header-logo-1',
            url: '/logo.png',
            alt: 'Nex Real Estate Logo',
        },
        brandName: 'Nex',
        brandNameHighlight: 'Real Estate',
        showTopBar: true,
        topBar: {
            contactPhone: '+880 1677-600000',
            contactEmail: 'hello.nexrealestate@gmail.com',
            socialLinks: {
                facebook: 'https://www.facebook.com/NexRealEstateLtd',
                youtube: 'https://www.youtube.com/@NexRealEstateLtd',
                linkedin: 'https://www.linkedin.com/company/nex-realestate/',
            },
        },
        navigation: [
            { id: 'nav-1', name: 'Home', href: '/', order: 1 },
            { id: 'nav-2', name: 'About Us', href: '/about', order: 2 },
            {
                id: 'nav-3',
                name: 'Services',
                href: '/services',
                order: 3,
                children: [
                    { id: 'nav-3-1', name: 'Project Management', href: '/services/project-management', order: 1 },
                    { id: 'nav-3-2', name: 'Consultancy', href: '/services/consultancy', order: 2 },
                    { id: 'nav-3-3', name: 'Property Buy & Sales', href: '/services/property-buy-sales', order: 3 },
                    { id: 'nav-3-4', name: 'Land Development', href: '/services/land-development', order: 4 },
                    { id: 'nav-3-5', name: 'Construction Services', href: '/services/construction-services', order: 5 },
                    { id: 'nav-3-6', name: 'Interior & Design', href: '/services/interior-design', order: 6 },
                    { id: 'nav-3-7', name: 'After-Sales Support', href: '/services/after-sales-support', order: 7 },
                ],
            },
            {
                id: 'nav-4',
                name: 'Products',
                href: '/products',
                order: 4,
                children: [
                    { id: 'nav-4-1', name: 'Residential', href: '/products/residential', order: 1 },
                    { id: 'nav-4-2', name: 'Commercial', href: '/products/commercial', order: 2 },
                    { id: 'nav-4-3', name: 'Land', href: '/products/land', order: 3 },
                    { id: 'nav-4-4', name: 'Resorts', href: '/products/resorts', order: 4 },
                    { id: 'nav-4-5', name: 'Hospitals', href: '/products/hospitals', order: 5 },
                    { id: 'nav-4-6', name: 'Hotels', href: '/products/hotels', order: 6 },
                ],
            },
            {
                id: 'nav-5',
                name: 'Projects',
                href: '/projects',
                order: 5,
                children: [
                    { id: 'nav-5-1', name: 'Ongoing', href: '/projects/ongoing', order: 1 },
                    { id: 'nav-5-2', name: 'Completed', href: '/projects/completed', order: 2 },
                    { id: 'nav-5-3', name: 'Upcoming', href: '/projects/upcoming', order: 3 },
                ],
            },
            { id: 'nav-6', name: 'Investment', href: '/investment', order: 6 },
            { id: 'nav-7', name: 'Land Wanted', href: '/land-wanted', order: 7 },
            { id: 'nav-8', name: 'Media & News', href: '/media', order: 8 },
            { id: 'nav-9', name: 'Career', href: '/career', order: 9 },
            { id: 'nav-10', name: 'Business', href: '/business', order: 10 },
            { id: 'nav-11', name: 'Contact', href: '/contact', order: 11 },
        ],
        ctaButton: {
            text: 'Book a Visit',
            href: '/contact',
        },
    } as HeaderSettings,
};

export const useCMSStore = create<CMSState>()(
    devtools(
        persist(
            immer(
                (set, get) => ({
                    // Initial State
                    ...initialState,

                    // Initialize function
                    initialize: () => {
                        if (!get().isInitialized) {
                            set({ isInitialized: true });
                        }
                    },

                    // Activity Log Actions
                    addActivity: (activity) =>
                        set((state) => ({
                            activityLog: [
                                {
                                    ...activity,
                                    id: `activity-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                                    timestamp: new Date().toISOString(),
                                },
                                ...state.activityLog.slice(0, 99), // Keep last 100 activities
                            ],
                        })),
                    clearActivityLog: () => set({ activityLog: [] }),

                    // Page Content Actions
                    setHomeContent: (content) => set({ homeContent: content }),
                    setAboutContent: (content) => set({ aboutContent: content }),
                    setServicesContent: (content) => set({ servicesContent: content }),
                    setProductsContent: (content) => set({ productsContent: content }),
                    setProjectsContent: (content) =>
                        set({ projectsContent: content }),
                    setInvestmentContent: (content) =>
                        set({ investmentContent: content }),
                    setLandWantedContent: (content) =>
                        set({ landWantedContent: content }),
                    setMediaContent: (content) => set({ mediaContent: content }),
                    setCareerContent: (content) => set({ careerContent: content }),
                    setContactContent: (content) => set({ contactContent: content }),
                    setBusinessContent: (content) => set({ businessContent: content }),

                    // Collection Actions
                    setProjects: (projects) => set({ projects }),
                    setServices: (services) => set({ services }),
                    setTestimonials: (testimonials) => set({ testimonials }),
                    setNewsArticles: (articles) => set({ newsArticles: articles }),
                    setFeaturedProjects: (projects) =>
                        set({ featuredProjects: projects }),

                    setContactInquiries: (inquiries) =>
                        set({ contactInquiries: inquiries }),
                    setCareerApplications: (applications) =>
                        set({ careerApplications: applications }),

                    setSiteSettings: (settings) => set({ siteSettings: settings }),
                    setHeaderSettings: (settings) => set({ headerSettings: settings }),

                    // Project Actions
                    updateProject: (id, updates) =>
                        set((state) => ({
                            projects: state.projects.map((p) =>
                                p.id === id ? { ...p, ...updates } : p,
                            ),
                        })),
                    deleteProject: (id) =>
                        set((state) => ({
                            projects: state.projects.filter((p) => p.id !== id),
                        })),
                    addProject: (project) =>
                        set((state) => ({
                            projects: [...state.projects, project],
                        })),

                    // Service Actions
                    updateService: (id, updates) =>
                        set((state) => ({
                            services: state.services.map((s) =>
                                s.id === id ? { ...s, ...updates } : s,
                            ),
                        })),
                    deleteService: (id) =>
                        set((state) => ({
                            services: state.services.filter((s) => s.id !== id),
                        })),
                    addService: (service) =>
                        set((state) => ({
                            services: [...state.services, service],
                        })),

                    // Testimonial Actions
                    updateTestimonial: (id, updates) =>
                        set((state) => ({
                            testimonials: state.testimonials.map((t) =>
                                t.id === id ? { ...t, ...updates } : t,
                            ),
                        })),
                    deleteTestimonial: (id) =>
                        set((state) => ({
                            testimonials: state.testimonials.filter((t) => t.id !== id),
                        })),
                    addTestimonial: (testimonial) =>
                        set((state) => ({
                            testimonials: [...state.testimonials, testimonial],
                        })),

                    // News Article Actions
                    updateNewsArticle: (id, updates) =>
                        set((state) => ({
                            newsArticles: state.newsArticles.map((a) =>
                                a.id === id ? { ...a, ...updates } : a,
                            ),
                        })),
                    deleteNewsArticle: (id) =>
                        set((state) => ({
                            newsArticles: state.newsArticles.filter((a) => a.id !== id),
                        })),
                    addNewsArticle: (article) =>
                        set((state) => ({
                            newsArticles: [...state.newsArticles, article],
                        })),

                    updateInquiryStatus: (id, status) =>
                        set((state) => ({
                            contactInquiries: state.contactInquiries.map((i) =>
                                i.id === id ? { ...i, status } : i,
                            ),
                        })),
                    deleteInquiry: (id) =>
                        set((state) => ({
                            contactInquiries: state.contactInquiries.filter(
                                (i) => i.id !== id,
                            ),
                        })),

                    updateApplicationStatus: (id, status) =>
                        set((state) => ({
                            careerApplications: state.careerApplications.map((a) =>
                                a.id === id ? { ...a, status } : a,
                            ),
                        })),
                    deleteApplication: (id) =>
                        set((state) => ({
                            careerApplications: state.careerApplications.filter(
                                (a) => a.id !== id,
                            ),
                        })),

                    // Reset
                    reset: () => set(initialState),
                }),
            ),
            {
                name: 'nex-cms-storage',
                partialize: (state) => ({
                    // Only persist content, not UI state
                    homeContent: state.homeContent,
                    aboutContent: state.aboutContent,
                    servicesContent: state.servicesContent,
                    productsContent: state.productsContent,
                    projectsContent: state.projectsContent,
                    investmentContent: state.investmentContent,
                    landWantedContent: state.landWantedContent,
                    mediaContent: state.mediaContent,
                    careerContent: state.careerContent,
                    contactContent: state.contactContent,
                    businessContent: state.businessContent,
                    projects: state.projects,
                    services: state.services,
                    testimonials: state.testimonials,
                    newsArticles: state.newsArticles,
                    contactInquiries: state.contactInquiries,
                    careerApplications: state.careerApplications,
                    activityLog: state.activityLog,
                    headerSettings: state.headerSettings,
                }),
            },
        ),
        { name: 'nex-cms-store' },
    ),
);
