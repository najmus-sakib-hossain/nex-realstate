import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { AdminLayout } from '@/layouts/admin-layout';
import type { SiteSettings } from '@/types/cms';
import { Save } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const defaultSettings: SiteSettings = {
    siteName: 'Nex Realstate',
    tagline: 'Building Dreams, Creating Futures',
    logo: { id: 'logo-1', url: '/logo.png', alt: 'Nex Realstate' },
    favicon: { id: 'fav-1', url: '/favicon.ico', alt: 'Favicon' },
    contactEmail: 'info@nexrealstate.com',
    contactPhone: ['+880 1234-567890', '+880 1234-567891'],
    address: 'House 123, Road 456, Dhaka 1000, Bangladesh',
    socialLinks: {
        facebook: 'https://facebook.com/nexrealstate',
        linkedin: 'https://linkedin.com/company/nexrealstate',
        twitter: 'https://twitter.com/nexrealstate',
        instagram: 'https://instagram.com/nexrealstate',
        youtube: 'https://youtube.com/nexrealstate',
    },
    seo: {
        title: 'Nex Realstate - Premium Real Estate Developer in Bangladesh',
        description:
            'Nex Realstate is a leading real estate developer in Bangladesh, offering premium residential and commercial properties.',
        keywords: ['real estate', 'Bangladesh', 'property', 'developer'],
        ogImage: { id: 'og-1', url: '/images/og-image.jpg', alt: 'Nex Realstate' },
    },
    footer: {
        copyright: '© 2024 Nex Realstate. All rights reserved.',
        developedBy: {
            name: 'Nex Technology',
            url: 'https://nextech.com',
        },
    },
    maintenanceMode: false,
    maintenanceMessage: 'We are currently under maintenance. Please check back later.',
};

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success('Settings saved successfully!');
        setIsSaving(false);
    };

    const updateSocialLinks = (field: keyof SiteSettings['socialLinks'], value: string) => {
        setSettings((prev) => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [field]: value,
            },
        }));
    };

    const updateSeo = (field: keyof SiteSettings['seo'], value: string | string[]) => {
        setSettings((prev) => ({
            ...prev,
            seo: {
                ...prev.seo,
                [field]: value,
            },
        }));
    };

    return (
        <AdminLayout title="Settings">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold">Site Settings</h2>
                    <p className="text-muted-foreground">
                        Manage your website settings and configurations
                    </p>
                </div>

                <Tabs defaultValue="general">
                    <TabsList>
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="contact">Contact</TabsTrigger>
                        <TabsTrigger value="social">Social Media</TabsTrigger>
                        <TabsTrigger value="seo">SEO</TabsTrigger>
                        <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>

                    {/* General Settings */}
                    <TabsContent value="general" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>General Settings</CardTitle>
                                <CardDescription>
                                    Basic website information and branding
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Site Name</Label>
                                        <Input
                                            value={settings.siteName}
                                            onChange={(e) =>
                                                setSettings((prev) => ({
                                                    ...prev,
                                                    siteName: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tagline</Label>
                                        <Input
                                            value={settings.tagline}
                                            onChange={(e) =>
                                                setSettings((prev) => ({
                                                    ...prev,
                                                    tagline: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Logo</Label>
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={settings.logo.url}
                                                alt="Logo"
                                                className="h-12 rounded bg-muted p-2"
                                            />
                                            <Button variant="outline">Upload Logo</Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Favicon</Label>
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={settings.favicon.url}
                                                alt="Favicon"
                                                className="h-8 w-8"
                                            />
                                            <Button variant="outline">Upload Favicon</Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Copyright Text</Label>
                                    <Input
                                        value={settings.footer.copyright}
                                        onChange={(e) =>
                                            setSettings((prev) => ({
                                                ...prev,
                                                footer: {
                                                    ...prev.footer,
                                                    copyright: e.target.value,
                                                },
                                            }))
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Contact Settings */}
                    <TabsContent value="contact" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                                <CardDescription>
                                    Contact details displayed on the website
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Email Address</Label>
                                        <Input
                                            type="email"
                                            value={settings.contactEmail}
                                            onChange={(e) =>
                                                setSettings((prev) => ({
                                                    ...prev,
                                                    contactEmail: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone Numbers (comma separated)</Label>
                                        <Input
                                            value={settings.contactPhone.join(', ')}
                                            onChange={(e) =>
                                                setSettings((prev) => ({
                                                    ...prev,
                                                    contactPhone: e.target.value.split(',').map((s) => s.trim()),
                                                }))
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Office Address</Label>
                                    <Textarea
                                        value={settings.address}
                                        onChange={(e) =>
                                            setSettings((prev) => ({
                                                ...prev,
                                                address: e.target.value,
                                            }))
                                        }
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Social Media Settings */}
                    <TabsContent value="social" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Social Media Links</CardTitle>
                                <CardDescription>
                                    Links to your social media profiles
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Facebook</Label>
                                        <Input
                                            value={settings.socialLinks.facebook ?? ''}
                                            onChange={(e) =>
                                                updateSocialLinks('facebook', e.target.value)
                                            }
                                            placeholder="https://facebook.com/..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>LinkedIn</Label>
                                        <Input
                                            value={settings.socialLinks.linkedin ?? ''}
                                            onChange={(e) =>
                                                updateSocialLinks('linkedin', e.target.value)
                                            }
                                            placeholder="https://linkedin.com/company/..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Twitter</Label>
                                        <Input
                                            value={settings.socialLinks.twitter ?? ''}
                                            onChange={(e) =>
                                                updateSocialLinks('twitter', e.target.value)
                                            }
                                            placeholder="https://twitter.com/..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Instagram</Label>
                                        <Input
                                            value={settings.socialLinks.instagram ?? ''}
                                            onChange={(e) =>
                                                updateSocialLinks('instagram', e.target.value)
                                            }
                                            placeholder="https://instagram.com/..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>YouTube</Label>
                                        <Input
                                            value={settings.socialLinks.youtube ?? ''}
                                            onChange={(e) =>
                                                updateSocialLinks('youtube', e.target.value)
                                            }
                                            placeholder="https://youtube.com/..."
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* SEO Settings */}
                    <TabsContent value="seo" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>SEO Settings</CardTitle>
                                <CardDescription>
                                    Default meta tags for search engine optimization
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Default Meta Title</Label>
                                    <Input
                                        value={settings.seo.title}
                                        onChange={(e) =>
                                            updateSeo('title', e.target.value)
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Default Meta Description</Label>
                                    <Textarea
                                        value={settings.seo.description}
                                        onChange={(e) =>
                                            updateSeo('description', e.target.value)
                                        }
                                        rows={3}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Default Keywords (comma separated)</Label>
                                    <Input
                                        value={settings.seo.keywords?.join(', ')}
                                        onChange={(e) =>
                                            updateSeo(
                                                'keywords',
                                                e.target.value.split(',').map((s) => s.trim()),
                                            )
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>OG Image</Label>
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={settings.seo.ogImage.url}
                                            alt="OG Image"
                                            className="h-16 w-32 rounded object-cover"
                                        />
                                        <Button variant="outline">Upload OG Image</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Advanced Settings */}
                    <TabsContent value="advanced" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Footer Settings</CardTitle>
                                <CardDescription>
                                    Configure footer information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Developed By Name</Label>
                                        <Input
                                            value={settings.footer.developedBy.name}
                                            onChange={(e) =>
                                                setSettings((prev) => ({
                                                    ...prev,
                                                    footer: {
                                                        ...prev.footer,
                                                        developedBy: {
                                                            ...prev.footer.developedBy,
                                                            name: e.target.value,
                                                        },
                                                    },
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Developed By URL</Label>
                                        <Input
                                            value={settings.footer.developedBy.url}
                                            onChange={(e) =>
                                                setSettings((prev) => ({
                                                    ...prev,
                                                    footer: {
                                                        ...prev.footer,
                                                        developedBy: {
                                                            ...prev.footer.developedBy,
                                                            url: e.target.value,
                                                        },
                                                    },
                                                }))
                                            }
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Maintenance Mode</CardTitle>
                                <CardDescription>
                                    Enable maintenance mode to show a coming soon page
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Switch
                                        id="maintenance"
                                        checked={settings.maintenanceMode}
                                        onCheckedChange={(checked) =>
                                            setSettings((prev) => ({
                                                ...prev,
                                                maintenanceMode: checked,
                                            }))
                                        }
                                    />
                                    <Label htmlFor="maintenance">
                                        Enable Maintenance Mode
                                    </Label>
                                </div>
                                {settings.maintenanceMode && (
                                    <>
                                        <div className="space-y-2">
                                            <Label>Maintenance Message</Label>
                                            <Textarea
                                                value={settings.maintenanceMessage ?? ''}
                                                onChange={(e) =>
                                                    setSettings((prev) => ({
                                                        ...prev,
                                                        maintenanceMessage: e.target.value,
                                                    }))
                                                }
                                                rows={3}
                                            />
                                        </div>
                                        <p className="text-sm text-destructive">
                                            Warning: Enabling this will make the site inaccessible
                                            to visitors.
                                        </p>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Danger Zone</CardTitle>
                                <CardDescription>
                                    Irreversible and destructive actions
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between rounded-lg border border-destructive p-4">
                                    <div>
                                        <h4 className="font-medium">Clear Cache</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Clear all cached data and regenerate
                                        </p>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        onClick={() => toast.success('Cache cleared!')}
                                    >
                                        Clear Cache
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button size="lg" onClick={handleSave} disabled={isSaving}>
                        <Save className="mr-2 h-4 w-4" />
                        {isSaving ? 'Saving...' : 'Save All Settings'}
                    </Button>
                </div>
            </div>
        </AdminLayout>
    );
}
