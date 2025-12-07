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
import { ImageUpload, ImageUploadField } from '@/components/ui/image-upload';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AdminLayout } from '@/layouts/admin-layout';
import { aboutPageSchema, type AboutPageFormData } from '@/lib/validations/cms-schemas';
import { useCMSStore } from '@/stores/cms-store';
import { useAboutContent, useUpdateAboutContent } from '@/hooks/use-cms';
import type { AboutPageContent } from '@/types/cms';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function AdminAboutPageEditor() {
    const { aboutContent, setAboutContent, addActivity } = useCMSStore();

    const { data: serverContent } = useAboutContent();
    const updateMutation = useUpdateAboutContent();

    const form = useForm<AboutPageFormData>({
        resolver: zodResolver(aboutPageSchema),
        defaultValues: serverContent || aboutContent || undefined,
    });

    useEffect(() => {
        const content = serverContent || aboutContent;
        if (content) {
            form.reset(content);
        }
    }, [serverContent, aboutContent, form]);

    const {
        fields: valueFields,
        append: appendValue,
        remove: removeValue,
    } = useFieldArray({
        control: form.control,
        name: 'values',
    });

    const {
        fields: leaderFields,
        append: appendLeader,
        remove: removeLeader,
    } = useFieldArray({
        control: form.control,
        name: 'leadershipTeam',
    });

    const {
        fields: advisorFields,
        append: appendAdvisor,
        remove: removeAdvisor,
    } = useFieldArray({
        control: form.control,
        name: 'boardOfAdvisors',
    });

    const {
        fields: awardFields,
        append: appendAward,
        remove: removeAward,
    } = useFieldArray({
        control: form.control,
        name: 'awards',
    });

    const onSubmit = async (data: AboutPageFormData) => {
        try {
            const updated = await updateMutation.mutateAsync(data as AboutPageContent);
            setAboutContent(updated);
            addActivity({
                type: 'update',
                entity: 'page',
                entityId: 'about',
                entityName: 'About Page',
                description: 'Updated about page content',
            });
            toast.success('About page content saved successfully!', {
                description: 'Changes are now live on the frontend.',
            });
        } catch {
            toast.error('Failed to save changes');
        }
    };

    return (
        <AdminLayout title="Edit About Page">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">About Page Content</h2>
                            <p className="text-muted-foreground">
                                Edit the content displayed on the about us page
                            </p>
                        </div>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            <Save className="mr-2 h-4 w-4" />
                            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>

                    {/* Our Story */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Our Story</CardTitle>
                            <CardDescription>The company story section</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="ourStory.title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Our Story" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="ourStory.content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Enter story content" rows={6} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="space-y-2">
                                <FormLabel>Story Image</FormLabel>
                                <ImageUpload
                                    value={form.watch('ourStory.image.url')}
                                    onChange={(url) => form.setValue('ourStory.image.url', url)}
                                    onAltChange={(alt) => form.setValue('ourStory.image.alt', alt)}
                                    alt={form.watch('ourStory.image.alt')}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Mission & Vision */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Mission & Vision</CardTitle>
                            <CardDescription>Company mission and vision statements</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="mission.title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mission Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Our Mission" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="mission.content"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mission Content</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Enter mission statement" rows={4} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="vision.title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Vision Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Our Vision" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="vision.content"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Vision Content</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Enter vision statement" rows={4} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Core Values */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Core Values</CardTitle>
                                    <CardDescription>Company core values</CardDescription>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        appendValue({
                                            id: `val-${Date.now()}`,
                                            title: '',
                                            description: '',
                                            icon: 'Star',
                                        })
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Value
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {valueFields.map((field, index) => (
                                <div key={field.id} className="grid gap-4 rounded-lg border p-4 md:grid-cols-3">
                                    <FormField
                                        control={form.control}
                                        name={`values.${index}.title`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Value title" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`values.${index}.icon`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Icon</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Shield, Star, etc." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`values.${index}.description`}
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
                                    {valueFields.length > 1 && (
                                        <div className="md:col-span-3">
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removeValue(index)}
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

                    {/* Leadership Team */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Leadership Team</CardTitle>
                                    <CardDescription>Company leadership members</CardDescription>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        appendLeader({
                                            id: `leader-${Date.now()}`,
                                            createdAt: new Date().toISOString(),
                                            updatedAt: new Date().toISOString(),
                                            name: '',
                                            position: '',
                                            bio: '',
                                            image: { id: `leader-img-${Date.now()}`, url: '', alt: '' },
                                            order: leaderFields.length + 1,
                                            category: 'leadership',
                                        })
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Member
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {leaderFields.map((field, index) => (
                                <div key={field.id} className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name={`leadershipTeam.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Full name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`leadershipTeam.${index}.position`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Position</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="CEO, COO, etc." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="md:col-span-2">
                                        <FormField
                                            control={form.control}
                                            name={`leadershipTeam.${index}.bio`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Bio</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="Short bio" rows={3} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <FormLabel>Image</FormLabel>
                                        <ImageUploadField
                                            value={form.watch(`leadershipTeam.${index}.image.url`)}
                                            onChange={(url) => form.setValue(`leadershipTeam.${index}.image.url`, url)}
                                        />
                                    </div>
                                    <div className="flex items-end gap-2">
                                        {leaderFields.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removeLeader(index)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Board of Advisors */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Board of Advisors</CardTitle>
                                    <CardDescription>Advisory board members</CardDescription>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        appendAdvisor({
                                            id: `advisor-${Date.now()}`,
                                            createdAt: new Date().toISOString(),
                                            updatedAt: new Date().toISOString(),
                                            name: '',
                                            position: '',
                                            bio: '',
                                            image: { id: `advisor-img-${Date.now()}`, url: '', alt: '' },
                                            order: advisorFields.length + 1,
                                            category: 'advisor',
                                        })
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Advisor
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {advisorFields.map((field, index) => (
                                <div key={field.id} className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name={`boardOfAdvisors.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Full name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`boardOfAdvisors.${index}.position`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Position</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Advisory Board Member" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="md:col-span-2">
                                        <FormField
                                            control={form.control}
                                            name={`boardOfAdvisors.${index}.bio`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Bio</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="Short bio" rows={3} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <FormLabel>Image</FormLabel>
                                        <ImageUploadField
                                            value={form.watch(`boardOfAdvisors.${index}.image.url`)}
                                            onChange={(url) => form.setValue(`boardOfAdvisors.${index}.image.url`, url)}
                                        />
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => removeAdvisor(index)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Awards */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Awards & Recognition</CardTitle>
                                    <CardDescription>Company awards and achievements</CardDescription>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        appendAward({
                                            id: `award-${Date.now()}`,
                                            createdAt: new Date().toISOString(),
                                            updatedAt: new Date().toISOString(),
                                            title: '',
                                            year: new Date().getFullYear().toString(),
                                            description: '',
                                        })
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Award
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {awardFields.map((field, index) => (
                                <div key={field.id} className="grid gap-4 rounded-lg border p-4 md:grid-cols-3">
                                    <FormField
                                        control={form.control}
                                        name={`awards.${index}.title`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Award title" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`awards.${index}.year`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Year</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="2024" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`awards.${index}.description`}
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
                                            onClick={() => removeAward(index)}
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
