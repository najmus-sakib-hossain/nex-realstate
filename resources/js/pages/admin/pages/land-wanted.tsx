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
import { useLandWantedContent, useUpdateLandWantedContent } from '@/hooks/use-cms';
import type { LandWantedPageContent } from '@/types/cms';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const landWantedPageSchema = z.object({
    heroSection: z.object({
        title: z.string().min(1, 'Title is required'),
        subtitle: z.string().min(1, 'Subtitle is required'),
        backgroundImage: z.object({
            id: z.string(),
            url: z.string().url('Must be a valid URL'),
            alt: z.string(),
        }),
    }),
    benefits: z.array(z.object({
        icon: z.string().min(1, 'Icon is required'),
        title: z.string().min(1, 'Title is required'),
        description: z.string().min(1, 'Description is required'),
    })),
    requirements: z.object({
        title: z.string().min(1, 'Title is required'),
        description: z.string().min(1, 'Description is required'),
        items: z.array(z.object({
            id: z.string(),
            title: z.string().min(1, 'Title is required'),
            description: z.string().min(1, 'Description is required'),
        })),
    }),
    preferredLocations: z.array(z.string()),
    landTypes: z.array(z.string()),
    ctaSection: z.object({
        title: z.string().min(1, 'Title is required'),
        content: z.string().min(1, 'Content is required'),
        buttonText: z.string().min(1, 'Button text is required'),
        buttonLink: z.string().min(1, 'Button link is required'),
    }),
});

type LandWantedPageFormData = z.infer<typeof landWantedPageSchema>;

export default function AdminLandWantedPageEditor() {
    const { landWantedContent, setLandWantedContent, addActivity } = useCMSStore();

    const { data: serverContent } = useLandWantedContent();
    const updateMutation = useUpdateLandWantedContent();

    const form = useForm<LandWantedPageFormData>({
        resolver: zodResolver(landWantedPageSchema),
        defaultValues: serverContent || landWantedContent || undefined,
    });

    useEffect(() => {
        const content = serverContent || landWantedContent;
        if (content) {
            form.reset(content as LandWantedPageFormData);
        }
    }, [serverContent, landWantedContent, form]);

    const {
        fields: benefitFields,
        append: appendBenefit,
        remove: removeBenefit,
    } = useFieldArray({
        control: form.control,
        name: 'benefits',
    });

    const {
        fields: requirementItemFields,
        append: appendRequirementItem,
        remove: removeRequirementItem,
    } = useFieldArray({
        control: form.control,
        name: 'requirements.items',
    });

    const {
        fields: locationFields,
        append: appendLocation,
        remove: removeLocation,
    } = useFieldArray({
        control: form.control,
        name: 'preferredLocations' as any,
    });

    const {
        fields: landTypeFields,
        append: appendLandType,
        remove: removeLandType,
    } = useFieldArray({
        control: form.control,
        name: 'landTypes' as any,
    });

    const onSubmit = async (data: LandWantedPageFormData) => {
        try {
            const updated = await updateMutation.mutateAsync(data as any);
            setLandWantedContent(updated);
            addActivity({
                type: 'update',
                entity: 'page',
                entityId: 'land-wanted',
                entityName: 'Land Wanted Page',
                description: 'Updated land wanted page content',
            });
            toast.success('Land Wanted page content saved successfully!', {
                description: 'Changes are now live on the frontend.',
            });
        } catch {
            toast.error('Failed to save changes');
        }
    };

    return (
        <AdminLayout title="Edit Land Wanted Page">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Land Wanted Page Content</h2>
                            <p className="text-muted-foreground">
                                Edit the land wanted page content
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
                            <CardDescription>The banner displayed at the top of the page</CardDescription>
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
                                                <Input placeholder="Land Wanted" {...field} />
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
                                                <Input placeholder="We are looking for..." {...field} />
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

                    {/* Benefits */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Benefits ({benefitFields.length})</CardTitle>
                                    <CardDescription>Benefits of selling land to us</CardDescription>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        appendBenefit({
                                            icon: 'CheckCircle',
                                            title: '',
                                            description: '',
                                        })
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Benefit
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {benefitFields.map((field, index) => (
                                <div key={field.id} className="grid gap-4 rounded-lg border p-4 md:grid-cols-3">
                                    <FormField
                                        control={form.control}
                                        name={`benefits.${index}.icon`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Icon</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="CheckCircle" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`benefits.${index}.title`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Benefit title" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`benefits.${index}.description`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Benefit description" {...field} />
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
                                            onClick={() => removeBenefit(index)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Requirements */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Requirements Section</CardTitle>
                            <CardDescription>Requirements section with title and items</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="requirements.title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Section Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Land Requirements" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="requirements.description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Section Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Description of requirements" rows={3} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex items-center justify-between pt-4">
                                <h4 className="text-sm font-medium">Requirement Items ({requirementItemFields.length})</h4>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        appendRequirementItem({
                                            id: `req-${Date.now()}`,
                                            title: '',
                                            description: '',
                                        })
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Item
                                </Button>
                            </div>
                            {requirementItemFields.map((field, index) => (
                                <div key={field.id} className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name={`requirements.items.${index}.title`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Requirement title" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`requirements.items.${index}.description`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Requirement description" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="md:col-span-2">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => removeRequirementItem(index)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Preferred Locations & Land Types */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Preferred Locations & Land Types</CardTitle>
                            <CardDescription>Specify preferred locations and types of land</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-medium">Preferred Locations ({locationFields.length})</h4>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => appendLocation('')}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Location
                                    </Button>
                                </div>
                                {locationFields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2 mb-2">
                                        <FormField
                                            control={form.control}
                                            name={`preferredLocations.${index}` as any}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input placeholder="Location name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => removeLocation(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-medium">Land Types ({landTypeFields.length})</h4>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => appendLandType('')}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Land Type
                                    </Button>
                                </div>
                                {landTypeFields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2 mb-2">
                                        <FormField
                                            control={form.control}
                                            name={`landTypes.${index}` as any}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input placeholder="Land type" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => removeLandType(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* CTA Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Call to Action</CardTitle>
                            <CardDescription>The CTA section at the bottom of the page</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="ctaSection.title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Have Land to Sell?" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="ctaSection.buttonText"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Button Text</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Contact Us" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="ctaSection.content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="CTA content" rows={3} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="ctaSection.buttonLink"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Button Link</FormLabel>
                                        <FormControl>
                                            <Input placeholder="/contact" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
