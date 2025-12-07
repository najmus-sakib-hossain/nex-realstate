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
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminLayout } from '@/layouts/admin-layout';
import { headerSettingsSchema } from '@/lib/validations/cms-schemas';
import { useCMSStore } from '@/stores/cms-store';
import type { HeaderSettings, NavigationChildItem, NavigationItem } from '@/types/cms';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
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

type HeaderSettingsFormData = z.infer<typeof headerSettingsSchema>;

export default function AdminHeaderPage() {
    const { headerSettings, setHeaderSettings } = useCMSStore();
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const form = useForm<HeaderSettingsFormData>({
        resolver: zodResolver(headerSettingsSchema),
        defaultValues: headerSettings || undefined,
    });

    const {
        fields: navigationFields,
        append: appendNavigation,
        remove: removeNavigation,
        move: moveNavigation,
    } = useFieldArray({
        control: form.control,
        name: 'navigation',
    });

    // Load data on mount
    useEffect(() => {
        if (headerSettings) {
            form.reset(headerSettings);
            setLogoPreview(headerSettings.logo.url);
        }
    }, [headerSettings, form]);

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
        mutationFn: async (data: HeaderSettingsFormData) => {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return data;
        },
        onSuccess: (data) => {
            setHeaderSettings(data);
            toast.success('Header settings saved successfully!');
        },
        onError: () => {
            toast.error('Failed to save header settings');
        },
    });

    const onSubmit = (data: HeaderSettingsFormData) => {
        saveMutation.mutate(data);
    };

    const addNavigationItem = () => {
        const newOrder = navigationFields.length + 1;
        appendNavigation({
            id: `nav-${Date.now()}`,
            name: 'New Item',
            href: '/',
            order: newOrder,
            children: [],
        });
    };

    const addChildItem = (parentIndex: number) => {
        const currentChildren = form.getValues(`navigation.${parentIndex}.children`) || [];
        const newOrder = currentChildren.length + 1;
        const updatedChildren = [
            ...currentChildren,
            {
                id: `nav-${Date.now()}-${newOrder}`,
                name: 'New Child',
                href: '/',
                order: newOrder,
            },
        ];
        form.setValue(`navigation.${parentIndex}.children`, updatedChildren);
    };

    const removeChildItem = (parentIndex: number, childIndex: number) => {
        const currentChildren = form.getValues(`navigation.${parentIndex}.children`) || [];
        const updatedChildren = currentChildren.filter((_, i) => i !== childIndex);
        form.setValue(`navigation.${parentIndex}.children`, updatedChildren);
    };

    return (
        <AdminLayout title="Header Settings">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Header & Navigation Settings</h2>
                        <p className="text-muted-foreground">
                            Manage your website header, branding, and navigation menu
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
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="branding">Branding</TabsTrigger>
                                <TabsTrigger value="topbar">Top Bar</TabsTrigger>
                                <TabsTrigger value="navigation">Navigation</TabsTrigger>
                                <TabsTrigger value="cta">CTA Button</TabsTrigger>
                            </TabsList>

                            {/* Branding Tab */}
                            <TabsContent value="branding" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Brand Identity</CardTitle>
                                        <CardDescription>
                                            Configure your logo and brand name
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
                                                                <div className="flex items-center gap-4 rounded-lg border p-4">
                                                                    <img
                                                                        src={logoPreview}
                                                                        alt="Logo preview"
                                                                        className="h-16 w-auto object-contain"
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
                                                        Upload your company logo (recommended: PNG
                                                        with transparent background)
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Separator />

                                        {/* Brand Name */}
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="brandName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Brand Name</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="Nex"
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            First part of your brand name
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="brandNameHighlight"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Brand Name Highlight
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="Real Estate"
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Highlighted part (colored)
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Preview */}
                                        <div className="rounded-lg border bg-muted/50 p-4">
                                            <p className="mb-2 text-sm font-medium">Preview:</p>
                                            <div className="flex items-center gap-2">
                                                {logoPreview && (
                                                    <img
                                                        src={logoPreview}
                                                        alt="Logo"
                                                        className="h-8 w-auto"
                                                    />
                                                )}
                                                <span className="text-xl font-bold">
                                                    {form.watch('brandName')}{' '}
                                                    <span className="text-primary">
                                                        {form.watch('brandNameHighlight')}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Top Bar Tab */}
                            <TabsContent value="topbar" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Top Bar Settings</CardTitle>
                                        <CardDescription>
                                            Configure contact information and social links
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Show Top Bar */}
                                        <FormField
                                            control={form.control}
                                            name="showTopBar"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-base">
                                                            Show Top Bar
                                                        </FormLabel>
                                                        <FormDescription>
                                                            Display top bar with contact info and
                                                            social links
                                                        </FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        <Separator />

                                        {/* Contact Information */}
                                        <div className="space-y-4">
                                            <h3 className="font-semibold">Contact Information</h3>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <FormField
                                                    control={form.control}
                                                    name="topBar.contactPhone"
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
                                                    name="topBar.contactEmail"
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
                                        </div>

                                        <Separator />

                                        {/* Social Links */}
                                        <div className="space-y-4">
                                            <h3 className="font-semibold">Social Media Links</h3>
                                            <div className="space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name="topBar.socialLinks.facebook"
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
                                                    name="topBar.socialLinks.youtube"
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
                                                    name="topBar.socialLinks.linkedin"
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
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Navigation Tab */}
                            <TabsContent value="navigation" className="space-y-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle>Navigation Menu</CardTitle>
                                            <CardDescription>
                                                Manage your website navigation items and submenus
                                            </CardDescription>
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={addNavigationItem}
                                            size="sm"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Item
                                        </Button>
                                    </CardHeader>
                                    <CardContent>
                                        <ScrollArea className="h-[600px] pr-4">
                                            <div className="space-y-4">
                                                {navigationFields.map((field, index) => (
                                                    <Card key={field.id} className="border-2">
                                                        <CardContent className="pt-6">
                                                            <div className="space-y-4">
                                                                {/* Navigation Item Header */}
                                                                <div className="flex items-start gap-4">
                                                                    <div className="flex flex-col gap-1 pt-2">
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-6 w-6"
                                                                            onClick={() =>
                                                                                index > 0 &&
                                                                                moveNavigation(
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
                                                                                    navigationFields.length -
                                                                                        1 &&
                                                                                moveNavigation(
                                                                                    index,
                                                                                    index + 1,
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                index ===
                                                                                navigationFields.length -
                                                                                    1
                                                                            }
                                                                        >
                                                                            <ChevronDown className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>

                                                                    <div className="flex-1 space-y-4">
                                                                        <div className="grid gap-4 md:grid-cols-2">
                                                                            <FormField
                                                                                control={
                                                                                    form.control
                                                                                }
                                                                                name={`navigation.${index}.name`}
                                                                                render={({
                                                                                    field,
                                                                                }) => (
                                                                                    <FormItem>
                                                                                        <FormLabel>
                                                                                            Name
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

                                                                            <FormField
                                                                                control={
                                                                                    form.control
                                                                                }
                                                                                name={`navigation.${index}.href`}
                                                                                render={({
                                                                                    field,
                                                                                }) => (
                                                                                    <FormItem>
                                                                                        <FormLabel>
                                                                                            Link
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
                                                                        </div>

                                                                        {/* Child Items */}
                                                                        <div className="space-y-2">
                                                                            <div className="flex items-center justify-between">
                                                                                <Label className="text-sm font-medium">
                                                                                    Submenu Items
                                                                                </Label>
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    onClick={() =>
                                                                                        addChildItem(
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <Plus className="mr-1 h-3 w-3" />
                                                                                    Add Submenu
                                                                                </Button>
                                                                            </div>

                                                                            {form.watch(
                                                                                `navigation.${index}.children`,
                                                                            )?.length ? (
                                                                                <div className="space-y-2 rounded-lg border bg-muted/50 p-3">
                                                                                    {form
                                                                                        .watch(
                                                                                            `navigation.${index}.children`,
                                                                                        )
                                                                                        ?.map(
                                                                                            (
                                                                                                _,
                                                                                                childIndex,
                                                                                            ) => (
                                                                                                <div
                                                                                                    key={
                                                                                                        childIndex
                                                                                                    }
                                                                                                    className="flex items-end gap-2"
                                                                                                >
                                                                                                    <FormField
                                                                                                        control={
                                                                                                            form.control
                                                                                                        }
                                                                                                        name={`navigation.${index}.children.${childIndex}.name`}
                                                                                                        render={({
                                                                                                            field,
                                                                                                        }) => (
                                                                                                            <FormItem className="flex-1">
                                                                                                                <FormControl>
                                                                                                                    <Input
                                                                                                                        {...field}
                                                                                                                        placeholder="Name"
                                                                                                                    />
                                                                                                                </FormControl>
                                                                                                            </FormItem>
                                                                                                        )}
                                                                                                    />
                                                                                                    <FormField
                                                                                                        control={
                                                                                                            form.control
                                                                                                        }
                                                                                                        name={`navigation.${index}.children.${childIndex}.href`}
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
                                                                                                            removeChildItem(
                                                                                                                index,
                                                                                                                childIndex,
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
                                                                                    No submenu
                                                                                    items
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() =>
                                                                            removeNavigation(index)
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

                            {/* CTA Button Tab */}
                            <TabsContent value="cta" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Call-to-Action Button</CardTitle>
                                        <CardDescription>
                                            Configure the primary CTA button in the header
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="ctaButton.text"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Button Text</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="Book a Visit"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="ctaButton.href"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Button Link</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="/contact"
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
                                            <Button>{form.watch('ctaButton.text')}</Button>
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
