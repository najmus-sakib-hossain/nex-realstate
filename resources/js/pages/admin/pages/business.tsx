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
import { useBusinessContent, useUpdateBusinessContent } from '@/hooks/use-cms';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const businessPageSchema = z.object({
    heroSection: z.object({
        title: z.string().min(1, 'Title is required'),
        subtitle: z.string().min(1, 'Subtitle is required'),
        backgroundImage: z.object({
            id: z.string(),
            url: z.string().url('Must be a valid URL'),
            alt: z.string().min(1, 'Alt text is required'),
        }),
    }),
    partners: z.array(z.object({
        id: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
        name: z.string().min(1, 'Name is required'),
        slug: z.string().min(1, 'Slug is required'),
        description: z.string().min(1, 'Description is required'),
        logo: z.object({
            id: z.string(),
            url: z.string().min(1, 'Logo URL is required'),
            alt: z.string().min(1, 'Alt text is required'),
        }),
        website: z.string().optional(),
        category: z.string().min(1, 'Category is required'),
        order: z.number(),
    })),
    partnershipTypes: z.array(z.object({
        id: z.string(),
        icon: z.string().min(1, 'Icon is required'),
        title: z.string().min(1, 'Title is required'),
        description: z.string().min(1, 'Description is required'),
        benefits: z.array(z.string()),
    })),
    whyPartner: z.array(z.object({
        icon: z.string().min(1, 'Icon is required'),
        title: z.string().min(1, 'Title is required'),
        description: z.string().min(1, 'Description is required'),
    })),
});

type BusinessPageFormData = z.infer<typeof businessPageSchema>;

export default function AdminBusinessPageEditor() {
    const { businessContent, setBusinessContent, addActivity } = useCMSStore();

    const { data: serverContent } = useBusinessContent();
    const updateMutation = useUpdateBusinessContent();

    const form = useForm<BusinessPageFormData>({
        resolver: zodResolver(businessPageSchema),
        defaultValues: serverContent || businessContent || undefined,
    });

    useEffect(() => {
        const content = serverContent || businessContent;
        if (content) {
            form.reset(content as BusinessPageFormData);
        }
    }, [serverContent, businessContent, form]);

    const {
        fields: partnerFields,
        append: appendPartner,
        remove: removePartner,
    } = useFieldArray({
        control: form.control,
        name: 'partners',
    });

    const {
        fields: partnershipTypeFields,
        append: appendPartnershipType,
        remove: removePartnershipType,
    } = useFieldArray({
        control: form.control,
        name: 'partnershipTypes',
    });

    const {
        fields: whyPartnerFields,
        append: appendWhyPartner,
        remove: removeWhyPartner,
    } = useFieldArray({
        control: form.control,
        name: 'whyPartner',
    });

    const onSubmit = async (data: BusinessPageFormData) => {
        try {
            const updated = await updateMutation.mutateAsync(data as any);
            setBusinessContent(updated);
            addActivity({
                type: 'update',
                entity: 'page',
                entityId: 'business',
                entityName: 'Business Page',
                description: 'Updated business page content',
            });
            toast.success('Business page content saved successfully!', {
                description: 'Changes are now live on the frontend.',
            });
        } catch {
            toast.error('Failed to save changes');
        }
    };

    return (
        <AdminLayout title="Edit Business Page">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Business Page Content</h2>
                            <p className="text-muted-foreground">
                                Edit the business ventures and partners page
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
                            <CardDescription>The banner displayed at the top of the business page</CardDescription>
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
                                                <Input placeholder="Our Business Ventures" {...field} />
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
                                                <Input placeholder="Diverse businesses..." {...field} />
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

                    {/* Partners */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Business Partners ({partnerFields.length})</CardTitle>
                                    <CardDescription>Manage your business partners and ventures</CardDescription>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        appendPartner({
                                            id: `biz-${Date.now()}`,
                                            createdAt: new Date().toISOString(),
                                            updatedAt: new Date().toISOString(),
                                            name: '',
                                            slug: '',
                                            description: '',
                                            logo: { id: `biz-logo-${Date.now()}`, url: '', alt: '' },
                                            category: '',
                                            order: partnerFields.length + 1,
                                        })
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Partner
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {partnerFields.map((field, index) => (
                                <div key={field.id} className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name={`partners.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Partner name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`partners.${index}.slug`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Slug</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="partner-slug" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`partners.${index}.category`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Technology, Design, etc." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`partners.${index}.website`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Website (optional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`partners.${index}.logo.url`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Logo URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`partners.${index}.order`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Order</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="1"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="md:col-span-2">
                                        <FormField
                                            control={form.control}
                                            name={`partners.${index}.description`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="Partner description" rows={2} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => removePartner(index)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Remove Partner
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Partnership Types */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Partnership Types ({partnershipTypeFields.length})</CardTitle>
                                    <CardDescription>Manage the types of partnerships you offer</CardDescription>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        appendPartnershipType({
                                            id: `pt-${Date.now()}`,
                                            icon: 'Briefcase',
                                            title: '',
                                            description: '',
                                            benefits: [''],
                                        })
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Partnership Type
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {partnershipTypeFields.map((field, index) => (
                                <div key={field.id} className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name={`partnershipTypes.${index}.title`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Vendors & Suppliers" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`partnershipTypes.${index}.icon`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Icon (Lucide name)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Briefcase, Building2, Users, TrendingUp" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="md:col-span-2">
                                        <FormField
                                            control={form.control}
                                            name={`partnershipTypes.${index}.description`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="Description of this partnership type" rows={2} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <FormLabel>Benefits (comma-separated)</FormLabel>
                                        <Input
                                            placeholder="Benefit 1, Benefit 2, Benefit 3"
                                            value={form.watch(`partnershipTypes.${index}.benefits`)?.join(', ') || ''}
                                            onChange={(e) => {
                                                const benefits = e.target.value.split(',').map(b => b.trim());
                                                form.setValue(`partnershipTypes.${index}.benefits`, benefits);
                                            }}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => removePartnershipType(index)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Remove Partnership Type
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Why Partner */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Why Partner With Us ({whyPartnerFields.length})</CardTitle>
                                    <CardDescription>Reasons to partner with your company</CardDescription>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        appendWhyPartner({
                                            icon: 'ShieldCheck',
                                            title: '',
                                            description: '',
                                        })
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Reason
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {whyPartnerFields.map((field, index) => (
                                <div key={field.id} className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name={`whyPartner.${index}.title`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Trusted Name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`whyPartner.${index}.icon`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Icon (Lucide name)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="ShieldCheck, Handshake, TrendingUp" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="md:col-span-2">
                                        <FormField
                                            control={form.control}
                                            name={`whyPartner.${index}.description`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="Reason description" rows={2} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => removeWhyPartner(index)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Remove Reason
                                        </Button>
                                    </div>
                                </div>
                            ))}
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
