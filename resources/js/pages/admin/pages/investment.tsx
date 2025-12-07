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
import { useInvestmentContent, useUpdateInvestmentContent } from '@/hooks/use-cms';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const investmentPageSchema = z.object({
    heroSection: z.object({
        title: z.string().min(1, 'Title is required'),
        subtitle: z.string().min(1, 'Subtitle is required'),
        backgroundImage: z.object({
            id: z.string(),
            url: z.string().url('Must be a valid URL'),
            alt: z.string().min(1, 'Alt text is required'),
        }),
    }),
    whyInvest: z.object({
        title: z.string().min(1, 'Title is required'),
        content: z.string().min(1, 'Content is required'),
        points: z.array(z.object({
            title: z.string().min(1, 'Title is required'),
            description: z.string().min(1, 'Description is required'),
            icon: z.string().min(1, 'Icon is required'),
        })),
    }),
    roiProjections: z.array(z.object({
        id: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
        title: z.string().min(1, 'Title is required'),
        percentage: z.string().min(1, 'Percentage is required'),
        description: z.string().min(1, 'Description is required'),
        timeframe: z.string().min(1, 'Timeframe is required'),
    })),
    landOwnerPartnership: z.object({
        title: z.string().min(1, 'Title is required'),
        content: z.string().min(1, 'Content is required'),
        benefits: z.array(z.string()),
        image: z.object({
            id: z.string(),
            url: z.string().url('Must be a valid URL'),
            alt: z.string().min(1, 'Alt text is required'),
        }),
    }),
    jointVenture: z.object({
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

type InvestmentPageFormData = z.infer<typeof investmentPageSchema>;

export default function AdminInvestmentPageEditor() {
    const { investmentContent, setInvestmentContent, addActivity } = useCMSStore();

    const { data: serverContent } = useInvestmentContent();
    const updateMutation = useUpdateInvestmentContent();

    const form = useForm<InvestmentPageFormData>({
        resolver: zodResolver(investmentPageSchema),
        defaultValues: serverContent || investmentContent || undefined,
    });

    useEffect(() => {
        const content = serverContent || investmentContent;
        if (content) {
            form.reset(content as InvestmentPageFormData);
        }
    }, [serverContent, investmentContent, form]);

    const {
        fields: pointFields,
        append: appendPoint,
        remove: removePoint,
    } = useFieldArray({
        control: form.control,
        name: 'whyInvest.points',
    });

    const {
        fields: roiFields,
        append: appendRoi,
        remove: removeRoi,
    } = useFieldArray({
        control: form.control,
        name: 'roiProjections',
    });

    const {
        fields: landBenefitFields,
        append: appendLandBenefit,
        remove: removeLandBenefit,
    } = useFieldArray({
        control: form.control,
        name: 'landOwnerPartnership.benefits' as never,
    });

    const {
        fields: jvBenefitFields,
        append: appendJvBenefit,
        remove: removeJvBenefit,
    } = useFieldArray({
        control: form.control,
        name: 'jointVenture.benefits' as never,
    });

    const onSubmit = async (data: InvestmentPageFormData) => {
        try {
            const updated = await updateMutation.mutateAsync(data as any);
            setInvestmentContent(updated);
            addActivity({
                type: 'update',
                entity: 'page',
                entityId: 'investment',
                entityName: 'Investment Page',
                description: 'Updated investment page content',
            });
            toast.success('Investment page content saved successfully!', {
                description: 'Changes are now live on the frontend.',
            });
        } catch {
            toast.error('Failed to save changes');
        }
    };

    return (
        <AdminLayout title="Edit Investment Page">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Investment Page Content</h2>
                            <p className="text-muted-foreground">
                                Edit the investment opportunities page
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
                            <CardDescription>The banner displayed at the top of the investment page</CardDescription>
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
                                                <Input placeholder="Investment Opportunities" {...field} />
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
                                                <Input placeholder="Grow your wealth..." {...field} />
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

                    {/* Why Invest */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Why Invest With Us</CardTitle>
                            <CardDescription>Key investment points</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="whyInvest.title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Section Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Why Invest with Nex" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="whyInvest.content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Section Content</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Why invest description" rows={3} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium">Investment Points</h4>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            appendPoint({
                                                title: '',
                                                description: '',
                                                icon: 'TrendingUp',
                                            })
                                        }
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Point
                                    </Button>
                                </div>
                                {pointFields.map((field, index) => (
                                    <div key={field.id} className="grid gap-4 rounded-lg border p-4 md:grid-cols-3">
                                        <FormField
                                            control={form.control}
                                            name={`whyInvest.points.${index}.title`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Title</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Proven Track Record" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`whyInvest.points.${index}.icon`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Icon</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="TrendingUp" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`whyInvest.points.${index}.description`}
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
                                                onClick={() => removePoint(index)}
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

                    {/* ROI Projections */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>ROI Projections</CardTitle>
                                    <CardDescription>Expected return on investment</CardDescription>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        appendRoi({
                                            id: `roi-${Date.now()}`,
                                            createdAt: new Date().toISOString(),
                                            updatedAt: new Date().toISOString(),
                                            title: '',
                                            percentage: '',
                                            description: '',
                                            timeframe: '',
                                        })
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add ROI
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {roiFields.map((field, index) => (
                                <div key={field.id} className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name={`roiProjections.${index}.title`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Residential Projects" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`roiProjections.${index}.percentage`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Percentage</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="15-20%" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`roiProjections.${index}.timeframe`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Timeframe</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="3-5 Years" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`roiProjections.${index}.description`}
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
                                    <div className="md:col-span-2">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => removeRoi(index)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Landowner Partnership */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Landowner Partnership</CardTitle>
                            <CardDescription>Partnership program details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="landOwnerPartnership.title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Landowner Partnership" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="landOwnerPartnership.image.url"
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
                                name="landOwnerPartnership.content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Partnership content" rows={4} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <FormLabel>Benefits</FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => appendLandBenefit('' as never)}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Benefit
                                    </Button>
                                </div>
                                {landBenefitFields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2">
                                        <FormField
                                            control={form.control}
                                            name={`landOwnerPartnership.benefits.${index}`}
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
                                            onClick={() => removeLandBenefit(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Joint Venture */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Joint Venture</CardTitle>
                            <CardDescription>Joint venture program details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="jointVenture.title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Joint Venture Opportunities" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="jointVenture.image.url"
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
                                name="jointVenture.content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Joint venture content" rows={4} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <FormLabel>Benefits</FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => appendJvBenefit('' as never)}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Benefit
                                    </Button>
                                </div>
                                {jvBenefitFields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2">
                                        <FormField
                                            control={form.control}
                                            name={`jointVenture.benefits.${index}`}
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
                                            onClick={() => removeJvBenefit(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
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
