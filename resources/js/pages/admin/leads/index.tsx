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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dummyCareerApplications, dummyContactInquiries } from '@/data/dummy-data';
import { AdminLayout } from '@/layouts/admin-layout';
import type { CareerApplication, ContactInquiry } from '@/types/cms';
import { Download, Eye, Mail, Phone, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminLeadsPage() {
    const [inquiries, setInquiries] = useState<ContactInquiry[]>(dummyContactInquiries);
    const [applications, setApplications] = useState<CareerApplication[]>(
        dummyCareerApplications,
    );
    const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
    const [selectedApplication, setSelectedApplication] = useState<CareerApplication | null>(
        null,
    );

    const handleUpdateInquiryStatus = async (
        id: string,
        status: ContactInquiry['status'],
    ) => {
        setInquiries((prev) =>
            prev.map((i) => (i.id === id ? { ...i, status } : i)),
        );
        toast.success('Inquiry status updated!');
    };

    const handleUpdateApplicationStatus = async (
        id: string,
        status: CareerApplication['status'],
    ) => {
        setApplications((prev) =>
            prev.map((a) => (a.id === id ? { ...a, status } : a)),
        );
        toast.success('Application status updated!');
    };

    const handleDeleteInquiry = async (id: string) => {
        setInquiries((prev) => prev.filter((i) => i.id !== id));
        toast.success('Inquiry deleted!');
    };

    const handleDeleteApplication = async (id: string) => {
        setApplications((prev) => prev.filter((a) => a.id !== id));
        toast.success('Application deleted!');
    };

    const getInquiryStatusBadge = (status: ContactInquiry['status']) => {
        const variants: Record<
            ContactInquiry['status'],
            'default' | 'secondary' | 'destructive' | 'outline'
        > = {
            pending: 'destructive',
            responded: 'default',
            closed: 'secondary',
        };
        return <Badge variant={variants[status]}>{status}</Badge>;
    };

    const getApplicationStatusBadge = (status: CareerApplication['status']) => {
        const variants: Record<
            CareerApplication['status'],
            'default' | 'secondary' | 'destructive' | 'outline'
        > = {
            pending: 'outline',
            reviewed: 'default',
            shortlisted: 'secondary',
            rejected: 'destructive',
            hired: 'secondary',
        };
        return <Badge variant={variants[status]}>{status}</Badge>;
    };

    const handleExportInquiries = () => {
        const csv = [
            ['Name', 'Email', 'Phone', 'Subject', 'Status', 'Date'].join(','),
            ...inquiries.map((i) =>
                [
                    i.name,
                    i.email,
                    i.phone || '',
                    i.subject,
                    i.status,
                    i.createdAt,
                ].join(','),
            ),
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'contact-inquiries.csv';
        a.click();
        toast.success('Inquiries exported!');
    };

    const handleExportApplications = () => {
        const csv = [
            ['Name', 'Email', 'Phone', 'Job Title', 'Status', 'Date'].join(','),
            ...applications.map((a) =>
                [
                    a.name,
                    a.email,
                    a.phone,
                    a.jobTitle,
                    a.status,
                    a.createdAt,
                ].join(','),
            ),
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'career-applications.csv';
        a.click();
        toast.success('Applications exported!');
    };

    return (
        <AdminLayout title="Leads">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold">Leads Management</h2>
                    <p className="text-muted-foreground">
                        Manage contact inquiries and career applications
                    </p>
                </div>

                <Tabs defaultValue="inquiries">
                    <TabsList>
                        <TabsTrigger value="inquiries">
                            Contact Inquiries ({inquiries.length})
                        </TabsTrigger>
                        <TabsTrigger value="applications">
                            Career Applications ({applications.length})
                        </TabsTrigger>
                    </TabsList>

                    {/* Contact Inquiries Tab */}
                    <TabsContent value="inquiries" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Contact Inquiries</CardTitle>
                                        <CardDescription>
                                            All contact form submissions
                                        </CardDescription>
                                    </div>
                                    <Button variant="outline" onClick={handleExportInquiries}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Export CSV
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Contact</TableHead>
                                            <TableHead>Subject</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {inquiries.map((inquiry) => (
                                            <TableRow key={inquiry.id}>
                                                <TableCell className="font-medium">
                                                    {inquiry.name}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="flex items-center gap-1 text-sm">
                                                            <Mail className="h-3 w-3" />
                                                            {inquiry.email}
                                                        </span>
                                                        {inquiry.phone && (
                                                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                                                <Phone className="h-3 w-3" />
                                                                {inquiry.phone}
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="max-w-xs truncate">
                                                    {inquiry.subject}
                                                </TableCell>
                                                <TableCell>
                                                    <Select
                                                        value={inquiry.status}
                                                        onValueChange={(value) =>
                                                            handleUpdateInquiryStatus(
                                                                inquiry.id,
                                                                value as ContactInquiry['status'],
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="w-32">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="pending">Pending</SelectItem>
                                                            <SelectItem value="responded">
                                                                Responded
                                                            </SelectItem>
                                                            <SelectItem value="closed">
                                                                Closed
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell>
                                                    {inquiry.createdAt}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => setSelectedInquiry(inquiry)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleDeleteInquiry(inquiry.id)
                                                            }
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
                    </TabsContent>

                    {/* Career Applications Tab */}
                    <TabsContent value="applications" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Career Applications</CardTitle>
                                        <CardDescription>
                                            All job applications received
                                        </CardDescription>
                                    </div>
                                    <Button variant="outline" onClick={handleExportApplications}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Export CSV
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Contact</TableHead>
                                            <TableHead>Job Title</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {applications.map((application) => (
                                            <TableRow key={application.id}>
                                                <TableCell className="font-medium">
                                                    {application.name}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="flex items-center gap-1 text-sm">
                                                            <Mail className="h-3 w-3" />
                                                            {application.email}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                                            <Phone className="h-3 w-3" />
                                                            {application.phone}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{application.jobTitle}</TableCell>
                                                <TableCell>
                                                    <Select
                                                        value={application.status}
                                                        onValueChange={(value) =>
                                                            handleUpdateApplicationStatus(
                                                                application.id,
                                                                value as CareerApplication['status'],
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="w-32">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="pending">
                                                                Pending
                                                            </SelectItem>
                                                            <SelectItem value="reviewed">
                                                                Reviewed
                                                            </SelectItem>
                                                            <SelectItem value="shortlisted">
                                                                Shortlisted
                                                            </SelectItem>
                                                            <SelectItem value="rejected">
                                                                Rejected
                                                            </SelectItem>
                                                            <SelectItem value="hired">Hired</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell>
                                                    {application.createdAt}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                setSelectedApplication(application)
                                                            }
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                window.open(
                                                                    application.resume,
                                                                    '_blank',
                                                                );
                                                            }}
                                                        >
                                                            <Download className="mr-2 h-4 w-4" />
                                                            Resume
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                handleDeleteApplication(application.id)
                                                            }
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
                    </TabsContent>
                </Tabs>

                {/* Inquiry Detail Dialog */}
                <Dialog
                    open={!!selectedInquiry}
                    onOpenChange={() => setSelectedInquiry(null)}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Contact Inquiry Details</DialogTitle>
                            <DialogDescription>
                                Submitted on{' '}
                                {selectedInquiry && selectedInquiry.createdAt}
                            </DialogDescription>
                        </DialogHeader>
                        {selectedInquiry && (
                            <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium">Name</label>
                                        <p>{selectedInquiry.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Email</label>
                                        <p>{selectedInquiry.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Phone</label>
                                        <p>{selectedInquiry.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Status</label>
                                        <p>{getInquiryStatusBadge(selectedInquiry.status)}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Subject</label>
                                    <p>{selectedInquiry.subject}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Message</label>
                                    <p className="whitespace-pre-wrap rounded-md bg-muted p-3">
                                        {selectedInquiry.message}
                                    </p>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Application Detail Dialog */}
                <Dialog
                    open={!!selectedApplication}
                    onOpenChange={() => setSelectedApplication(null)}
                >
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Career Application Details</DialogTitle>
                            <DialogDescription>
                                Applied on{' '}
                                {selectedApplication && selectedApplication.createdAt}
                            </DialogDescription>
                        </DialogHeader>
                        {selectedApplication && (
                            <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium">Name</label>
                                        <p>{selectedApplication.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Email</label>
                                        <p>{selectedApplication.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Phone</label>
                                        <p>{selectedApplication.phone}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Job Title</label>
                                        <p>{selectedApplication.jobTitle}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Status</label>
                                        <p>
                                            {getApplicationStatusBadge(selectedApplication.status)}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Cover Letter</label>
                                    <p className="whitespace-pre-wrap rounded-md bg-muted p-3">
                                        {selectedApplication.coverLetter}
                                    </p>
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        onClick={() => {
                                            window.open(selectedApplication.resume, '_blank');
                                        }}
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Resume
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
