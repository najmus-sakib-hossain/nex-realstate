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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { AdminLayout } from '@/layouts/admin-layout';
import { footerSettingsSchema } from '@/lib/validations/cms-schemas';
import { useCMSStore } from '@/stores/cms-store';
import type { FooterSettings } from '@/types/cms';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
    ChevronDown,
    ChevronUp,
    Facebook,
    GripVertical,
    Image as ImageIcon,
    Linkedin,
    Loader2,
    Plus,
    Save,
    Trash2,
    Youtube,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

type FooterSettingsFormData = z.infer<typeof footerSettingsSchema>;

export default function AdminFooterPage() {
    const { footerSettings, setFooterSettings } = useCMSStore();
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const form = useForm<FooterSettingsFormData>({
        resolver: zodResolver(footerSettingsSchema),
        defaultValues: footerSettings || undefined,
    });

    const {
        fields: columnFields,
        append: appendColumn,
        remove: removeColumn,
        move: moveColumn,
    } = useFieldArray({
        control: form.control,
        name: 'columns',
    });

    // Load data on mount
    useEffect(() => {
        if (footerSettings) {
            form.reset(footerSettings);
            setLogoPreview(footerSettings.logo.url);
        }
    }, [footerSettings, form]);

    // Handle logo upload
    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setLogoPreview(result);
                form.setValue('logo', {
                    id: `logo-${Date.now()}`,
                    url: result,
                    alt: file.name,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    // Save mutation
    const saveMutation = useMutation({
        mutationFn: async (data: FooterSettingsFormData) => {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return data;
        },
        onSuccess: (data) => {
            setFooterSettings(data);
            toast.success('Footer settings saved successfully!');
        },
        onError: () => {
            toast.error('Failed to save footer settings');
        },
    });

    const onSubmit = (data: FooterSettingsFormData) => {
        saveMutation.mutate(data);
    };

    const addColumn = () => {
        const newOrder = columnFields.length + 1;
        appendColumn({
            id: `footer-col-${Date.now()}`,
            title: 'New Column',
            links: [],
            order: newOrder,
        });
    };

    const addLink = (columnIndex: number) => {
        const currentLinks = form.getValues(`columns.${columnIndex}.links`) || [];
        const newOrder = currentLinks.length + 1;
        const updatedLinks = [
            ...currentLinks,
            {
                id: `footer-link-${Date.now()}-${newOrder}`,
                label: 'New Link',
                href: '/',
                order: newOrder,
            },
        ];
        form.setValue(`columns.${columnIndex}.links`, updatedLinks);
    };

    const removeLink = (columnIndex: number, linkIndex: number) => {
        const currentLinks = form.getValues(`columns.${columnIndex}.links`) || [];
        const updatedLinks = currentLinks.filter((_, i) => i !== linkIndex);
        form.setValue(`columns.${columnIndex}.links`, updatedLinks);
    };

    return (
        <AdminLayout title="Footer Settings">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Footer Settings</h2>
                        <p className="text-muted-foreground">
                            Manage your website footer, links, and contact information
                        </p>
                    </div>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={saveMutation.isPending}
                    >
                        {saveMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <Tabs defaultValue="branding">
                            <TabsList className="grid w-full grid-cols-5">
                                <TabsTrigger value="branding">Logo</TabsTrigger>
                                <TabsTrigger value="columns">Columns</TabsTrigger>
                                <TabsTrigger value="contact">Contact</TabsTrigger>
                                <TabsTrigger value="social">Social</TabsTrigger>
                                <TabsTrigger value="copyright">Copyright</TabsTrigger>
                            </TabsList>

                            {/* Logo Tab */}
                            <TabsContent value="branding" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Logo & Tagline</CardTitle>
                                        <CardDescription>
                                            Configure your footer logo and tagline
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Logo Upload */}
                                        <FormField
                                            control={form.control}
                                            name="logo"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Logo</FormLabel>
                                                    <FormControl>
                                                        <div className="space-y-4">
                                                            {logoPreview && (
                                                                <div className="flex items-center gap-4 rounded-lg border bg-white p-4">
                                                                    <img
                                                                        src={logoPreview}
                                                                        alt="Logo preview"
                                                                        className="h-20 w-auto object-contain"
                                                                    />
                                                                    <div className="flex-1">
                                                                        <p className="text-sm font-medium">
                                                                            Current Logo
                                                                        </p>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            {field.value?.alt ||
                                                                                'Logo image'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center gap-4">
                                                                <Input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={handleLogoChange}
                                                                    className="flex-1"
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="icon"
                                                                >
                                                                    <ImageIcon className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </FormControl>
                                                    <FormDescription>
                                                        Upload your footer logo (recommended: PNG
                                                        with transparent background)
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Separator />

                                        {/* Tagline */}
                                        <FormField
                                            control={form.control}
                                            name="tagline"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Tagline</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            rows={3}
                                                            placeholder="Where Quality meets Comfort..."
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        A brief tagline or description for your
                                                        company
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Preview */}
                                        <div className="rounded-lg border bg-white p-4">
                                            <p className="mb-2 text-sm font-medium">Preview:</p>
                                            <div className="space-y-2">
                                                {logoPreview ? (
                                                    <img
                                                        src={logoPreview}
                                                        alt="Logo"
                                                        className="h-12 w-auto"
                                                    />
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">
                                                        No logo uploaded
                                                    </p>
                                                )}
                                                <p className="text-sm text-muted-foreground">
                                                    {form.watch('tagline')}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Columns Tab */}
                            <TabsContent value="columns" className="space-y-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle>Footer Columns</CardTitle>
                                            <CardDescription>
                                                Manage footer link columns
                                            </CardDescription>
                                        </div>
                                        <Button type="button" onClick={addColumn} size="sm">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Column
                                        </Button>
                                    </CardHeader>
                                    <CardContent>
                                        <ScrollArea className="h-[600px] pr-4">
                                            <div className="space-y-4">
                                                {columnFields.map((field, index) => (
                                                    <Card key={field.id} className="border-2">
                                                        <CardContent className="pt-6">
                                                            <div className="space-y-4">
                                                                {/* Column Header */}
                                                                <div className="flex items-start gap-4">
                                                                    <div className="flex flex-col gap-1 pt-2">
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-6 w-6"
                                                                            onClick={() =>
                                                                                index > 0 &&
                                                                                moveColumn(
                                                                                    index,
                                                                                    index - 1,
                                                                                )
                                                                            }
                                                                            disabled={index === 0}
                                                                        >
                                                                            <ChevronUp className="h-4 w-4" />
                                                                        </Button>
                                                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-6 w-6"
                                                                            onClick={() =>
                                                                                index <
                                                                                    columnFields.length -
                                                                                        1 &&
                                                                                moveColumn(
                                                                                    index,
                                                                                    index + 1,
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                index ===
                                                                                columnFields.length -
                                                                                    1
                                                                            }
                                                                        >
                                                                            <ChevronDown className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>

                                                                    <div className="flex-1 space-y-4">
                                                                        {/* Column Title */}
                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`columns.${index}.title`}
                                                                            render={({ field }) => (
                                                                                <FormItem>
                                                                                    <FormLabel>
                                                                                        Column Title
                                                                                    </FormLabel>
                                                                                    <FormControl>
                                                                                        <Input
                                                                                            {...field}
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />

                                                                        {/* Links */}
                                                                        <div className="space-y-2">
                                                                            <div className="flex items-center justify-between">
                                                                                <Label className="text-sm font-medium">
                                                                                    Links
                                                                                </Label>
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    onClick={() =>
                                                                                        addLink(
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <Plus className="mr-1 h-3 w-3" />
                                                                                    Add Link
                                                                                </Button>
                                                                            </div>

                                                                            {form.watch(
                                                                                `columns.${index}.links`,
                                                                            )?.length ? (
                                                                                <div className="space-y-2 rounded-lg border bg-muted/50 p-3">
                                                                                    {form
                                                                                        .watch(
                                                                                            `columns.${index}.links`,
                                                                                        )
                                                                                        ?.map(
                                                                                            (
                                                                                                _,
                                                                                                linkIndex,
                                                                                            ) => (
                                                                                                <div
                                                                                                    key={
                                                                                                        linkIndex
                                                                                                    }
                                                                                                    className="flex items-end gap-2"
                                                                                                >
                                                                                                    <FormField
                                                                                                        control={
                                                                                                            form.control
                                                                                                        }
                                                                                                        name={`columns.${index}.links.${linkIndex}.label`}
                                                                                                        render={({
                                                                                                            field,
                                                                                                        }) => (
                                                                                                            <FormItem className="flex-1">
                                                                                                                <FormControl>
                                                                                                                    <Input
                                                                                                                        {...field}
                                                                                                                        placeholder="Label"
                                                                                                                    />
                                                                                                                </FormControl>
                                                                                                            </FormItem>
                                                                                                        )}
                                                                                                    />
                                                                                                    <FormField
                                                                                                        control={
                                                                                                            form.control
                                                                                                        }
                                                                                                        name={`columns.${index}.links.${linkIndex}.href`}
                                                                                                        render={({
                                                                                                            field,
                                                                                                        }) => (
                                                                                                            <FormItem className="flex-1">
                                                                                                                <FormControl>
                                                                                                                    <Input
                                                                                                                        {...field}
                                                                                                                        placeholder="Link"
                                                                                                                    />
                                                                                                                </FormControl>
                                                                                                            </FormItem>
                                                                                                        )}
                                                                                                    />
                                                                                                    <Button
                                                                                                        type="button"
                                                                                                        variant="ghost"
                                                                                                        size="icon"
                                                                                                        onClick={() =>
                                                                                                            removeLink(
                                                                                                                index,
                                                                                                                linkIndex,
                                                                                                            )
                                                                                                        }
                                                                                                    >
                                                                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                                                                    </Button>
                                                                                                </div>
                                                                                            ),
                                                                                        )}
                                                                                </div>
                                                                            ) : (
                                                                                <p className="text-center text-sm text-muted-foreground">
                                                                                    No links added
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() =>
                                                                            removeColumn(index)
                                                                        }
                                                                    >
                                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Contact Tab */}
                            <TabsContent value="contact" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Contact Information</CardTitle>
                                        <CardDescription>
                                            Manage footer contact details
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="contactInfo.address"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Address</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            rows={3}
                                                            placeholder="Company address"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="contactInfo.phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Phone Number</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="+880 1677-600000"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="contactInfo.email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email Address</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                type="email"
                                                                placeholder="hello@example.com"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Social Tab */}
                            <TabsContent value="social" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Social Media Links</CardTitle>
                                        <CardDescription>
                                            Configure social media profiles
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="socialLinks.facebook"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Facebook className="h-4 w-4" />
                                                        Facebook
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="https://facebook.com/..."
                                                        />
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
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Youtube className="h-4 w-4" />
                                                        YouTube
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="https://youtube.com/..."
                                                        />
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
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Linkedin className="h-4 w-4" />
                                                        LinkedIn
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="https://linkedin.com/..."
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Copyright Tab */}
                            <TabsContent value="copyright" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Copyright & Developer Info</CardTitle>
                                        <CardDescription>
                                            Manage copyright and developer credits
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="copyright.text"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Copyright Text</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="Company Name. All rights reserved."
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="copyright.year"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Copyright Year</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                type="number"
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        parseInt(
                                                                            e.target.value,
                                                                            10,
                                                                        ),
                                                                    )
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <Separator />

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="developer.name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Developer Name</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="NexKraft"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="developer.url"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Developer URL</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="https://example.com"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Preview */}
                                        <div className="rounded-lg border bg-muted/50 p-4">
                                            <p className="mb-2 text-sm font-medium">Preview:</p>
                                            <div className="space-y-1 text-sm text-muted-foreground">
                                                <p>
                                                    © {form.watch('copyright.year')}{' '}
                                                    {form.watch('copyright.text')}
                                                </p>
                                                <p>
                                                    Developed and maintained by{' '}
                                                    <a
                                                        href={form.watch('developer.url')}
                                                        className="font-medium text-foreground hover:underline"
                                                    >
                                                        {form.watch('developer.name')}
                                                    </a>
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </form>
                </Form>
            </div>
        </AdminLayout>
    );
}
