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
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
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
import AdminLayout from '@/layouts/admin-layout';
import { useContactInquiries, useUpdateInquiryStatus, useDeleteContactInquiry } from '@/hooks/use-cms';
import { useCMSStore } from '@/stores/cms-store';
import { ContactInquiry } from '@/types/cms';
import { Head } from '@inertiajs/react';
import {
    CheckCircle,
    Clock,
    Eye,
    Mail,
    MoreHorizontal,
    Phone,
    Search,
    Trash2,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

const statusConfig: Record<
    ContactInquiry['status'],
    { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }
> = {
    pending: { label: 'Pending', variant: 'default', icon: <Clock className="h-3 w-3" /> },
    responded: { label: 'Responded', variant: 'outline', icon: <CheckCircle className="h-3 w-3" /> },
    closed: { label: 'Closed', variant: 'secondary', icon: <XCircle className="h-3 w-3" /> },
};

export default function InquiriesIndex() {
    const { contactInquiries: storeInquiries, updateInquiryStatus, deleteInquiry, addActivity } = useCMSStore();
    const { data: serverInquiries } = useContactInquiries();
    const updateStatusMutation = useUpdateInquiryStatus();
    const deleteMutation = useDeleteContactInquiry();
    const contactInquiries = serverInquiries || storeInquiries;
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

    // Filter inquiries
    const filteredInquiries = contactInquiries.filter((inquiry) => {
        const matchesSearch =
            inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inquiry.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inquiry.message.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleStatusChange = async (id: string, status: ContactInquiry['status']) => {
        try {
            await updateStatusMutation.mutateAsync({ id, status });
            updateInquiryStatus(id, status);
            addActivity({
                type: 'status_change',
                entity: 'Contact Inquiry',
                entityId: id,
                entityName: contactInquiries.find((i) => i.id === id)?.name || 'Unknown',
                description: `Updated inquiry status to ${status}`,
            });
        } catch {
            // Error handled by mutation
        }
    };

    const handleDelete = async (id: string) => {
        const inquiry = contactInquiries.find((i) => i.id === id);
        if (inquiry && confirm('Are you sure you want to delete this inquiry?')) {
            try {
                await deleteMutation.mutateAsync(id);
                deleteInquiry(id);
                addActivity({
                    type: 'delete',
                    entity: 'Contact Inquiry',
                    entityId: id,
                    entityName: inquiry.name,
                    description: `Deleted contact inquiry from ${inquiry.name}`,
                });
            } catch {
                // Error handled by mutation
            }
        }
    };

    const handleViewInquiry = (inquiry: ContactInquiry) => {
        setSelectedInquiry(inquiry);
        setIsViewDialogOpen(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Stats
    const stats = {
        total: contactInquiries.length,
        pending: contactInquiries.filter((i) => i.status === 'pending').length,
        responded: contactInquiries.filter((i) => i.status === 'responded').length,
        closed: contactInquiries.filter((i) => i.status === 'closed').length,
    };

    return (
        <AdminLayout>
            <Head title="Contact Inquiries" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Contact Inquiries</h1>
                    <p className="text-muted-foreground">View and manage contact form submissions</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total</CardDescription>
                            <CardTitle className="text-2xl">{stats.total}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Pending</CardDescription>
                            <CardTitle className="text-2xl text-primary">{stats.pending}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Responded</CardDescription>
                            <CardTitle className="text-2xl text-chart-2">{stats.responded}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Closed</CardDescription>
                            <CardTitle className="text-2xl text-muted-foreground">{stats.closed}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Inquiries</CardTitle>
                        <CardDescription>
                            {filteredInquiries.length} of {contactInquiries.length} inquiries
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Search and Filter */}
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, email, subject..."
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="responded">Responded</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Table */}
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="w-[70px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredInquiries.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                No inquiries found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredInquiries.map((inquiry) => {
                                            const status = statusConfig[inquiry.status];
                                            return (
                                                <TableRow
                                                    key={inquiry.id}
                                                    className={inquiry.status === 'pending' ? 'bg-primary/5' : ''}
                                                >
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{inquiry.name}</span>
                                                            <span className="text-sm text-muted-foreground">
                                                                {inquiry.email}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="line-clamp-1">{inquiry.subject}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="capitalize">
                                                            {inquiry.type}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={status.variant} className="gap-1">
                                                            {status.icon}
                                                            {status.label}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {formatDate(inquiry.createdAt)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                    <span className="sr-only">Open menu</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleViewInquiry(inquiry)}
                                                                >
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View Details
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuLabel className="text-xs text-muted-foreground">
                                                                    Change Status
                                                                </DropdownMenuLabel>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleStatusChange(inquiry.id, 'pending')}
                                                                    disabled={inquiry.status === 'pending'}
                                                                >
                                                                    <Clock className="mr-2 h-4 w-4" />
                                                                    Mark as Pending
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleStatusChange(inquiry.id, 'responded')}
                                                                    disabled={inquiry.status === 'responded'}
                                                                >
                                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                                    Mark as Responded
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleStatusChange(inquiry.id, 'closed')}
                                                                    disabled={inquiry.status === 'closed'}
                                                                >
                                                                    <XCircle className="mr-2 h-4 w-4" />
                                                                    Close Inquiry
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() => handleDelete(inquiry.id)}
                                                                    className="text-destructive focus:text-destructive"
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* View Inquiry Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Inquiry Details</DialogTitle>
                        <DialogDescription>
                            Submitted on {selectedInquiry && formatDate(selectedInquiry.createdAt)}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedInquiry && (
                        <div className="space-y-6">
                            {/* Contact Info */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                                    <p className="font-medium">{selectedInquiry.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                                    <div>
                                        <Badge variant={statusConfig[selectedInquiry.status].variant} className="gap-1">
                                            {statusConfig[selectedInquiry.status].icon}
                                            {statusConfig[selectedInquiry.status].label}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <a href={`mailto:${selectedInquiry.email}`} className="text-primary hover:underline">
                                            {selectedInquiry.email}
                                        </a>
                                    </div>
                                </div>
                                {selectedInquiry.phone && (
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-muted-foreground">Phone</label>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <a href={`tel:${selectedInquiry.phone}`} className="text-primary hover:underline">
                                                {selectedInquiry.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Type and Subject */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-muted-foreground">Inquiry Type</label>
                                    <Badge variant="outline" className="capitalize">
                                        {selectedInquiry.type}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-muted-foreground">Subject</label>
                                    <p className="font-medium">{selectedInquiry.subject}</p>
                                </div>
                            </div>

                            {/* Property Interest */}
                            {selectedInquiry.propertyInterest && (
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-muted-foreground">Property Interest</label>
                                    <p>{selectedInquiry.propertyInterest}</p>
                                </div>
                            )}

                            {/* Scheduled Visit */}
                            {selectedInquiry.scheduledVisit && (
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-muted-foreground">Scheduled Visit</label>
                                    <p>{formatDate(selectedInquiry.scheduledVisit)}</p>
                                </div>
                            )}

                            {/* Message */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-muted-foreground">Message</label>
                                <div className="rounded-lg border bg-muted/50 p-4">
                                    <p className="whitespace-pre-wrap">{selectedInquiry.message}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                                    Close
                                </Button>
                                <Button
                                    onClick={() => {
                                        handleStatusChange(selectedInquiry.id, 'responded');
                                        window.location.href = `mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject}`;
                                    }}
                                >
                                    <Mail className="mr-2 h-4 w-4" />
                                    Reply via Email
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
