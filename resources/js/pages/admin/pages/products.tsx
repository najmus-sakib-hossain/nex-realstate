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
import { useProductsContent, useUpdateProductsContent } from '@/hooks/use-cms';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const productsPageSchema = z.object({
    heroSection: z.object({
        title: z.string().min(1, 'Title is required'),
        subtitle: z.string().min(1, 'Subtitle is required'),
        backgroundImage: z.object({
            id: z.string(),
            url: z.string().url('Must be a valid URL'),
            alt: z.string().min(1, 'Alt text is required'),
        }),
    }),
    categories: z.array(z.object({
        id: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
        title: z.string().min(1, 'Title is required'),
        slug: z.string().min(1, 'Slug is required'),
        description: z.string().min(1, 'Description is required'),
        icon: z.string().min(1, 'Icon is required'),
        image: z.object({
            id: z.string(),
            url: z.string().url('Must be a valid URL'),
            alt: z.string().min(1, 'Alt text is required'),
        }),
        order: z.number(),
    })),
});

type ProductsPageFormData = z.infer<typeof productsPageSchema>;

export default function AdminProductsPageEditor() {
    const { productsContent, setProductsContent, addActivity } = useCMSStore();

    const { data: serverContent } = useProductsContent();
    const updateMutation = useUpdateProductsContent();

    const form = useForm<ProductsPageFormData>({
        resolver: zodResolver(productsPageSchema),
        defaultValues: serverContent || productsContent || undefined,
    });

    useEffect(() => {
        const content = serverContent || productsContent;
        if (content) {
            form.reset(content as ProductsPageFormData);
        }
    }, [serverContent, productsContent, form]);

    const {
        fields: categoryFields,
        append: appendCategory,
        remove: removeCategory,
    } = useFieldArray({
        control: form.control,
        name: 'categories',
    });

    const onSubmit = async (data: ProductsPageFormData) => {
        try {
            const updated = await updateMutation.mutateAsync(data as any);
            setProductsContent(updated);
            addActivity({
                type: 'update',
                entity: 'page',
                entityId: 'products',
                entityName: 'Products Page',
                description: 'Updated products page content',
            });
            toast.success('Products page content saved successfully!', {
                description: 'Changes are now live on the frontend.',
            });
        } catch {
            toast.error('Failed to save changes');
        }
    };

    return (
        <AdminLayout title="Edit Products Page">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Products Page Content</h2>
                            <p className="text-muted-foreground">
                                Edit the products page and manage product categories
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
                            <CardDescription>The banner displayed at the top of the products page</CardDescription>
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
                                                <Input placeholder="Our Products" {...field} />
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
                                                <Input placeholder="Diverse property types..." {...field} />
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

                    {/* Product Categories */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Product Categories ({categoryFields.length})</CardTitle>
                                    <CardDescription>Manage your product categories</CardDescription>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        appendCategory({
                                            id: `cat-${Date.now()}`,
                                            createdAt: new Date().toISOString(),
                                            updatedAt: new Date().toISOString(),
                                            title: '',
                                            slug: '',
                                            description: '',
                                            icon: 'Building',
                                            image: { id: `cat-img-${Date.now()}`, url: '', alt: '' },
                                            order: categoryFields.length + 1,
                                        })
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Category
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {categoryFields.map((field, index) => (
                                <div key={field.id} className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name={`categories.${index}.title`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Residential" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`categories.${index}.slug`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Slug</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="residential" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`categories.${index}.icon`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Icon</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Home, Building, etc." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`categories.${index}.image.url`}
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
                                    <div className="md:col-span-2">
                                        <FormField
                                            control={form.control}
                                            name={`categories.${index}.description`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="Category description" rows={2} {...field} />
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
                                            onClick={() => removeCategory(index)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Remove
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
