import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { ImageUpload } from '@/components/ui/image-upload';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AdminLayout } from '@/layouts/admin-layout';
import { homePageSchema, type HomePageFormData } from '@/lib/validations/cms-schemas';
import { useCMSStore } from '@/stores/cms-store';
import { useHomeContent, useUpdateHomeContent } from '@/hooks/use-cms';
import type { HomePageContent } from '@/types/cms';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function AdminHomePageEditor() {
    const { homeContent, setHomeContent, addActivity } = useCMSStore();
    const fallbackBackground = {
        id: 'hero-bg-default',
        url: 'https://images.unsplash.com/photo-1544829728-e5cb9eedc20e?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        alt: 'Clear blue sky',
    } as const;
    const fallbackForeground = {
        id: 'hero-fg-default',
        url: '/building.png',
        alt: 'Transparent modern building',
    } as const;

    // Load content from server (and populate store) using hook
    const { data: serverContent } = useHomeContent();
    const updateMutation = useUpdateHomeContent();

    const mergeHeroFallbacks = (content: HomePageContent) => ({
        ...content,
        heroBanner: {
            ...content.heroBanner,
            backgroundImage: {
                ...fallbackBackground,
                ...(content.heroBanner.backgroundImage || {}),
            },
            foregroundImage: {
                ...fallbackForeground,
                ...(content.heroBanner.foregroundImage || {}),
            },
        },
    });

    const form = useForm<HomePageFormData>({
        resolver: zodResolver(homePageSchema),
        defaultValues:
            serverContent
                ? mergeHeroFallbacks(serverContent)
                : homeContent
                  ? mergeHeroFallbacks(homeContent)
                  : undefined,
    });

    // Reset form when store or server content changes
    useEffect(() => {
        const content = serverContent || homeContent;
        if (content) {
            form.reset(mergeHeroFallbacks(content));
        }
    }, [serverContent, homeContent, form]);

    const {
        fields: valuePropositionFields,
        append: appendValueProposition,
        remove: removeValueProposition,
    } = useFieldArray({
        control: form.control,
        name: 'valuePropositions',
    });

    const {
        fields: marketingLineFields,
        append: appendMarketingLine,
        remove: removeMarketingLine,
    } = useFieldArray({
        control: form.control,
        name: 'marketingLines' as never,
    });

    const onSubmit = async (data: HomePageFormData) => {
        try {
            // Persist to server
            const updated = await updateMutation.mutateAsync(data as HomePageContent);

            // Update local store so frontend reflects changes immediately
            setHomeContent(updated);

            // Log activity
            addActivity({
                type: 'update',
                entity: 'page',
                entityId: 'home',
                entityName: 'Home Page',
                description: 'Updated home page content',
            });

            toast.success('Home page content saved successfully!', {
                description: 'Changes are now live on the frontend.',
            });
        } catch (err) {
            // mutation hook will already show a toast, but ensure generic fallback
            toast.error('Failed to save changes', {
                description: 'Please try again.',
            });
        }
    };

    return (
        <AdminLayout title="Edit Home Page">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Home Page Content</h2>
                            <p className="text-muted-foreground">
                                Edit the content displayed on the home page
                            </p>
                        </div>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            <Save className="mr-2 h-4 w-4" />
                            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>

                    {/* Hero Banner */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Hero Banner</CardTitle>
                            <CardDescription>
                                The main banner displayed at the top of the home page
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="heroBanner.tagline"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tagline</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter tagline" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="heroBanner.title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="heroBanner.subtitle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subtitle</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter subtitle"
                                                rows={3}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <FormLabel>Sky Background Image</FormLabel>
                                    <ImageUpload
                                        value={form.watch('heroBanner.backgroundImage.url')}
                                        onChange={(url) =>
                                            form.setValue('heroBanner.backgroundImage.url', url)
                                        }
                                        onAltChange={(alt) =>
                                            form.setValue('heroBanner.backgroundImage.alt', alt)
                                        }
                                        alt={form.watch('heroBanner.backgroundImage.alt')}
                                        label=""
                                    />
                                </div>
                                <div className="space-y-2">
                                    <FormLabel>Parallax Foreground Image</FormLabel>
                                    <ImageUpload
                                        value={form.watch('heroBanner.foregroundImage.url')}
                                        onChange={(url) => {
                                            const currentId = form.getValues('heroBanner.foregroundImage.id');
                                            form.setValue('heroBanner.foregroundImage.url', url);
                                            if (!currentId) {
                                                form.setValue(
                                                    'heroBanner.foregroundImage.id',
                                                    `hero-fg-${Date.now()}`,
                                                );
                                            }
                                        }}
                                        onAltChange={(alt) =>
                                            form.setValue('heroBanner.foregroundImage.alt', alt)
                                        }
                                        alt={form.watch('heroBanner.foregroundImage.alt')}
                                        label=""
                                        placeholder="Upload or paste a transparent PNG (e.g., building)"
                                    />
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Tip: use a wide sky photo for the background and a transparent PNG for the
                                foreground to get the smooth parallax effect seen on the frontend hero.
                            </p>

                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="heroBanner.ctaButtons.primary.text"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Primary CTA Text</FormLabel>
                                            <FormControl>
                                                <Input placeholder="View Projects" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="heroBanner.ctaButtons.primary.link"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Primary CTA Link</FormLabel>
                                            <FormControl>
                                                <Input placeholder="/projects" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="heroBanner.ctaButtons.secondary.text"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Secondary CTA Text</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Contact Us" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="heroBanner.ctaButtons.secondary.link"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Secondary CTA Link</FormLabel>
                                            <FormControl>
                                                <Input placeholder="/contact" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Value Propositions */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Value Propositions</CardTitle>
                                    <CardDescription>
                                        The key value points displayed below the hero banner
                                    </CardDescription>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        appendValueProposition({
                                            id: `vp-${Date.now()}`,
                                            icon: 'Star',
                                            title: '',
                                            description: '',
                                        })
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {valuePropositionFields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="grid gap-4 rounded-lg border p-4 md:grid-cols-2"
                                >
                                    <FormField
                                        control={form.control}
                                        name={`valuePropositions.${index}.title`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter title" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`valuePropositions.${index}.icon`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Icon</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Shield, Home, etc." {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Lucide icon name (e.g., Shield, Home, Crown)
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="md:col-span-2">
                                        <FormField
                                            control={form.control}
                                            name={`valuePropositions.${index}.description`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Enter description"
                                                            rows={2}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    {valuePropositionFields.length > 1 && (
                                        <div className="md:col-span-2">
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removeValueProposition(index)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Remove
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* CEO Message */}
                    <Card>
                        <CardHeader>
                            <CardTitle>CEO's Message</CardTitle>
                            <CardDescription>
                                The CEO section displayed on the home page
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="ceoMessage.name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="CEO Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="ceoMessage.title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="CEO & Founder"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="ceoMessage.message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Message</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="CEO's message"
                                                rows={8}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-2">
                                <FormLabel>CEO Photo</FormLabel>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={form.watch('ceoMessage.image.url')}
                                        alt="CEO"
                                        className="h-24 w-24 rounded-md object-cover"
                                    />
                                    <div className="flex-1 space-y-2">
                                        <FormField
                                            control={form.control}
                                            name="ceoMessage.image.url"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input placeholder="Image URL" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="ceoMessage.image.alt"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input placeholder="Alt text" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Marketing Lines */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Marketing Lines</CardTitle>
                                    <CardDescription>
                                        Rotating marketing taglines used across the site
                                    </CardDescription>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => appendMarketingLine('' as never)}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Line
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {marketingLineFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <FormField
                                        control={form.control}
                                        name={`marketingLines.${index}`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter marketing line"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {marketingLineFields.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeMarketingLine(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            size="lg"
                            disabled={form.formState.isSubmitting}
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {form.formState.isSubmitting ? 'Saving...' : 'Save All Changes'}
                        </Button>
                    </div>
                </form>
            </Form>
        </AdminLayout>
    );
}
