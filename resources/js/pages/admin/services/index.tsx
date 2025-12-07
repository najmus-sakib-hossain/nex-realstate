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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { dummyServices } from '@/data/dummy-data';
import { useServices, useCreateService, useUpdateService, useDeleteService } from '@/hooks/use-cms';
import { AdminLayout } from '@/layouts/admin-layout';
import type { Service } from '@/types/cms';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const emptyService: Partial<Service> = {
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    icon: '',
    order: 0,
    features: [],
};

export default function AdminServicesPage() {
    const { data: serverServices } = useServices();
    const createService = useCreateService();
    const updateService = useUpdateService();
    const deleteService = useDeleteService();
    const [services, setServices] = useState<Service[]>(serverServices || dummyServices);

    useEffect(() => {
        if (serverServices) setServices(serverServices);
    }, [serverServices]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleCreate = () => {
        setEditingService({
            ...emptyService,
            id: `service-${Date.now()}`,
            order: services.length + 1,
        });
        setIsDialogOpen(true);
    };

    const handleEdit = (service: Service) => {
        setEditingService({ ...service });
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!editingService) return;

        try {
            if (services.find((s) => s.id === editingService.id)) {
                await updateService.mutateAsync({ id: editingService.id!, data: editingService as Partial<Service> });
                toast.success('Service updated successfully!');
            } else {
                const payload = { ...editingService } as any;
                await createService.mutateAsync(payload);
                toast.success('Service created successfully!');
            }
            setIsDialogOpen(false);
            setEditingService(null);
        } catch {
            toast.error('Failed to save service');
        }
    };

    const handleDelete = async (id: string) => {
        setIsDeleting(id);
        try {
            await deleteService.mutateAsync(id);
            toast.success('Service deleted successfully!');
        } catch {
            toast.error('Failed to delete service');
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <AdminLayout title="Services">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Services</h2>
                        <p className="text-muted-foreground">
                            Manage all company services
                        </p>
                    </div>
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Service
                    </Button>
                </div>

                {/* Services Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Services</CardTitle>
                        <CardDescription>
                            A list of all services offered by the company
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Icon</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Order</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {services
                                    .sort((a, b) => a.order - b.order)
                                    .map((service) => (
                                        <TableRow key={service.id}>
                                            <TableCell>
                                                <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg text-lg">
                                                    {service.icon}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {service.title}
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate">
                                                {service.shortDescription}
                                            </TableCell>
                                            <TableCell>{service.order}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEdit(service)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(service.id)}
                                                        disabled={isDeleting === service.id}
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
                    <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingService?.id?.startsWith('service-')
                                    ? 'Add New Service'
                                    : 'Edit Service'}
                            </DialogTitle>
                            <DialogDescription>
                                Fill in the service details below
                            </DialogDescription>
                        </DialogHeader>

                        {editingService && (
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Service Title</Label>
                                        <Input
                                            value={editingService.title}
                                            onChange={(e) =>
                                                setEditingService((prev) => ({
                                                    ...prev!,
                                                    title: e.target.value,
                                                    slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Icon (emoji or icon name)</Label>
                                        <Input
                                            value={editingService.icon}
                                            onChange={(e) =>
                                                setEditingService((prev) => ({
                                                    ...prev!,
                                                    icon: e.target.value,
                                                }))
                                            }
                                            placeholder="🏢 or building"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Short Description</Label>
                                    <Textarea
                                        value={editingService.shortDescription}
                                        onChange={(e) =>
                                            setEditingService((prev) => ({
                                                ...prev!,
                                                shortDescription: e.target.value,
                                            }))
                                        }
                                        rows={2}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Full Description</Label>
                                    <Textarea
                                        value={editingService.fullDescription}
                                        onChange={(e) =>
                                            setEditingService((prev) => ({
                                                ...prev!,
                                                fullDescription: e.target.value,
                                            }))
                                        }
                                        rows={4}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Display Order</Label>
                                    <Input
                                        type="number"
                                        value={editingService.order}
                                        onChange={(e) =>
                                            setEditingService((prev) => ({
                                                ...prev!,
                                                order: parseInt(e.target.value) || 0,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Features (comma separated)</Label>
                                    <Input
                                        value={editingService.features?.join(', ')}
                                        onChange={(e) =>
                                            setEditingService((prev) => ({
                                                ...prev!,
                                                features: e.target.value
                                                    .split(',')
                                                    .map((s) => s.trim())
                                                    .filter(Boolean),
                                            }))
                                        }
                                        placeholder="Quality materials, Expert team, Fast delivery"
                                    />
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>Save Service</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
