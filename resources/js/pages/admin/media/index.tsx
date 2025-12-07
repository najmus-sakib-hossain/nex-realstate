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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { dummyNewsArticles } from '@/data/dummy-data';
import { AdminLayout } from '@/layouts/admin-layout';
import type { NewsArticle } from '@/types/cms';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const emptyArticle: Partial<NewsArticle> = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'news',
    author: '',
    publishDate: new Date().toISOString(),
    featured: false,
    tags: [],
};

export default function AdminMediaPage() {
    const [articles, setArticles] = useState<NewsArticle[]>(dummyNewsArticles);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Partial<NewsArticle> | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>('all');

    const filteredArticles = articles.filter((article) => {
        if (activeTab === 'all') return true;
        return article.category === activeTab;
    });

    const handleCreate = () => {
        setEditingArticle({
            ...emptyArticle,
            id: `article-${Date.now()}`,
        });
        setIsDialogOpen(true);
    };

    const handleEdit = (article: NewsArticle) => {
        setEditingArticle({ ...article });
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!editingArticle) return;

        await new Promise((resolve) => setTimeout(resolve, 500));

        if (articles.find((a) => a.id === editingArticle.id)) {
            setArticles((prev) =>
                prev.map((a) =>
                    a.id === editingArticle.id ? (editingArticle as NewsArticle) : a,
                ),
            );
            toast.success('Article updated successfully!');
        } else {
            setArticles((prev) => [...prev, editingArticle as NewsArticle]);
            toast.success('Article created successfully!');
        }

        setIsDialogOpen(false);
        setEditingArticle(null);
    };

    const handleDelete = async (id: string) => {
        setIsDeleting(id);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setArticles((prev) => prev.filter((a) => a.id !== id));
        toast.success('Article deleted successfully!');
        setIsDeleting(null);
    };

    const handleToggleFeatured = async (id: string, featured: boolean) => {
        setArticles((prev) =>
            prev.map((a) => (a.id === id ? { ...a, featured } : a)),
        );
        toast.success(`Article ${featured ? 'featured' : 'unfeatured'} successfully!`);
    };

    const getCategoryBadge = (category: NewsArticle['category']) => {
        const variants: Record<
            NewsArticle['category'],
            'default' | 'secondary' | 'destructive' | 'outline'
        > = {
            news: 'default',
            blog: 'secondary',
            press: 'outline',
            launch: 'destructive',
        };
        return <Badge variant={variants[category]}>{category}</Badge>;
    };

    return (
        <AdminLayout title="Media & News">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Media & News</h2>
                        <p className="text-muted-foreground">
                            Manage news articles, blog posts, and press releases
                        </p>
                    </div>
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Article
                    </Button>
                </div>

                {/* Articles Table with Tabs */}
                <Card>
                    <CardHeader>
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <div className="flex items-center justify-between">
                                <CardTitle>All Articles</CardTitle>
                                <TabsList>
                                    <TabsTrigger value="all">All</TabsTrigger>
                                    <TabsTrigger value="news">News</TabsTrigger>
                                    <TabsTrigger value="blog">Blog</TabsTrigger>
                                    <TabsTrigger value="press">Press</TabsTrigger>
                                    <TabsTrigger value="launch">Launch</TabsTrigger>
                                </TabsList>
                            </div>
                        </Tabs>
                        <CardDescription>
                            {filteredArticles.length} article(s) found
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Published</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredArticles.map((article) => (
                                    <TableRow key={article.id}>
                                        <TableCell>
                                            <img
                                                src={article.image.url}
                                                alt={article.title}
                                                className="h-12 w-16 rounded object-cover"
                                            />
                                        </TableCell>
                                        <TableCell className="max-w-xs font-medium">
                                            <div className="truncate">{article.title}</div>
                                            {article.featured && (
                                                <Badge variant="outline" className="mt-1">
                                                    Featured
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {getCategoryBadge(article.category)}
                                        </TableCell>
                                        <TableCell>{article.author}</TableCell>
                                        <TableCell>
                                            {new Date(article.publishDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={article.featured}
                                                onCheckedChange={(checked) =>
                                                    handleToggleFeatured(article.id, checked)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
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
                                                    disabled={isDeleting === article.id}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Edit/Create Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingArticle?.id?.startsWith('article-')
                                    ? 'Add New Article'
                                    : 'Edit Article'}
                            </DialogTitle>
                            <DialogDescription>
                                Fill in the article details below
                            </DialogDescription>
                        </DialogHeader>

                        {editingArticle && (
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input
                                        value={editingArticle.title}
                                        onChange={(e) =>
                                            setEditingArticle((prev) => ({
                                                ...prev!,
                                                title: e.target.value,
                                                slug: e.target.value
                                                    .toLowerCase()
                                                    .replace(/\s+/g, '-'),
                                            }))
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Excerpt</Label>
                                    <Textarea
                                        value={editingArticle.excerpt}
                                        onChange={(e) =>
                                            setEditingArticle((prev) => ({
                                                ...prev!,
                                                excerpt: e.target.value,
                                            }))
                                        }
                                        rows={2}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Content</Label>
                                    <Textarea
                                        value={editingArticle.content}
                                        onChange={(e) =>
                                            setEditingArticle((prev) => ({
                                                ...prev!,
                                                content: e.target.value,
                                            }))
                                        }
                                        rows={8}
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Select
                                            value={editingArticle.category}
                                            onValueChange={(value) =>
                                                setEditingArticle((prev) => ({
                                                    ...prev!,
                                                    category: value as NewsArticle['category'],
                                                }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="news">News</SelectItem>
                                                <SelectItem value="blog">Blog</SelectItem>
                                                <SelectItem value="press">Press</SelectItem>
                                                <SelectItem value="launch">Launch</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Publish Date</Label>
                                        <Input
                                            type="date"
                                            value={
                                                editingArticle.publishDate
                                                    ? new Date(editingArticle.publishDate)
                                                          .toISOString()
                                                          .split('T')[0]
                                                    : ''
                                            }
                                            onChange={(e) =>
                                                setEditingArticle((prev) => ({
                                                    ...prev!,
                                                    publishDate: new Date(
                                                        e.target.value,
                                                    ).toISOString(),
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Author</Label>
                                        <Input
                                            value={editingArticle.author}
                                            onChange={(e) =>
                                                setEditingArticle((prev) => ({
                                                    ...prev!,
                                                    author: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Tags (comma separated)</Label>
                                    <Input
                                        value={editingArticle.tags?.join(', ')}
                                        onChange={(e) =>
                                            setEditingArticle((prev) => ({
                                                ...prev!,
                                                tags: e.target.value
                                                    .split(',')
                                                    .map((s) => s.trim())
                                                    .filter(Boolean),
                                            }))
                                        }
                                        placeholder="real estate, construction, news"
                                    />
                                </div>

                                <div className="flex gap-6">
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            id="featured"
                                            checked={editingArticle.featured}
                                            onCheckedChange={(checked) =>
                                                setEditingArticle((prev) => ({
                                                    ...prev!,
                                                    featured: checked,
                                                }))
                                            }
                                        />
                                        <Label htmlFor="featured">Featured</Label>
                                    </div>
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>Save Article</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
