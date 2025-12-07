import type {
    AboutPageContent,
    ApiResponse,
    BusinessPageContent,
    CareerApplication,
    CareerPageContent,
    ContactInquiry,
    ContactPageContent,
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
import api from './axios';

// ================================
// PAGE CONTENT API
// ================================

export const pageContentApi = {
    // Home Page
    getHomeContent: async (): Promise<HomePageContent> => {
        const { data } = await api.get<ApiResponse<HomePageContent>>(
            '/content/home',
        );
        return data.data;
    },
    updateHomeContent: async (
        content: Partial<HomePageContent>,
    ): Promise<HomePageContent> => {
        const { data } = await api.put<ApiResponse<HomePageContent>>(
            '/content/home',
            content,
        );
        return data.data;
    },

    // About Page
    getAboutContent: async (): Promise<AboutPageContent> => {
        const { data } = await api.get<ApiResponse<AboutPageContent>>(
            '/content/about',
        );
        return data.data;
    },
    updateAboutContent: async (
        content: Partial<AboutPageContent>,
    ): Promise<AboutPageContent> => {
        const { data } = await api.put<ApiResponse<AboutPageContent>>(
            '/content/about',
            content,
        );
        return data.data;
    },

    // Services Page
    getServicesContent: async (): Promise<ServicesPageContent> => {
        const { data } = await api.get<ApiResponse<ServicesPageContent>>(
            '/content/services',
        );
        return data.data;
    },
    updateServicesContent: async (
        content: Partial<ServicesPageContent>,
    ): Promise<ServicesPageContent> => {
        const { data } = await api.put<ApiResponse<ServicesPageContent>>(
            '/content/services',
            content,
        );
        return data.data;
    },

    // Products Page
    getProductsContent: async (): Promise<ProductsPageContent> => {
        const { data } = await api.get<ApiResponse<ProductsPageContent>>(
            '/content/products',
        );
        return data.data;
    },
    updateProductsContent: async (
        content: Partial<ProductsPageContent>,
    ): Promise<ProductsPageContent> => {
        const { data } = await api.put<ApiResponse<ProductsPageContent>>(
            '/content/products',
            content,
        );
        return data.data;
    },

    // Projects Page
    getProjectsContent: async (): Promise<ProjectsPageContent> => {
        const { data } = await api.get<ApiResponse<ProjectsPageContent>>(
            '/content/projects',
        );
        return data.data;
    },
    updateProjectsContent: async (
        content: Partial<ProjectsPageContent>,
    ): Promise<ProjectsPageContent> => {
        const { data } = await api.put<ApiResponse<ProjectsPageContent>>(
            '/content/projects',
            content,
        );
        return data.data;
    },

    // Investment Page
    getInvestmentContent: async (): Promise<InvestmentPageContent> => {
        const { data } = await api.get<ApiResponse<InvestmentPageContent>>(
            '/content/investment',
        );
        return data.data;
    },
    updateInvestmentContent: async (
        content: Partial<InvestmentPageContent>,
    ): Promise<InvestmentPageContent> => {
        const { data } = await api.put<ApiResponse<InvestmentPageContent>>(
            '/content/investment',
            content,
        );
        return data.data;
    },

    // Land Wanted Page
    getLandWantedContent: async (): Promise<LandWantedPageContent> => {
        const { data } = await api.get<ApiResponse<LandWantedPageContent>>(
            '/content/land-wanted',
        );
        return data.data;
    },
    updateLandWantedContent: async (
        content: Partial<LandWantedPageContent>,
    ): Promise<LandWantedPageContent> => {
        const { data } = await api.put<ApiResponse<LandWantedPageContent>>(
            '/content/land-wanted',
            content,
        );
        return data.data;
    },

    // Media Page
    getMediaContent: async (): Promise<MediaPageContent> => {
        const { data } = await api.get<ApiResponse<MediaPageContent>>(
            '/content/media',
        );
        return data.data;
    },
    updateMediaContent: async (
        content: Partial<MediaPageContent>,
    ): Promise<MediaPageContent> => {
        const { data } = await api.put<ApiResponse<MediaPageContent>>(
            '/content/media',
            content,
        );
        return data.data;
    },

    // Career Page
    getCareerContent: async (): Promise<CareerPageContent> => {
        const { data } = await api.get<ApiResponse<CareerPageContent>>(
            '/content/career',
        );
        return data.data;
    },
    updateCareerContent: async (
        content: Partial<CareerPageContent>,
    ): Promise<CareerPageContent> => {
        const { data } = await api.put<ApiResponse<CareerPageContent>>(
            '/content/career',
            content,
        );
        return data.data;
    },

    // Contact Page
    getContactContent: async (): Promise<ContactPageContent> => {
        const { data } = await api.get<ApiResponse<ContactPageContent>>(
            '/content/contact',
        );
        return data.data;
    },
    updateContactContent: async (
        content: Partial<ContactPageContent>,
    ): Promise<ContactPageContent> => {
        const { data } = await api.put<ApiResponse<ContactPageContent>>(
            '/content/contact',
            content,
        );
        return data.data;
    },

    // Business Page
    getBusinessContent: async (): Promise<BusinessPageContent> => {
        const { data } = await api.get<ApiResponse<BusinessPageContent>>(
            '/content/business',
        );
        return data.data;
    },
    updateBusinessContent: async (
        content: Partial<BusinessPageContent>,
    ): Promise<BusinessPageContent> => {
        const { data } = await api.put<ApiResponse<BusinessPageContent>>(
            '/content/business',
            content,
        );
        return data.data;
    },
};

// ================================
// PROJECTS API
// ================================

export const projectsApi = {
    getAll: async (): Promise<Project[]> => {
        const { data } = await api.get<ApiResponse<Project[]>>('/projects');
        return data.data;
    },
    getById: async (id: string): Promise<Project> => {
        const { data } = await api.get<ApiResponse<Project>>(`/projects/${id}`);
        return data.data;
    },
    getBySlug: async (slug: string): Promise<Project> => {
        const { data } = await api.get<ApiResponse<Project>>(
            `/projects/slug/${slug}`,
        );
        return data.data;
    },
    getByStatus: async (
        status: 'ongoing' | 'completed' | 'upcoming',
    ): Promise<Project[]> => {
        const { data } = await api.get<ApiResponse<Project[]>>(
            `/projects/status/${status}`,
        );
        return data.data;
    },
    create: async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
        const { data } = await api.post<ApiResponse<Project>>(
            '/projects',
            project,
        );
        return data.data;
    },
    update: async (id: string, project: Partial<Project>): Promise<Project> => {
        const { data } = await api.put<ApiResponse<Project>>(
            `/projects/${id}`,
            project,
        );
        return data.data;
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/projects/${id}`);
    },
};

// ================================
// SERVICES API
// ================================

export const servicesApi = {
    getAll: async (): Promise<Service[]> => {
        const { data } = await api.get<ApiResponse<Service[]>>('/services');
        return data.data;
    },
    getById: async (id: string): Promise<Service> => {
        const { data } = await api.get<ApiResponse<Service>>(`/services/${id}`);
        return data.data;
    },
    create: async (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<Service> => {
        const { data } = await api.post<ApiResponse<Service>>(
            '/services',
            service,
        );
        return data.data;
    },
    update: async (id: string, service: Partial<Service>): Promise<Service> => {
        const { data } = await api.put<ApiResponse<Service>>(
            `/services/${id}`,
            service,
        );
        return data.data;
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/services/${id}`);
    },
};

// ================================
// TESTIMONIALS API
// ================================

export const testimonialsApi = {
    getAll: async (): Promise<Testimonial[]> => {
        const { data } =
            await api.get<ApiResponse<Testimonial[]>>('/testimonials');
        return data.data;
    },
    getById: async (id: string): Promise<Testimonial> => {
        const { data } = await api.get<ApiResponse<Testimonial>>(
            `/testimonials/${id}`,
        );
        return data.data;
    },
    create: async (
        testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>,
    ): Promise<Testimonial> => {
        const { data } = await api.post<ApiResponse<Testimonial>>(
            '/testimonials',
            testimonial,
        );
        return data.data;
    },
    update: async (
        id: string,
        testimonial: Partial<Testimonial>,
    ): Promise<Testimonial> => {
        const { data } = await api.put<ApiResponse<Testimonial>>(
            `/testimonials/${id}`,
            testimonial,
        );
        return data.data;
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/testimonials/${id}`);
    },
};

// ================================
// NEWS ARTICLES API
// ================================

export const newsApi = {
    getAll: async (): Promise<NewsArticle[]> => {
        const { data } = await api.get<ApiResponse<NewsArticle[]>>('/news');
        return data.data;
    },
    getBySlug: async (slug: string): Promise<NewsArticle> => {
        const { data } = await api.get<ApiResponse<NewsArticle>>(
            `/news/slug/${slug}`,
        );
        return data.data;
    },
    getByCategory: async (
        category: NewsArticle['category'],
    ): Promise<NewsArticle[]> => {
        const { data } = await api.get<ApiResponse<NewsArticle[]>>(
            `/news/category/${category}`,
        );
        return data.data;
    },
    create: async (
        article: Omit<NewsArticle, 'id' | 'createdAt' | 'updatedAt'>,
    ): Promise<NewsArticle> => {
        const { data } = await api.post<ApiResponse<NewsArticle>>(
            '/news',
            article,
        );
        return data.data;
    },
    update: async (
        id: string,
        article: Partial<NewsArticle>,
    ): Promise<NewsArticle> => {
        const { data } = await api.put<ApiResponse<NewsArticle>>(
            `/news/${id}`,
            article,
        );
        return data.data;
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/news/${id}`);
    },
};

// ================================
// CONTACT INQUIRIES API
// ================================

export const contactInquiriesApi = {
    getAll: async (): Promise<ContactInquiry[]> => {
        const { data } =
            await api.get<ApiResponse<ContactInquiry[]>>('/inquiries');
        return data.data;
    },
    getById: async (id: string): Promise<ContactInquiry> => {
        const { data } = await api.get<ApiResponse<ContactInquiry>>(
            `/inquiries/${id}`,
        );
        return data.data;
    },
    create: async (
        inquiry: Omit<ContactInquiry, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
    ): Promise<ContactInquiry> => {
        const { data } = await api.post<ApiResponse<ContactInquiry>>(
            '/inquiries',
            inquiry,
        );
        return data.data;
    },
    updateStatus: async (
        id: string,
        status: ContactInquiry['status'],
    ): Promise<ContactInquiry> => {
        const { data } = await api.patch<ApiResponse<ContactInquiry>>(
            `/inquiries/${id}/status`,
            { status },
        );
        return data.data;
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/inquiries/${id}`);
    },
};

// ================================
// CAREER APPLICATIONS API
// ================================

export const careerApplicationsApi = {
    getAll: async (): Promise<CareerApplication[]> => {
        const { data } =
            await api.get<ApiResponse<CareerApplication[]>>('/applications');
        return data.data;
    },
    getById: async (id: string): Promise<CareerApplication> => {
        const { data } = await api.get<ApiResponse<CareerApplication>>(
            `/applications/${id}`,
        );
        return data.data;
    },
    create: async (
        application: Omit<CareerApplication, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
    ): Promise<CareerApplication> => {
        const { data } = await api.post<ApiResponse<CareerApplication>>(
            '/applications',
            application,
        );
        return data.data;
    },
    updateStatus: async (
        id: string,
        status: CareerApplication['status'],
    ): Promise<CareerApplication> => {
        const { data } = await api.patch<ApiResponse<CareerApplication>>(
            `/applications/${id}/status`,
            { status },
        );
        return data.data;
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/applications/${id}`);
    },
};

// ================================
// SITE SETTINGS API
// ================================

export const siteSettingsApi = {
    get: async (): Promise<SiteSettings> => {
        const { data } =
            await api.get<ApiResponse<SiteSettings>>('/settings');
        return data.data;
    },
    update: async (settings: Partial<SiteSettings>): Promise<SiteSettings> => {
        const { data } = await api.put<ApiResponse<SiteSettings>>(
            '/settings',
            settings,
        );
        return data.data;
    },
};

// ================================
// FILE UPLOAD API
// ================================

export const uploadApi = {
    uploadImage: async (file: File): Promise<{ url: string; id: string }> => {
        const formData = new FormData();
        formData.append('image', file);
        const { data } = await api.post<
            ApiResponse<{ url: string; id: string }>
        >('/upload/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data.data;
    },
    uploadDocument: async (
        file: File,
    ): Promise<{ url: string; id: string }> => {
        const formData = new FormData();
        formData.append('document', file);
        const { data } = await api.post<
            ApiResponse<{ url: string; id: string }>
        >('/upload/document', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data.data;
    },
    deleteFile: async (id: string): Promise<void> => {
        await api.delete(`/upload/${id}`);
    },
};
