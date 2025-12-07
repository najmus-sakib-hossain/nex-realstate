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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { AdminLayout } from '@/layouts/admin-layout';
import { useCMSStore } from '@/stores/cms-store';
import { useTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial } from '@/hooks/use-cms';
import type { Testimonial } from '@/types/cms';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Plus, Star, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const testimonialSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    position: z.string().min(1, 'Position is required'),
    company: z.string().optional(),
    content: z.string().min(10, 'Content must be at least 10 characters'),
    rating: z.number().min(1).max(5),
    image: z.object({
        id: z.string(),
        url: z.string().url('Must be a valid URL'),
        alt: z.string(),
    }),
    featured: z.boolean(),
});

type TestimonialFormData = z.infer<typeof testimonialSchema>;

export default function AdminTestimonialsPage() {
    const { testimonials, setTestimonials, addActivity } = useCMSStore();
    const { data: serverTestimonials } = useTestimonials();
    const createTestimonial = useCreateTestimonial();
    const updateTestimonialMutation = useUpdateTestimonial();
    const deleteTestimonialMutation = useDeleteTestimonial();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

    useEffect(() => {
        if (serverTestimonials) setTestimonials(serverTestimonials);
    }, [serverTestimonials, setTestimonials]);

    const form = useForm<TestimonialFormData>({
        resolver: zodResolver(testimonialSchema),
        defaultValues: {
            name: '',
            position: '',
            company: '',
            content: '',
            rating: 5,
            image: { id: '', url: '', alt: '' },
            featured: false,
        },
    });

    const handleEdit = (testimonial: Testimonial) => {
        setEditingTestimonial(testimonial);
        form.reset({
            name: testimonial.name,
            position: testimonial.position,
            company: testimonial.company || '',
            content: testimonial.content,
            rating: testimonial.rating,
            image: testimonial.image,
            featured: testimonial.featured,
        });
        setIsDialogOpen(true);
    };

    const handleAdd = () => {
        setEditingTestimonial(null);
        form.reset({
            name: '',
            position: '',
            company: '',
            content: '',
            rating: 5,
            image: { id: '', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200', alt: '' },
            featured: false,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        const testimonial = testimonials.find((t) => t.id === id);
        try {
            await deleteTestimonialMutation.mutateAsync(id);
            setTestimonials(testimonials.filter((t) => t.id !== id));
            addActivity({
                type: 'delete',
                entity: 'testimonial',
                entityId: id,
                entityName: testimonial?.name || 'Testimonial',
                description: `Deleted testimonial from ${testimonial?.name}`,
            });
            toast.success('Testimonial deleted');
        } catch {
            toast.error('Failed to delete testimonial');
        }
    };

    const onSubmit = async (data: TestimonialFormData) => {
        if (editingTestimonial) {
            try {
                const updated = await updateTestimonialMutation.mutateAsync({ id: editingTestimonial.id, data: data as any });
                setTestimonials(testimonials.map((t) => (t.id === editingTestimonial.id ? { ...t, ...updated } : t)));
                addActivity({
                    type: 'update',
                    entity: 'testimonial',
                    entityId: editingTestimonial.id,
                    entityName: data.name,
                    description: `Updated testimonial from ${data.name}`,
                });
                toast.success('Testimonial updated');
            } catch {
                toast.error('Failed to update testimonial');
            }
        } else {
            try {
                const created = await createTestimonial.mutateAsync(data as any);
                setTestimonials([...testimonials, created as Testimonial]);
                addActivity({
                    type: 'create',
                    entity: 'testimonial',
                    entityId: (created as Testimonial).id,
                    entityName: data.name,
                    description: `Added new testimonial from ${data.name}`,
                });
                toast.success('Testimonial added');
            } catch {
                toast.error('Failed to create testimonial');
            }
        }
        setIsDialogOpen(false);
        form.reset();
    };

    return (
        <AdminLayout title="Testimonials">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Testimonials</h2>
                        <p className="text-muted-foreground">
                            Manage customer testimonials and reviews
                        </p>
                    </div>
                    <Button onClick={handleAdd}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Testimonial
                    </Button>
                </div>

                {/* Testimonials Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Testimonials ({testimonials.length})</CardTitle>
                        <CardDescription>
                            Click on a testimonial to edit or delete it
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Person</TableHead>
                                    <TableHead>Position</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Featured</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {testimonials.map((testimonial) => (
                                    <TableRow key={testimonial.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={testimonial.image.url}
                                                    alt={testimonial.name}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                                <div>
                                                    <p className="font-medium">{testimonial.name}</p>
                                                    {testimonial.company && (
                                                        <p className="text-sm text-muted-foreground">
                                                            {testimonial.company}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{testimonial.position}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${
                                                            i < testimonial.rating
                                                                ? 'fill-chart-4 text-chart-4'
                                                                : 'text-muted'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={testimonial.featured ? 'default' : 'secondary'}>
                                                {testimonial.featured ? 'Featured' : 'Regular'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(testimonial)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(testimonial.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {testimonials.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                                            No testimonials yet. Add your first one!
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
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingTestimonial
                                ? 'Update the testimonial details below'
                                : 'Fill in the details to add a new testimonial'}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="position"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Position</FormLabel>
                                            <FormControl>
                                                <Input placeholder="CEO" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="company"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company (optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Company Name" {...field} />
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
                                        <FormLabel>Testimonial Content</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="What they said about you..."
                                                rows={4}
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
                                    name="rating"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Rating (1-5)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    max={5}
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
                                                />
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
                                            <FormLabel>Photo URL</FormLabel>
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
                                name="featured"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                        <div>
                                            <FormLabel>Featured</FormLabel>
                                            <p className="text-sm text-muted-foreground">
                                                Show this testimonial prominently
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
                                    {editingTestimonial ? 'Update' : 'Add'} Testimonial
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
