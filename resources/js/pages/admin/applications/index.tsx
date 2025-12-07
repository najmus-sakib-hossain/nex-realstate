import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { AdminLayout } from '@/layouts/admin-layout';
import { useCareerApplications, useUpdateApplicationStatus, useDeleteCareerApplication } from '@/hooks/use-cms';
import { useCMSStore } from '@/stores/cms-store';
import type { CareerApplication } from '@/types/cms';
import { format } from 'date-fns';
import { ChevronDown, ExternalLink, Eye, Mail, Phone, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminApplicationsPage() {
    const { careerApplications: storeApplications, setCareerApplications, addActivity } = useCMSStore();
    const { data: serverApplications } = useCareerApplications();
    const updateStatusMutation = useUpdateApplicationStatus();
    const deleteMutation = useDeleteCareerApplication();
    const careerApplications = serverApplications || storeApplications;
    const [selectedApplication, setSelectedApplication] = useState<CareerApplication | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

    const handleStatusChange = async (id: string, status: CareerApplication['status']) => {
        try {
            await updateStatusMutation.mutateAsync({ id, status });
            const updated = careerApplications.map((app) =>
                app.id === id ? { ...app, status, updatedAt: new Date().toISOString() } : app,
            );
            setCareerApplications(updated);
            const app = careerApplications.find(a => a.id === id);
            addActivity({
                type: 'status_change',
                entity: 'application',
                entityId: id,
                entityName: app?.name || 'Application',
                description: `Changed application status to ${status}`,
            });
            toast.success(`Application status updated to ${status}`);
        } catch {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(id);
            const app = careerApplications.find(a => a.id === id);
            setCareerApplications(careerApplications.filter((a) => a.id !== id));
            addActivity({
                type: 'delete',
                entity: 'application',
                entityId: id,
                entityName: app?.name || 'Application',
                description: `Deleted application from ${app?.name}`,
            });
            toast.success('Application deleted');
        } catch {
            toast.error('Failed to delete application');
        }
    };

    const handleView = (application: CareerApplication) => {
        setSelectedApplication(application);
        setIsViewDialogOpen(true);
    };

    const statusColors: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
        pending: 'secondary',
        reviewed: 'outline',
        shortlisted: 'default',
        rejected: 'destructive',
        hired: 'default',
    };

    const statusOptions: CareerApplication['status'][] = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'];

    const pendingCount = careerApplications.filter(a => a.status === 'pending').length;
    const shortlistedCount = careerApplications.filter(a => a.status === 'shortlisted').length;
    const hiredCount = careerApplications.filter(a => a.status === 'hired').length;

    return (
        <AdminLayout title="Job Applications">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Job Applications</h2>
                        <p className="text-muted-foreground">
                            Review and manage job applications
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{careerApplications.length}</div>
                            <p className="text-sm text-muted-foreground">Total Applications</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-chart-4">{pendingCount}</div>
                            <p className="text-sm text-muted-foreground">Pending Review</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-primary">{shortlistedCount}</div>
                            <p className="text-sm text-muted-foreground">Shortlisted</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold text-chart-2">{hiredCount}</div>
                            <p className="text-sm text-muted-foreground">Hired</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Applications Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Applications</CardTitle>
                        <CardDescription>
                            Click on an application to view details or change status
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Applicant</TableHead>
                                    <TableHead>Position</TableHead>
                                    <TableHead>Applied On</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {careerApplications.map((application) => (
                                    <TableRow key={application.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{application.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {application.email}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{application.jobTitle}</TableCell>
                                        <TableCell>
                                            {format(new Date(application.createdAt), 'MMM d, yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                                                        <Badge variant={statusColors[application.status]}>
                                                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                                        </Badge>
                                                        <ChevronDown className="h-3 w-3" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    {statusOptions.map((status) => (
                                                        <DropdownMenuItem
                                                            key={status}
                                                            onClick={() => handleStatusChange(application.id, status)}
                                                        >
                                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleView(application)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(application.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {careerApplications.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                                            No applications yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* View Application Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Application Details</DialogTitle>
                        <DialogDescription>
                            {selectedApplication?.jobTitle}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedApplication && (
                        <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Applicant</p>
                                    <p className="font-medium">{selectedApplication.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                                    <Badge variant={statusColors[selectedApplication.status]}>
                                        {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                                    </Badge>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <a href={`mailto:${selectedApplication.email}`} className="text-primary hover:underline">
                                        {selectedApplication.email}
                                    </a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <a href={`tel:${selectedApplication.phone}`} className="hover:underline">
                                        {selectedApplication.phone}
                                    </a>
                                </div>
                            </div>
                            {selectedApplication.linkedIn && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">LinkedIn</p>
                                    <a
                                        href={selectedApplication.linkedIn}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-primary hover:underline"
                                    >
                                        View Profile <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>
                            )}
                            {selectedApplication.portfolio && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Portfolio</p>
                                    <a
                                        href={selectedApplication.portfolio}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-primary hover:underline"
                                    >
                                        View Portfolio <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>
                            )}
                            {selectedApplication.resume && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Resume</p>
                                    <a
                                        href={selectedApplication.resume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-primary hover:underline"
                                    >
                                        Download Resume <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>
                            )}
                            {selectedApplication.coverLetter && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Cover Letter</p>
                                    <p className="text-sm">{selectedApplication.coverLetter}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Applied On</p>
                                <p className="text-sm">
                                    {format(new Date(selectedApplication.createdAt), 'MMMM d, yyyy \'at\' h:mm a')}
                                </p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
