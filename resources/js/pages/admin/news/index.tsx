import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { AdminLayout } from '@/layouts/admin-layout';
import { useNewsArticles, useCreateNewsArticle, useUpdateNewsArticle, useDeleteNewsArticle } from '@/hooks/use-cms';
import { useCMSStore } from '@/stores/cms-store';
import type { NewsArticle } from '@/types/cms';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { format } from 'date-fns';

const articleSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
    content: z.string().min(50, 'Content must be at least 50 characters'),
    image: z.object({
        id: z.string(),
        url: z.string().url('Must be a valid URL'),
        alt: z.string(),
    }),
    category: z.enum(['news', 'blog', 'press', 'launch']),
    author: z.string().min(1, 'Author is required'),
    publishDate: z.string(),
    featured: z.boolean(),
    tags: z.string(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

export default function AdminNewsPage() {
    const { newsArticles: storeArticles, setNewsArticles, addActivity } = useCMSStore();
    const { data: serverArticles } = useNewsArticles();
    const createMutation = useCreateNewsArticle();
    const updateMutation = useUpdateNewsArticle();
    const deleteMutation = useDeleteNewsArticle();
    const newsArticles = serverArticles || storeArticles;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);

    const form = useForm<ArticleFormData>({
        resolver: zodResolver(articleSchema),
        defaultValues: {
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            image: { id: '', url: '', alt: '' },
            category: 'news',
            author: '',
            publishDate: new Date().toISOString().split('T')[0],
            featured: false,
            tags: '',
        },
    });

    const handleEdit = (article: NewsArticle) => {
        setEditingArticle(article);
        form.reset({
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt,
            content: article.content,
            image: article.image,
            category: article.category,
            author: article.author,
            publishDate: article.publishDate,
            featured: article.featured,
            tags: article.tags.join(', '),
        });
        setIsDialogOpen(true);
    };

    const handleAdd = () => {
        setEditingArticle(null);
        form.reset({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            image: { id: '', url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800', alt: '' },
            category: 'news',
            author: 'Nex Media Team',
            publishDate: new Date().toISOString().split('T')[0],
            featured: false,
            tags: '',
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        const article = newsArticles.find(a => a.id === id);
        setNewsArticles(newsArticles.filter((a) => a.id !== id));
        addActivity({
            type: 'delete',
            entity: 'article',
            entityId: id,
            entityName: article?.title || 'Article',
            description: `Deleted article: ${article?.title}`,
        });
        toast.success('Article deleted');
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const onSubmit = (data: ArticleFormData) => {
        const tags = data.tags.split(',').map(t => t.trim()).filter(Boolean);
        
        if (editingArticle) {
            const updated = newsArticles.map((a) =>
                a.id === editingArticle.id
                    ? { ...a, ...data, tags, updatedAt: new Date().toISOString() }
                    : a,
            );
            setNewsArticles(updated);
            addActivity({
                type: 'update',
                entity: 'article',
                entityId: editingArticle.id,
                entityName: data.title,
                description: `Updated article: ${data.title}`,
            });
            toast.success('Article updated');
        } else {
            const newArticle: NewsArticle = {
                id: `article-${Date.now()}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                ...data,
                tags,
            };
            setNewsArticles([...newsArticles, newArticle]);
            addActivity({
                type: 'create',
                entity: 'article',
                entityId: newArticle.id,
                entityName: data.title,
                description: `Added new article: ${data.title}`,
            });
            toast.success('Article added');
        }
        setIsDialogOpen(false);
        form.reset();
    };

    const categoryColors: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
        news: 'default',
        blog: 'secondary',
        press: 'outline',
        launch: 'destructive',
    };

    return (
        <AdminLayout title="News & Articles">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">News & Articles</h2>
                        <p className="text-muted-foreground">
                            Manage news articles, blog posts, and press releases
                        </p>
                    </div>
                    <Button onClick={handleAdd}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Article
                    </Button>
                </div>

                {/* Articles Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Articles ({newsArticles.length})</CardTitle>
                        <CardDescription>
                            Click on an article to edit or delete it
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Article</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Featured</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {newsArticles.map((article) => (
                                    <TableRow key={article.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={article.image.url}
                                                    alt={article.title}
                                                    className="h-12 w-16 rounded object-cover"
                                                />
                                                <div>
                                                    <p className="font-medium line-clamp-1">{article.title}</p>
                                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                                        {article.excerpt}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={categoryColors[article.category]}>
                                                {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{article.author}</TableCell>
                                        <TableCell>{format(new Date(article.publishDate), 'MMM d, yyyy')}</TableCell>
                                        <TableCell>
                                            <Badge variant={article.featured ? 'default' : 'secondary'}>
                                                {article.featured ? 'Featured' : 'Regular'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(article)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(article.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {newsArticles.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                            No articles yet. Add your first one!
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingArticle ? 'Edit Article' : 'Add Article'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingArticle
                                ? 'Update the article details below'
                                : 'Fill in the details to add a new article'}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Article title"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    if (!editingArticle) {
                                                        form.setValue('slug', generateSlug(e.target.value));
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
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
                            <FormField
                                control={form.control}
                                name="excerpt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Excerpt</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Brief summary of the article..."
                                                rows={2}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Full article content..."
                                                rows={6}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="news">News</SelectItem>
                                                    <SelectItem value="blog">Blog</SelectItem>
                                                    <SelectItem value="press">Press Release</SelectItem>
                                                    <SelectItem value="launch">Launch</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
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
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
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
                                    control={form.control}
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
                            </div>
                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tags (comma-separated)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="real estate, news, market" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="featured"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                        <div>
                                            <FormLabel>Featured</FormLabel>
                                            <p className="text-sm text-muted-foreground">
                                                Show this article prominently
                                            </p>
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
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editingArticle ? 'Update' : 'Add'} Article
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
