import {
    careerApplicationsApi,
    contactInquiriesApi,
    newsApi,
    pageContentApi,
    projectsApi,
    servicesApi,
    siteSettingsApi,
    testimonialsApi,
} from '@/lib/api';
import { queryKeys } from '@/lib/query-client';
import { useCMSStore } from '@/stores';
import type {
    AboutPageContent,
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// ================================
// PAGE CONTENT HOOKS
// ================================

export const useHomeContent = () => {
    const setHomeContent = useCMSStore((state) => state.setHomeContent);

    return useQuery({
        queryKey: queryKeys.homeContent,
        queryFn: pageContentApi.getHomeContent,
        select: (data) => {
            setHomeContent(data);
            return data;
        },
    });
};

export const useUpdateHomeContent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: pageContentApi.updateHomeContent,
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.homeContent, data);
            toast.success('Home content updated successfully!');
        },
        onError: () => {
            toast.error('Failed to update home content');
        },
    });
};

export const useAboutContent = () => {
    const setAboutContent = useCMSStore((state) => state.setAboutContent);

    return useQuery({
        queryKey: queryKeys.aboutContent,
        queryFn: pageContentApi.getAboutContent,
        select: (data) => {
            setAboutContent(data);
            return data;
        },
    });
};

export const useUpdateAboutContent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: pageContentApi.updateAboutContent,
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.aboutContent, data);
            toast.success('About content updated successfully!');
        },
        onError: () => {
            toast.error('Failed to update about content');
        },
    });
};

export const useServicesContent = () => {
    const setServicesContent = useCMSStore((state) => state.setServicesContent);

    return useQuery({
        queryKey: queryKeys.servicesContent,
        queryFn: pageContentApi.getServicesContent,
        select: (data) => {
            setServicesContent(data);
            return data;
        },
    });
};

export const useUpdateServicesContent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: pageContentApi.updateServicesContent,
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.servicesContent, data);
            toast.success('Services content updated successfully!');
        },
        onError: () => {
            toast.error('Failed to update services content');
        },
    });
};

export const useProductsContent = () => {
    const setProductsContent = useCMSStore((state) => state.setProductsContent);

    return useQuery({
        queryKey: queryKeys.productsContent,
        queryFn: pageContentApi.getProductsContent,
        select: (data) => {
            setProductsContent(data);
            return data;
        },
    });
};

export const useUpdateProductsContent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: pageContentApi.updateProductsContent,
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.productsContent, data);
            toast.success('Products content updated successfully!');
        },
        onError: () => {
            toast.error('Failed to update products content');
        },
    });
};

export const useProjectsContent = () => {
    const setProjectsContent = useCMSStore((state) => state.setProjectsContent);

    return useQuery({
        queryKey: queryKeys.projectsContent,
        queryFn: pageContentApi.getProjectsContent,
        select: (data) => {
            setProjectsContent(data);
            return data;
        },
    });
};

export const useUpdateProjectsContent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: pageContentApi.updateProjectsContent,
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.projectsContent, data);
            toast.success('Projects content updated successfully!');
        },
        onError: () => {
            toast.error('Failed to update projects content');
        },
    });
};

export const useInvestmentContent = () => {
    const setInvestmentContent = useCMSStore(
        (state) => state.setInvestmentContent,
    );

    return useQuery({
        queryKey: queryKeys.investmentContent,
        queryFn: pageContentApi.getInvestmentContent,
        select: (data) => {
            setInvestmentContent(data);
            return data;
        },
    });
};

export const useUpdateInvestmentContent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: pageContentApi.updateInvestmentContent,
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.investmentContent, data);
            toast.success('Investment content updated successfully!');
        },
        onError: () => {
            toast.error('Failed to update investment content');
        },
    });
};

export const useLandWantedContent = () => {
    const setLandWantedContent = useCMSStore(
        (state) => state.setLandWantedContent,
    );

    return useQuery({
        queryKey: queryKeys.landWantedContent,
        queryFn: pageContentApi.getLandWantedContent,
        select: (data) => {
            setLandWantedContent(data);
            return data;
        },
    });
};

export const useUpdateLandWantedContent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: pageContentApi.updateLandWantedContent,
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.landWantedContent, data);
            toast.success('Land wanted content updated successfully!');
        },
        onError: () => {
            toast.error('Failed to update land wanted content');
        },
    });
};

export const useMediaContent = () => {
    const setMediaContent = useCMSStore((state) => state.setMediaContent);

    return useQuery({
        queryKey: queryKeys.mediaContent,
        queryFn: pageContentApi.getMediaContent,
        select: (data) => {
            setMediaContent(data);
            return data;
        },
    });
};

export const useUpdateMediaContent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: pageContentApi.updateMediaContent,
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.mediaContent, data);
            toast.success('Media content updated successfully!');
        },
        onError: () => {
            toast.error('Failed to update media content');
        },
    });
};

export const useCareerContent = () => {
    const setCareerContent = useCMSStore((state) => state.setCareerContent);

    return useQuery({
        queryKey: queryKeys.careerContent,
        queryFn: pageContentApi.getCareerContent,
        select: (data) => {
            setCareerContent(data);
            return data;
        },
    });
};

export const useUpdateCareerContent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: pageContentApi.updateCareerContent,
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.careerContent, data);
            toast.success('Career content updated successfully!');
        },
        onError: () => {
            toast.error('Failed to update career content');
        },
    });
};

export const useContactContent = () => {
    const setContactContent = useCMSStore((state) => state.setContactContent);

    return useQuery({
        queryKey: queryKeys.contactContent,
        queryFn: pageContentApi.getContactContent,
        select: (data) => {
            setContactContent(data);
            return data;
        },
    });
};

export const useUpdateContactContent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: pageContentApi.updateContactContent,
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.contactContent, data);
            toast.success('Contact content updated successfully!');
        },
        onError: () => {
            toast.error('Failed to update contact content');
        },
    });
};

export const useBusinessContent = () => {
    const setBusinessContent = useCMSStore((state) => state.setBusinessContent);

    return useQuery({
        queryKey: queryKeys.businessContent,
        queryFn: pageContentApi.getBusinessContent,
        select: (data) => {
            setBusinessContent(data);
            return data;
        },
    });
};

export const useUpdateBusinessContent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: pageContentApi.updateBusinessContent,
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.businessContent, data);
            toast.success('Business content updated successfully!');
        },
        onError: () => {
            toast.error('Failed to update business content');
        },
    });
};

// ================================
// PROJECTS HOOKS
// ================================

export const useProjects = () => {
    const setProjects = useCMSStore((state) => state.setProjects);

    return useQuery({
        queryKey: queryKeys.projects,
        queryFn: projectsApi.getAll,
        select: (data) => {
            setProjects(data);
            return data;
        },
    });
};

export const useProject = (id: string) => {
    return useQuery({
        queryKey: queryKeys.project(id),
        queryFn: () => projectsApi.getById(id),
        enabled: !!id,
    });
};

export const useProjectsByStatus = (
    status: 'ongoing' | 'completed' | 'upcoming',
) => {
    return useQuery({
        queryKey: queryKeys.projectsByStatus(status),
        queryFn: () => projectsApi.getByStatus(status),
    });
};

export const useCreateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: projectsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.projects });
            toast.success('Project created successfully!');
        },
        onError: () => {
            toast.error('Failed to create project');
        },
    });
};

export const useUpdateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
            projectsApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.projects });
            queryClient.invalidateQueries({ queryKey: queryKeys.project(id) });
            toast.success('Project updated successfully!');
        },
        onError: () => {
            toast.error('Failed to update project');
        },
    });
};

export const useDeleteProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: projectsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.projects });
            toast.success('Project deleted successfully!');
        },
        onError: () => {
            toast.error('Failed to delete project');
        },
    });
};

// ================================
// SERVICES HOOKS
// ================================

export const useServices = () => {
    const setServices = useCMSStore((state) => state.setServices);

    return useQuery({
        queryKey: queryKeys.services,
        queryFn: servicesApi.getAll,
        select: (data) => {
            setServices(data);
            return data;
        },
    });
};

export const useCreateService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: servicesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.services });
            toast.success('Service created successfully!');
        },
        onError: () => {
            toast.error('Failed to create service');
        },
    });
};

export const useUpdateService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Service> }) =>
            servicesApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.services });
            toast.success('Service updated successfully!');
        },
        onError: () => {
            toast.error('Failed to update service');
        },
    });
};

export const useDeleteService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: servicesApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.services });
            toast.success('Service deleted successfully!');
        },
        onError: () => {
            toast.error('Failed to delete service');
        },
    });
};

// ================================
// TESTIMONIALS HOOKS
// ================================

export const useTestimonials = () => {
    const setTestimonials = useCMSStore((state) => state.setTestimonials);

    return useQuery({
        queryKey: queryKeys.testimonials,
        queryFn: testimonialsApi.getAll,
        select: (data) => {
            setTestimonials(data);
            return data;
        },
    });
};

export const useCreateTestimonial = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: testimonialsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.testimonials });
            toast.success('Testimonial created successfully!');
        },
        onError: () => {
            toast.error('Failed to create testimonial');
        },
    });
};

export const useUpdateTestimonial = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: Partial<Testimonial>;
        }) => testimonialsApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.testimonials });
            toast.success('Testimonial updated successfully!');
        },
        onError: () => {
            toast.error('Failed to update testimonial');
        },
    });
};

export const useDeleteTestimonial = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: testimonialsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.testimonials });
            toast.success('Testimonial deleted successfully!');
        },
        onError: () => {
            toast.error('Failed to delete testimonial');
        },
    });
};

// ================================
// NEWS ARTICLES HOOKS
// ================================

export const useNewsArticles = () => {
    const setNewsArticles = useCMSStore((state) => state.setNewsArticles);

    return useQuery({
        queryKey: queryKeys.newsArticles,
        queryFn: newsApi.getAll,
        select: (data) => {
            setNewsArticles(data);
            return data;
        },
    });
};

export const useNewsArticle = (slug: string) => {
    return useQuery({
        queryKey: queryKeys.newsArticle(slug),
        queryFn: () => newsApi.getBySlug(slug),
        enabled: !!slug,
    });
};

export const useCreateNewsArticle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: newsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.newsArticles,
            });
            toast.success('Article created successfully!');
        },
        onError: () => {
            toast.error('Failed to create article');
        },
    });
};

export const useUpdateNewsArticle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: Partial<NewsArticle>;
        }) => newsApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.newsArticles,
            });
            toast.success('Article updated successfully!');
        },
        onError: () => {
            toast.error('Failed to update article');
        },
    });
};

export const useDeleteNewsArticle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: newsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.newsArticles,
            });
            toast.success('Article deleted successfully!');
        },
        onError: () => {
            toast.error('Failed to delete article');
        },
    });
};

// ================================
// CONTACT INQUIRIES HOOKS
// ================================

export const useContactInquiries = () => {
    const setContactInquiries = useCMSStore(
        (state) => state.setContactInquiries,
    );

    return useQuery({
        queryKey: queryKeys.contactInquiries,
        queryFn: contactInquiriesApi.getAll,
        select: (data) => {
            setContactInquiries(data);
            return data;
        },
    });
};

export const useCreateContactInquiry = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: contactInquiriesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.contactInquiries,
            });
            toast.success('Inquiry submitted successfully!');
        },
        onError: () => {
            toast.error('Failed to submit inquiry');
        },
    });
};

export const useUpdateInquiryStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            status,
        }: {
            id: string;
            status: ContactInquiry['status'];
        }) => contactInquiriesApi.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.contactInquiries,
            });
            toast.success('Inquiry status updated!');
        },
        onError: () => {
            toast.error('Failed to update inquiry status');
        },
    });
};

export const useDeleteContactInquiry = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: contactInquiriesApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.contactInquiries,
            });
            toast.success('Inquiry deleted successfully!');
        },
        onError: () => {
            toast.error('Failed to delete inquiry');
        },
    });
};

// ================================
// CAREER APPLICATIONS HOOKS
// ================================

export const useCareerApplications = () => {
    const setCareerApplications = useCMSStore(
        (state) => state.setCareerApplications,
    );

    return useQuery({
        queryKey: queryKeys.careerApplications,
        queryFn: careerApplicationsApi.getAll,
        select: (data) => {
            setCareerApplications(data);
            return data;
        },
    });
};

export const useCreateCareerApplication = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: careerApplicationsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.careerApplications,
            });
            toast.success('Application submitted successfully!');
        },
        onError: () => {
            toast.error('Failed to submit application');
        },
    });
};

export const useUpdateApplicationStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            status,
        }: {
            id: string;
            status: CareerApplication['status'];
        }) => careerApplicationsApi.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.careerApplications,
            });
            toast.success('Application status updated!');
        },
        onError: () => {
            toast.error('Failed to update application status');
        },
    });
};

export const useDeleteCareerApplication = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: careerApplicationsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.careerApplications,
            });
            toast.success('Application deleted successfully!');
        },
        onError: () => {
            toast.error('Failed to delete application');
        },
    });
};

// ================================
// SITE SETTINGS HOOKS
// ================================

export const useSiteSettings = () => {
    const setSiteSettings = useCMSStore((state) => state.setSiteSettings);

    return useQuery({
        queryKey: queryKeys.siteSettings,
        queryFn: siteSettingsApi.get,
        select: (data) => {
            setSiteSettings(data);
            return data;
        },
    });
};

export const useUpdateSiteSettings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: siteSettingsApi.update,
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.siteSettings, data);
            toast.success('Settings updated successfully!');
        },
        onError: () => {
            toast.error('Failed to update settings');
        },
    });
};
