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
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminLayout } from '@/layouts/admin-layout';
import { useCMSStore } from '@/stores/cms-store';
import {
    useMediaContent,
    useUpdateMediaContent,
    useNewsArticles,
    useCreateNewsArticle,
    useUpdateNewsArticle,
    useDeleteNewsArticle,
} from '@/hooks/use-cms';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save, Trash2, Edit, Eye, Calendar, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import type { NewsArticle } from '@/types/cms';

const mediaHeroSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    subtitle: z.string().min(1, 'Subtitle is required'),
    backgroundImage: z.object({
        id: z.string(),
        url: z.string().url('Must be a valid URL'),
        alt: z.string().min(1, 'Alt text is required'),
    }),
});

const newsArticleSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    excerpt: z.string().min(1, 'Excerpt is required'),
    content: z.string().min(1, 'Content is required'),
    author: z.string().min(1, 'Author is required'),
    publishDate: z.string().min(1, 'Publish date is required'),
    category: z.enum(['news', 'press', 'blog', 'launch']),
    featured: z.boolean(),
    image: z.object({
        id: z.string(),
        url: z.string().url('Must be a valid URL'),
        alt: z.string().min(1, 'Alt text is required'),
    }),
    tags: z.array(z.string()).optional(),
});

type MediaHeroFormData = z.infer<typeof mediaHeroSchema>;
type NewsArticleFormData = z.infer<typeof newsArticleSchema>;

export default function AdminMediaPageEditor() {
    const { mediaContent, newsArticles, setMediaContent, addNewsArticle, updateNewsArticle, deleteNewsArticle, addActivity } = useCMSStore();
    const { data: serverMediaContent } = useMediaContent();
    const updateMutation = useUpdateMediaContent();
    const { data: serverNews } = useNewsArticles();
    const createNews = useCreateNewsArticle();
    const updateNews = useUpdateNewsArticle();
    const deleteNews = useDeleteNewsArticle();
    const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('content');

    const heroForm = useForm<MediaHeroFormData>({
        resolver: zodResolver(mediaHeroSchema),
        defaultValues: mediaContent ? {
            title: mediaContent.heroSection.title,
            subtitle: mediaContent.heroSection.subtitle,
            backgroundImage: mediaContent.heroSection.backgroundImage,
        } : undefined,
    });

    const articleForm = useForm<NewsArticleFormData>({
        resolver: zodResolver(newsArticleSchema),
        defaultValues: {
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            author: '',
            publishDate: new Date().toISOString().split('T')[0],
            category: 'news',
            featured: false,
            image: { id: '', url: '', alt: '' },
            tags: [],
        },
    });

    useEffect(() => {
        const content = serverMediaContent || mediaContent;
        if (content) {
            heroForm.reset({
                title: content.heroSection.title,
                subtitle: content.heroSection.subtitle,
                backgroundImage: content.heroSection.backgroundImage,
            });
            // ensure store is populated from server
            if (serverMediaContent) setMediaContent(serverMediaContent);
        }
    }, [serverMediaContent, mediaContent, heroForm, setMediaContent]);

    useEffect(() => {
        if (editingArticle) {
            articleForm.reset({
                id: editingArticle.id,
                title: editingArticle.title,
                slug: editingArticle.slug,
                excerpt: editingArticle.excerpt,
                content: editingArticle.content,
                author: editingArticle.author,
                publishDate: editingArticle.publishDate,
                category: editingArticle.category,
                featured: editingArticle.featured,
                image: editingArticle.image,
                tags: editingArticle.tags,
            });
            setIsDialogOpen(true);
        }
    }, [editingArticle, articleForm]);

    const onHeroSubmit = async (data: MediaHeroFormData) => {
        try {
            const updated = await updateMutation.mutateAsync({ heroSection: { title: data.title, subtitle: data.subtitle, backgroundImage: data.backgroundImage } });
            setMediaContent(updated);
            addActivity({
                type: 'update',
                entity: 'page',
                entityId: 'media',
                entityName: 'Media Page',
                description: 'Updated media page hero section',
            });
            toast.success('Media page content saved successfully!', {
                description: 'Changes are now live on the frontend.',
            });
        } catch {
            toast.error('Failed to save changes');
        }
    };

    const onArticleSubmit = async (data: NewsArticleFormData) => {
        try {
            if (data.id) {
                // Update existing article via API
                const updated = await updateNews.mutateAsync({ id: data.id, data: data as any });
                // update local store
                updateNewsArticle(data.id, updated);
                addActivity({
                    type: 'update',
                    entity: 'article',
                    entityId: data.id,
                    entityName: data.title,
                    description: `Updated article: ${data.title}`,
                });
                toast.success('Article updated successfully!');
            } else {
                // Create new article via API
                const created = await createNews.mutateAsync(data as any);
                addNewsArticle(created as NewsArticle);
                addActivity({
                    type: 'create',
                    entity: 'article',
                    entityId: (created as NewsArticle).id,
                    entityName: created.title,
                    description: `Created new article: ${created.title}`,
                });
                toast.success('Article created successfully!');
            }
            setIsDialogOpen(false);
            setEditingArticle(null);
            articleForm.reset({
                title: '',
                slug: '',
                excerpt: '',
                content: '',
                author: '',
                publishDate: new Date().toISOString().split('T')[0],
                category: 'news',
                featured: false,
                image: { id: '', url: '', alt: '' },
                tags: [],
            });
        } catch {
            toast.error('Failed to save article');
        }
    };

    const handleDeleteArticle = async (article: NewsArticle) => {
        try {
            await deleteNews.mutateAsync(article.id);
            deleteNewsArticle(article.id);
            addActivity({
                type: 'delete',
                entity: 'article',
                entityId: article.id,
                entityName: article.title,
                description: `Deleted article: ${article.title}`,
            });
            toast.success('Article deleted successfully!');
        } catch {
            toast.error('Failed to delete article');
        }
    };

    const handleOpenCreateDialog = () => {
        setEditingArticle(null);
        articleForm.reset({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            author: '',
            publishDate: new Date().toISOString().split('T')[0],
            category: 'news',
            featured: false,
            image: { id: '', url: '', alt: '' },
            tags: [],
        });
        setIsDialogOpen(true);
    };

    const getCategoryBadge = (category: string) => {
        const colors: Record<string, string> = {
            'news': 'bg-primary',
            'press': 'bg-chart-5',
            'blog': 'bg-chart-2',
            'launch': 'bg-chart-4',
        };
        return <Badge className={colors[category] || 'bg-muted'}>{category}</Badge>;
    };

    return (
        <AdminLayout title="Edit Media Page">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Media & News Management</h2>
                        <p className="text-muted-foreground">
                            Manage media page content and news articles
                        </p>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="content">Page Content</TabsTrigger>
                        <TabsTrigger value="articles">News Articles ({(serverNews || newsArticles).length})</TabsTrigger>
                    </TabsList>

                    {/* Page Content Tab */}
                    <TabsContent value="content" className="space-y-6">
                        <Form {...heroForm}>
                            <form onSubmit={heroForm.handleSubmit(onHeroSubmit)} className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Hero Section</CardTitle>
                                        <CardDescription>The banner displayed at the top of the media page</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <FormField
                                                control={heroForm.control}
                                                name="title"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Title</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Media & News" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={heroForm.control}
                                                name="subtitle"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Subtitle</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Stay updated..." {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <FormLabel>Background Image</FormLabel>
                                            <ImageUpload
                                                value={heroForm.watch('backgroundImage.url')}
                                                onChange={(url) => heroForm.setValue('backgroundImage.url', url)}
                                                onAltChange={(alt) => heroForm.setValue('backgroundImage.alt', alt)}
                                                alt={heroForm.watch('backgroundImage.alt')}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={heroForm.formState.isSubmitting}>
                                        <Save className="mr-2 h-4 w-4" />
                                        {heroForm.formState.isSubmitting ? 'Saving...' : 'Save Page Content'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </TabsContent>

                    {/* News Articles Tab */}
                    <TabsContent value="articles" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>News Articles</CardTitle>
                                        <CardDescription>Manage all news articles and blog posts</CardDescription>
                                    </div>
                                    <Button onClick={handleOpenCreateDialog}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Article
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {(serverNews || newsArticles).length === 0 ? (
                                    <div className="py-12 text-center">
                                        <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                        <p className="text-muted-foreground">No articles yet</p>
                                        <Button className="mt-4" onClick={handleOpenCreateDialog}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create Your First Article
                                        </Button>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Title</TableHead>
                                                <TableHead>Category</TableHead>
                                                <TableHead>Author</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Featured</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {(serverNews || newsArticles).map((article) => (
                                                <TableRow key={article.id}>
                                                    <TableCell className="font-medium">
                                                        <div className="max-w-xs truncate">{article.title}</div>
                                                    </TableCell>
                                                    <TableCell>{getCategoryBadge(article.category)}</TableCell>
                                                    <TableCell>{article.author}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                            <Calendar className="h-3 w-3" />
                                                            {new Date(article.publishDate).toLocaleDateString()}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {article.featured && (
                                                            <Badge variant="secondary">Featured</Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setEditingArticle(article)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleDeleteArticle(article)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Article Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) setEditingArticle(null);
                }}>
                    <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingArticle ? 'Edit Article' : 'Create New Article'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingArticle ? 'Update the article details below' : 'Fill in the details to create a new article'}
                            </DialogDescription>
                        </DialogHeader>

                        <Form {...articleForm}>
                            <form onSubmit={articleForm.handleSubmit(onArticleSubmit)} className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={articleForm.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Article title" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={articleForm.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Slug</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="article-slug" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={articleForm.control}
                                    name="excerpt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Excerpt</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Brief description" rows={2} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={articleForm.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Content</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Full article content" rows={6} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid gap-4 md:grid-cols-3">
                                    <FormField
                                        control={articleForm.control}
                                        name="author"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Author</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Author name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={articleForm.control}
                                        name="publishDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Publish Date</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={articleForm.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category</FormLabel>
                                                <FormControl>
                                                    <select
                                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                        {...field}
                                                    >
                                                        <option value="news">News</option>
                                                        <option value="press">Press Release</option>
                                                        <option value="blog">Blog</option>
                                                        <option value="launch">Launch</option>
                                                    </select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={articleForm.control}
                                        name="image.url"
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
                                    <FormField
                                        control={articleForm.control}
                                        name="image.alt"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Image Alt Text</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Image description" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={articleForm.control}
                                    name="featured"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center gap-2">
                                            <FormControl>
                                                <input
                                                    type="checkbox"
                                                    checked={field.value}
                                                    onChange={field.onChange}
                                                    className="h-4 w-4 rounded border-border"
                                                />
                                            </FormControl>
                                            <FormLabel className="!mt-0">Featured Article</FormLabel>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={articleForm.formState.isSubmitting}>
                                        <Save className="mr-2 h-4 w-4" />
                                        {articleForm.formState.isSubmitting ? 'Saving...' : editingArticle ? 'Update Article' : 'Create Article'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
