import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { ImageUpload } from '@/components/ui/image-upload';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AdminLayout } from '@/layouts/admin-layout';
import { useCMSStore } from '@/stores/cms-store';
import {
    useServicesContent,
    useUpdateServicesContent,
    useServices,
    useDeleteService,
} from '@/hooks/use-cms';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const servicesPageSchema = z.object({
    heroSection: z.object({
        title: z.string().min(1, 'Title is required'),
        subtitle: z.string().min(1, 'Subtitle is required'),
        backgroundImage: z.object({
            id: z.string(),
            url: z.string().url('Must be a valid URL'),
            alt: z.string().min(1, 'Alt text is required'),
        }),
    }),
});

type ServicesPageFormData = z.infer<typeof servicesPageSchema>;

export default function AdminServicesPageEditor() {
    const { servicesContent, services, setServicesContent, setServices, addActivity } = useCMSStore();

    const { data: serverContent } = useServicesContent();
    const updateMutation = useUpdateServicesContent();
    const { data: serverServices } = useServices();
    const deleteServiceMutation = useDeleteService();

    const form = useForm<ServicesPageFormData>({
        resolver: zodResolver(servicesPageSchema),
        defaultValues: serverContent || (servicesContent ? { heroSection: servicesContent.heroSection } : undefined),
    });

    useEffect(() => {
        const content = serverContent || (servicesContent ? { heroSection: servicesContent.heroSection } : null);
        if (content) {
            form.reset(content as ServicesPageFormData);
        }

        if (serverServices && serverServices.length) {
            setServices(serverServices);
        }
    }, [serverContent, servicesContent, serverServices, form, setServices]);

    const onSubmit = async (data: ServicesPageFormData) => {
        try {
            const updated = await updateMutation.mutateAsync({ heroSection: data.heroSection });
            setServicesContent(updated);
            addActivity({
                type: 'update',
                entity: 'page',
                entityId: 'services',
                entityName: 'Services Page',
                description: 'Updated services page content',
            });
            toast.success('Services page content saved successfully!', {
                description: 'Changes are now live on the frontend.',
            });
        } catch {
            toast.error('Failed to save changes');
        }
    };

    const handleDeleteService = async (id: string) => {
        try {
            await deleteServiceMutation.mutateAsync(id);
            // optimistic UI update
            setServices(services.filter((s) => s.id !== id));
            addActivity({
                type: 'delete',
                entity: 'service',
                entityId: id,
                entityName: id,
                description: `Deleted service: ${id}`,
            });
            toast.success('Service deleted successfully!');
        } catch {
            toast.error('Failed to delete service');
        }
    };

    return (
        <AdminLayout title="Edit Services Page">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Services Page Content</h2>
                            <p className="text-muted-foreground">
                                Edit the services page hero section and manage services
                            </p>
                        </div>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            <Save className="mr-2 h-4 w-4" />
                            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>

                    {/* Hero Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Hero Section</CardTitle>
                            <CardDescription>The banner displayed at the top of the services page</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="heroSection.title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Our Services" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="heroSection.subtitle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Subtitle</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Comprehensive solutions..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <FormLabel>Background Image</FormLabel>
                                <ImageUpload
                                    value={form.watch('heroSection.backgroundImage.url')}
                                    onChange={(url) => form.setValue('heroSection.backgroundImage.url', url)}
                                    onAltChange={(alt) => form.setValue('heroSection.backgroundImage.alt', alt)}
                                    alt={form.watch('heroSection.backgroundImage.alt')}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Services List */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Services ({services.length})</CardTitle>
                                    <CardDescription>Manage your services</CardDescription>
                                </div>
                                <Button type="button" variant="outline" size="sm" asChild>
                                    <a href="/admin/services/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Service
                                    </a>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {services.map((service) => (
                                    <div
                                        key={service.id}
                                        className="flex items-center justify-between rounded-lg border p-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={service.image.url}
                                                alt={service.title}
                                                className="h-16 w-16 rounded-md object-cover"
                                            />
                                            <div>
                                                <h4 className="font-semibold">{service.title}</h4>
                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                    {service.shortDescription}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button type="button" variant="outline" size="sm" asChild>
                                                <a href={`/admin/services/${service.id}/edit`}>Edit</a>
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDeleteService(service.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {services.length === 0 && (
                                    <p className="text-center text-muted-foreground py-8">
                                        No services yet. Click "Add Service" to create one.
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
                            <Save className="mr-2 h-4 w-4" />
                            {form.formState.isSubmitting ? 'Saving...' : 'Save All Changes'}
                        </Button>
                    </div>
                </form>
            </Form>
        </AdminLayout>
    );
}
