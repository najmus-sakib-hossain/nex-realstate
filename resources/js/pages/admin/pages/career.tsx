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
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { AdminLayout } from '@/layouts/admin-layout';
import { useCMSStore } from '@/stores/cms-store';
import {
    useCareerContent,
    useUpdateCareerContent,
    useCareerApplications,
    useUpdateApplicationStatus,
    useDeleteCareerApplication,
} from '@/hooks/use-cms';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save, Trash2, Eye } from 'lucide-react';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const careerPageSchema = z.object({
    heroSection: z.object({
        title: z.string().min(1, 'Title is required'),
        subtitle: z.string().min(1, 'Subtitle is required'),
        backgroundImage: z.object({
            id: z.string(),
            url: z.string().url('Must be a valid URL'),
            alt: z.string().min(1, 'Alt text is required'),
        }),
    }),
    lifeAtNex: z.object({
        title: z.string().min(1, 'Title is required'),
        content: z.string().min(1, 'Content is required'),
        images: z.array(z.object({
            id: z.string(),
            url: z.string().url('Must be a valid URL'),
            alt: z.string().min(1, 'Alt text is required'),
        })),
        perks: z.array(z.object({
            title: z.string().min(1, 'Title is required'),
            description: z.string().min(1, 'Description is required'),
            icon: z.string().min(1, 'Icon is required'),
        })),
    }),
    internshipProgram: z.object({
        title: z.string().min(1, 'Title is required'),
        content: z.string().min(1, 'Content is required'),
        benefits: z.array(z.string()),
        image: z.object({
            id: z.string(),
            url: z.string().url('Must be a valid URL'),
            alt: z.string().min(1, 'Alt text is required'),
        }),
    }),
});

type CareerPageFormData = z.infer<typeof careerPageSchema>;

export default function AdminCareerPageEditor() {
    const { careerContent, careerApplications, setCareerContent, updateApplicationStatus, deleteApplication, addActivity } = useCMSStore();

    const { data: serverContent } = useCareerContent();
    const updateMutation = useUpdateCareerContent();
    const { data: serverApplications } = useCareerApplications();
    const updateAppMutation = useUpdateApplicationStatus();
    const deleteAppMutation = useDeleteCareerApplication();

    const form = useForm<CareerPageFormData>({
        resolver: zodResolver(careerPageSchema),
        defaultValues: serverContent || (careerContent ? {
            heroSection: careerContent.heroSection,
            lifeAtNex: careerContent.lifeAtNex,
            internshipProgram: careerContent.internshipProgram,
        } : undefined),
    });

    useEffect(() => {
        const content = serverContent || careerContent;
        if (content) {
            form.reset({
                heroSection: content.heroSection,
                lifeAtNex: content.lifeAtNex,
                internshipProgram: content.internshipProgram,
            });
        }
        if (serverApplications && serverApplications.length) {
            // populate store with server-provided applications
            // set via store method if available; updating store directly
            // is handled by the hook's select when fetched elsewhere
        }
    }, [serverContent, careerContent, form, serverApplications]);

    const {
        fields: perkFields,
        append: appendPerk,
        remove: removePerk,
    } = useFieldArray({
        control: form.control,
        name: 'lifeAtNex.perks',
    });

    const {
        fields: benefitFields,
        append: appendBenefit,
        remove: removeBenefit,
    } = useFieldArray({
        control: form.control,
        name: 'internshipProgram.benefits' as never,
    });

    const onSubmit = async (data: CareerPageFormData) => {
        try {
            const updated = await updateMutation.mutateAsync(data as any);
            setCareerContent(updated);
            addActivity({
                type: 'update',
                entity: 'page',
                entityId: 'career',
                entityName: 'Career Page',
                description: 'Updated career page content',
            });
            toast.success('Career page content saved successfully!', {
                description: 'Changes are now live on the frontend.',
            });
        } catch {
            toast.error('Failed to save changes');
        }
    };

    const handleUpdateApplicationStatus = async (
        id: string,
        status: 'pending' | 'shortlisted' | 'reviewed' | 'hired' | 'rejected'
    ) => {
        try {
            await updateAppMutation.mutateAsync({ id, status });
            updateApplicationStatus(id, status);
            const app = careerApplications.find((a) => a.id === id);
            addActivity({
                type: 'status_change',
                entity: 'application',
                entityId: id,
                entityName: app?.name || id,
                description: `Changed application status to ${status}`,
            });
            toast.success(`Application status updated to ${status}`);
        } catch {
            toast.error('Failed to update application status');
        }
    };

    const handleDeleteApplication = async (id: string) => {
        try {
            await deleteAppMutation.mutateAsync(id);
            deleteApplication(id);
            const app = careerApplications.find((a) => a.id === id);
            addActivity({
                type: 'delete',
                entity: 'application',
                entityId: id,
                entityName: app?.name || id,
                description: `Deleted application from ${app?.name || id}`,
            });
            toast.success('Application deleted');
        } catch {
            toast.error('Failed to delete application');
        }
    };

    return (
        <AdminLayout title="Edit Career Page">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Career Page Content</h2>
                            <p className="text-muted-foreground">
                                Edit the career page and manage job applications
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
                            <CardDescription>The banner displayed at the top of the career page</CardDescription>
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
                                                <Input placeholder="Careers at Nex" {...field} />
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
                                                <Input placeholder="Build your future..." {...field} />
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

                    {/* Life at Nex */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Life at Nex</CardTitle>
                            <CardDescription>Showcase your company culture</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="lifeAtNex.title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Section Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Life at Nex" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="lifeAtNex.content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Describe life at your company" rows={4} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Perks */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <FormLabel>Perks & Benefits</FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            appendPerk({
                                                title: '',
                                                description: '',
                                                icon: 'Heart',
                                            })
                                        }
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Perk
                                    </Button>
                                </div>
                                {perkFields.map((field, index) => (
                                    <div key={field.id} className="grid gap-4 rounded-lg border p-4 md:grid-cols-3">
                                        <FormField
                                            control={form.control}
                                            name={`lifeAtNex.perks.${index}.title`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Title</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Health Coverage" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`lifeAtNex.perks.${index}.icon`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Icon</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Heart" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`lifeAtNex.perks.${index}.description`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Description</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Description" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="md:col-span-3">
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removePerk(index)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Internship Program */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Internship Program</CardTitle>
                            <CardDescription>Details about your internship program</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="internshipProgram.title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Internship Program" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="internshipProgram.image.url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Image URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="internshipProgram.content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Describe the internship program" rows={4} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Benefits */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <FormLabel>Benefits</FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => appendBenefit('' as never)}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Benefit
                                    </Button>
                                </div>
                                {benefitFields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2">
                                        <FormField
                                            control={form.control}
                                            name={`internshipProgram.benefits.${index}`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input placeholder="Benefit" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeBenefit(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Job Applications */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Job Applications ({careerApplications.length})</CardTitle>
                            <CardDescription>Manage incoming job applications</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {careerApplications.length === 0 ? (
                                <p className="py-8 text-center text-muted-foreground">No applications yet</p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Position</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {careerApplications.map((app) => (
                                            <TableRow key={app.id}>
                                                <TableCell className="font-medium">{app.name}</TableCell>
                                                <TableCell>{app.jobTitle}</TableCell>
                                                <TableCell>{app.email}</TableCell>
                                                <TableCell>
                                                    <select
                                                        className="rounded-md border border-input bg-background px-2 py-1 text-sm"
                                                        value={app.status}
                                                        onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value as any)}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="shortlisted">Shortlisted</option>
                                                        <option value="reviewed">Reviewed</option>
                                                        <option value="hired">Hired</option>
                                                        <option value="rejected">Rejected</option>
                                                    </select>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {app.resume && (
                                                            <Button variant="outline" size="sm" asChild>
                                                                <a href={app.resume} target="_blank" rel="noopener noreferrer">
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    Resume
                                                                </a>
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDeleteApplication(app.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
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
