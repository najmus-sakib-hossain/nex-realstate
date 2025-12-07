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
import { useContactContent, useUpdateContactContent } from '@/hooks/use-cms';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const contactPageSchema = z.object({
    heroSection: z.object({
        title: z.string().min(1, 'Title is required'),
        subtitle: z.string().min(1, 'Subtitle is required'),
        backgroundImage: z.object({
            id: z.string(),
            url: z.string().url('Must be a valid URL'),
            alt: z.string().min(1, 'Alt text is required'),
        }),
    }),
    offices: z.array(z.object({
        id: z.string(),
        createdAt: z.string(),
        updatedAt: z.string(),
        title: z.string().min(1, 'Title is required'),
        type: z.enum(['hq', 'corporate', 'branch']),
        address: z.string().min(1, 'Address is required'),
        phone: z.array(z.string()),
        email: z.string().email('Must be a valid email'),
    })),
    socialLinks: z.object({
        facebook: z.string().optional(),
        youtube: z.string().optional(),
        linkedin: z.string().optional(),
        instagram: z.string().optional(),
        twitter: z.string().optional(),
    }),
    workingHours: z.object({
        weekdays: z.string().min(1, 'Weekday hours are required'),
        weekends: z.string().min(1, 'Weekend hours are required'),
    }),
});

type ContactPageFormData = z.infer<typeof contactPageSchema>;

export default function AdminContactPageEditor() {
    const { contactContent, setContactContent, addActivity } = useCMSStore();

    const { data: serverContent } = useContactContent();
    const updateMutation = useUpdateContactContent();

    const form = useForm<ContactPageFormData>({
        resolver: zodResolver(contactPageSchema),
        defaultValues: serverContent || contactContent || undefined,
    });

    useEffect(() => {
        const content = serverContent || contactContent;
        if (content) {
            form.reset(content as ContactPageFormData);
        }
    }, [serverContent, contactContent, form]);

    const {
        fields: officeFields,
        append: appendOffice,
        remove: removeOffice,
    } = useFieldArray({
        control: form.control,
        name: 'offices',
    });

    const onSubmit = async (data: ContactPageFormData) => {
        try {
            const updated = await updateMutation.mutateAsync(data as any);
            setContactContent(updated);
            addActivity({
                type: 'update',
                entity: 'page',
                entityId: 'contact',
                entityName: 'Contact Page',
                description: 'Updated contact page content',
            });
            toast.success('Contact page content saved successfully!', {
                description: 'Changes are now live on the frontend.',
            });
        } catch {
            toast.error('Failed to save changes');
        }
    };

    return (
        <AdminLayout title="Edit Contact Page">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Contact Page Content</h2>
                            <p className="text-muted-foreground">
                                Edit the contact page and office information
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
                            <CardDescription>The banner displayed at the top of the contact page</CardDescription>
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
                                                <Input placeholder="Contact Us" {...field} />
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
                                                <Input placeholder="Get in touch..." {...field} />
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

                    {/* Offices */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Office Locations ({officeFields.length})</CardTitle>
                                    <CardDescription>Manage your office locations</CardDescription>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        appendOffice({
                                            id: `office-${Date.now()}`,
                                            createdAt: new Date().toISOString(),
                                            updatedAt: new Date().toISOString(),
                                            title: '',
                                            type: 'branch',
                                            address: '',
                                            phone: [''],
                                            email: '',
                                        })
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Office
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {officeFields.map((field, index) => (
                                <div key={field.id} className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name={`offices.${index}.title`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Office Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Head Office" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`offices.${index}.type`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Type</FormLabel>
                                                <FormControl>
                                                    <select
                                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                                        {...field}
                                                    >
                                                        <option value="hq">Headquarters</option>
                                                        <option value="corporate">Corporate</option>
                                                        <option value="branch">Branch</option>
                                                    </select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="md:col-span-2">
                                        <FormField
                                            control={form.control}
                                            name={`offices.${index}.address`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Address</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="Full address" rows={2} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name={`offices.${index}.email`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="office@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`offices.${index}.phone.0`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="+880 1XXX-XXXXXX" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {officeFields.length > 1 && (
                                        <div className="md:col-span-2">
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removeOffice(index)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Remove Office
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Social Links */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Social Media Links</CardTitle>
                            <CardDescription>Your social media profiles</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="socialLinks.facebook"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Facebook</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://facebook.com/..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="socialLinks.youtube"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>YouTube</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://youtube.com/..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="socialLinks.linkedin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>LinkedIn</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://linkedin.com/..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="socialLinks.instagram"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Instagram</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://instagram.com/..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Working Hours */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Working Hours</CardTitle>
                            <CardDescription>Office working hours</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="workingHours.weekdays"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Weekdays</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Saturday - Thursday: 10:00 AM - 6:00 PM" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="workingHours.weekends"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Weekends</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Friday: Closed" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
