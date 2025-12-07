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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { dummyProjects } from '@/data/dummy-data';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '@/hooks/use-cms';
import { AdminLayout } from '@/layouts/admin-layout';
import type { Project } from '@/types/cms';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const emptyProject: Partial<Project> = {
    title: '',
    slug: '',
    description: '',
    fullDescription: '',
    status: 'upcoming',
    location: '',
    address: '',
    category: 'residential',
    price: '',
    features: [],
    amenities: [],
    featured: false,
    images: [],
    specifications: {},
};

export default function AdminProjectsPage() {
    const { data: serverProjects } = useProjects();
    const createProject = useCreateProject();
    const updateProject = useUpdateProject();
    const deleteProject = useDeleteProject();
    const [projects, setProjects] = useState<Project[]>(serverProjects || dummyProjects);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    useEffect(() => {
        if (serverProjects) {
            setProjects(serverProjects);
        }
    }, [serverProjects]);

    const handleCreate = () => {
        setEditingProject({ ...emptyProject, id: `project-${Date.now()}` });
        setIsDialogOpen(true);
    };

    const handleEdit = (project: Project) => {
        setEditingProject({ ...project });
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!editingProject) return;

        try {
            if (projects.find((p) => p.id === editingProject.id)) {
                await updateProject.mutateAsync({ id: editingProject.id!, data: editingProject as Partial<Project> });
                toast.success('Project updated successfully!');
            } else {
                // create expects project without id/createdAt/updatedAt
                const payload = { ...editingProject } as any;
                await createProject.mutateAsync(payload);
                toast.success('Project created successfully!');
            }
            setIsDialogOpen(false);
            setEditingProject(null);
        } catch {
            toast.error('Failed to save project');
        }
    };

    const handleDelete = async (id: string) => {
        setIsDeleting(id);
        try {
            await deleteProject.mutateAsync(id);
            toast.success('Project deleted successfully!');
        } catch {
            toast.error('Failed to delete project');
        } finally {
            setIsDeleting(null);
        }
    };

    const getStatusBadge = (status: Project['status']) => {
        const variants: Record<Project['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
            ongoing: 'default',
            completed: 'secondary',
            upcoming: 'outline',
        };
        return <Badge variant={variants[status]}>{status}</Badge>;
    };

    return (
        <AdminLayout title="Projects">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Projects</h2>
                        <p className="text-muted-foreground">
                            Manage all real estate projects
                        </p>
                    </div>
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Project
                    </Button>
                </div>

                {/* Projects Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Projects</CardTitle>
                        <CardDescription>
                            A list of all projects in the system
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Featured</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.map((project) => (
                                    <TableRow key={project.id}>
                                        <TableCell>
                                            <img
                                                src={project.images[0]?.url || 'https://placehold.co/80x60'}
                                                alt={project.title}
                                                className="h-12 w-16 rounded object-cover"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {project.title}
                                        </TableCell>
                                        <TableCell className="capitalize">
                                            {project.category}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(project.status)}</TableCell>
                                        <TableCell>{project.location}</TableCell>
                                        <TableCell>{project.price}</TableCell>
                                        <TableCell>
                                            {project.featured ? (
                                                <Badge variant="default">Yes</Badge>
                                            ) : (
                                                <Badge variant="outline">No</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(project)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(project.id)}
                                                    disabled={isDeleting === project.id}
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
                                {editingProject?.id?.startsWith('project-')
                                    ? 'Add New Project'
                                    : 'Edit Project'}
                            </DialogTitle>
                            <DialogDescription>
                                Fill in the project details below
                            </DialogDescription>
                        </DialogHeader>

                        {editingProject && (
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Project Title</Label>
                                        <Input
                                            value={editingProject.title}
                                            onChange={(e) =>
                                                setEditingProject((prev) => ({
                                                    ...prev!,
                                                    title: e.target.value,
                                                    slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Price</Label>
                                        <Input
                                            value={editingProject.price}
                                            onChange={(e) =>
                                                setEditingProject((prev) => ({
                                                    ...prev!,
                                                    price: e.target.value,
                                                }))
                                            }
                                            placeholder="Starting from ৳X Crore"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Short Description</Label>
                                    <Textarea
                                        value={editingProject.description}
                                        onChange={(e) =>
                                            setEditingProject((prev) => ({
                                                ...prev!,
                                                description: e.target.value,
                                            }))
                                        }
                                        rows={2}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Full Description</Label>
                                    <Textarea
                                        value={editingProject.fullDescription}
                                        onChange={(e) =>
                                            setEditingProject((prev) => ({
                                                ...prev!,
                                                fullDescription: e.target.value,
                                            }))
                                        }
                                        rows={4}
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label>Status</Label>
                                        <Select
                                            value={editingProject.status}
                                            onValueChange={(value) =>
                                                setEditingProject((prev) => ({
                                                    ...prev!,
                                                    status: value as Project['status'],
                                                }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                                <SelectItem value="ongoing">Ongoing</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Select
                                            value={editingProject.category}
                                            onValueChange={(value) =>
                                                setEditingProject((prev) => ({
                                                    ...prev!,
                                                    category: value as Project['category'],
                                                }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="residential">Residential</SelectItem>
                                                <SelectItem value="commercial">Commercial</SelectItem>
                                                <SelectItem value="land">Land</SelectItem>
                                                <SelectItem value="resort">Resort</SelectItem>
                                                <SelectItem value="hospital">Hospital</SelectItem>
                                                <SelectItem value="hotel">Hotel</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Featured</Label>
                                        <Select
                                            value={editingProject.featured ? 'yes' : 'no'}
                                            onValueChange={(value) =>
                                                setEditingProject((prev) => ({
                                                    ...prev!,
                                                    featured: value === 'yes',
                                                }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="yes">Yes</SelectItem>
                                                <SelectItem value="no">No</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Location</Label>
                                        <Input
                                            value={editingProject.location}
                                            onChange={(e) =>
                                                setEditingProject((prev) => ({
                                                    ...prev!,
                                                    location: e.target.value,
                                                }))
                                            }
                                            placeholder="Gulshan, Dhaka"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Full Address</Label>
                                        <Input
                                            value={editingProject.address}
                                            onChange={(e) =>
                                                setEditingProject((prev) => ({
                                                    ...prev!,
                                                    address: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Features (comma separated)</Label>
                                    <Input
                                        value={editingProject.features?.join(', ')}
                                        onChange={(e) =>
                                            setEditingProject((prev) => ({
                                                ...prev!,
                                                features: e.target.value.split(',').map((s) => s.trim()),
                                            }))
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Amenities (comma separated)</Label>
                                    <Input
                                        value={editingProject.amenities?.join(', ')}
                                        onChange={(e) =>
                                            setEditingProject((prev) => ({
                                                ...prev!,
                                                amenities: e.target.value.split(',').map((s) => s.trim()),
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>Save Project</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
