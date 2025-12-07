import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, BarChart, PieChartComponent } from '@/components/ui/chart';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { AdminLayout } from '@/layouts/admin-layout';
import { useCMSStore, type ActivityLogEntry } from '@/stores/cms-store';
import { motion } from 'motion/react';
import {
    Activity,
    ArrowUpRight,
    Briefcase,
    Building2,
    FileEdit,
    Mail,
    Newspaper,
    Plus,
    Settings,
    Trash2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Mock data for charts
const monthlyData = [
    { month: 'Jan', inquiries: 12, applications: 4 },
    { month: 'Feb', inquiries: 19, applications: 6 },
    { month: 'Mar', inquiries: 15, applications: 5 },
    { month: 'Apr', inquiries: 22, applications: 8 },
    { month: 'May', inquiries: 18, applications: 7 },
    { month: 'Jun', inquiries: 25, applications: 9 },
];

const projectStatusData = [
    { name: 'Ongoing', value: 3 },
    { name: 'Completed', value: 5 },
    { name: 'Upcoming', value: 2 },
];

const trafficData = [
    { month: 'Jan', visitors: 1200 },
    { month: 'Feb', visitors: 1800 },
    { month: 'Mar', visitors: 1600 },
    { month: 'Apr', visitors: 2200 },
    { month: 'May', visitors: 2800 },
    { month: 'Jun', visitors: 3200 },
];

function getActivityIcon(type: ActivityLogEntry['type']) {
    switch (type) {
        case 'create':
            return <Plus className="h-4 w-4 text-chart-2" />;
        case 'update':
            return <FileEdit className="h-4 w-4 text-primary" />;
        case 'delete':
            return <Trash2 className="h-4 w-4 text-destructive" />;
        case 'status_change':
            return <Settings className="h-4 w-4 text-chart-4" />;
        default:
            return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
}

function getActivityBadgeVariant(type: ActivityLogEntry['type']) {
    switch (type) {
        case 'create':
            return 'default' as const;
        case 'update':
            return 'secondary' as const;
        case 'delete':
            return 'destructive' as const;
        case 'status_change':
            return 'outline' as const;
        default:
            return 'secondary' as const;
    }
}

export default function AdminDashboard() {
    const {
        projects,
        contactInquiries,
        careerApplications,
        newsArticles,
        activityLog,
    } = useCMSStore();

    const stats = [
        {
            title: 'Total Projects',
            value: projects.length,
            change: `${projects.filter(p => p.status === 'ongoing').length} ongoing`,
            icon: Building2,
            color: 'bg-primary',
        },
        {
            title: 'New Inquiries',
            value: contactInquiries.filter((i) => i.status === 'pending').length,
            change: `${contactInquiries.length} total`,
            icon: Mail,
            color: 'bg-primary',
        },
        {
            title: 'Job Applications',
            value: careerApplications.length,
            change: `${careerApplications.filter((a) => a.status === 'pending').length} pending`,
            icon: Briefcase,
            color: 'bg-primary',
        },
        {
            title: 'News Articles',
            value: newsArticles.length,
            change: `${newsArticles.filter(a => a.featured).length} featured`,
            icon: Newspaper,
            color: 'bg-primary',
        },
    ];

    const recentInquiries = contactInquiries.slice(0, 5);
    const recentApplications = careerApplications.slice(0, 5);
    const recentActivities = activityLog.slice(0, 10);

    return (
        <AdminLayout title="Dashboard">
            {/* Stats Grid */}
            <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {stat.title}
                                    </CardTitle>
                                    <div
                                        className={`rounded-full p-2 ${stat.color} text-primary-foreground`}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold">{stat.value}</div>
                                    <p className="text-sm text-muted-foreground">
                                        {stat.change}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="mb-8 grid gap-6 lg:grid-cols-2">
                {/* Inquiries & Applications Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Inquiries & Applications</CardTitle>
                        <CardDescription>Monthly overview of leads and applications</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BarChart
                            data={monthlyData}
                            xAxisKey="month"
                            bars={[
                                { dataKey: 'inquiries', name: 'Inquiries', fill: 'hsl(var(--primary))' },
                                { dataKey: 'applications', name: 'Applications', fill: 'hsl(var(--secondary))' },
                            ]}
                            height={300}
                        />
                    </CardContent>
                </Card>

                {/* Website Traffic */}
                <Card>
                    <CardHeader>
                        <CardTitle>Website Traffic</CardTitle>
                        <CardDescription>Monthly visitors trend</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AreaChart
                            data={trafficData}
                            xAxisKey="month"
                            areas={[
                                {
                                    dataKey: 'visitors',
                                    name: 'Visitors',
                                    fill: 'hsl(var(--primary) / 0.2)',
                                    stroke: 'hsl(var(--primary))',
                                },
                            ]}
                            height={300}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Project Status & Activity Log */}
            <div className="mb-8 grid gap-6 lg:grid-cols-3">
                {/* Project Status Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Project Status</CardTitle>
                        <CardDescription>Distribution by status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PieChartComponent
                            data={projectStatusData}
                            height={250}
                        />
                    </CardContent>
                </Card>

                {/* Recent Activity Log */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Your recent actions in the CMS</CardDescription>
                        </div>
                        <Activity className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {recentActivities.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Activity className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                <p className="text-muted-foreground">No recent activity</p>
                                <p className="text-sm text-muted-foreground">
                                    Your actions will appear here as you make changes
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentActivities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0"
                                    >
                                        <div className="mt-0.5">
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{activity.entityName}</span>
                                                <Badge variant={getActivityBadgeVariant(activity.type)}>
                                                    {activity.type}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {activity.description}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Recent Inquiries & Applications */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Inquiries */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Inquiries</CardTitle>
                        <a
                            href="/admin/leads"
                            className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                            View all
                            <ArrowUpRight className="h-4 w-4" />
                        </a>
                    </CardHeader>
                    <CardContent>
                        {recentInquiries.length === 0 ? (
                            <p className="py-4 text-center text-muted-foreground">No inquiries yet</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentInquiries.map((inquiry) => (
                                        <TableRow key={inquiry.id}>
                                            <TableCell className="font-medium">{inquiry.name}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {inquiry.subject}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        inquiry.status === 'pending'
                                                            ? 'secondary'
                                                            : inquiry.status === 'responded'
                                                              ? 'default'
                                                              : 'outline'
                                                    }
                                                >
                                                    {inquiry.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Applications */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Applications</CardTitle>
                        <a
                            href="/admin/applications"
                            className="flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                            View all
                            <ArrowUpRight className="h-4 w-4" />
                        </a>
                    </CardHeader>
                    <CardContent>
                        {recentApplications.length === 0 ? (
                            <p className="py-4 text-center text-muted-foreground">No applications yet</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Position</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentApplications.map((application) => (
                                        <TableRow key={application.id}>
                                            <TableCell className="font-medium">{application.name}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {application.jobTitle}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        application.status === 'pending'
                                                            ? 'secondary'
                                                            : application.status === 'shortlisted'
                                                              ? 'default'
                                                              : application.status === 'rejected'
                                                                ? 'destructive'
                                                                : 'outline'
                                                    }
                                                >
                                                    {application.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <a
                            href="/admin/pages/home"
                            className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted"
                        >
                            <FileEdit className="h-5 w-5 text-primary" />
                            <div>
                                <p className="font-medium">Edit Home Page</p>
                                <p className="text-sm text-muted-foreground">Update hero & content</p>
                            </div>
                        </a>
                        <a
                            href="/admin/projects"
                            className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted"
                        >
                            <Building2 className="h-5 w-5 text-primary" />
                            <div>
                                <p className="font-medium">Manage Projects</p>
                                <p className="text-sm text-muted-foreground">Add or edit projects</p>
                            </div>
                        </a>
                        <a
                            href="/admin/media"
                            className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted"
                        >
                            <Newspaper className="h-5 w-5 text-primary" />
                            <div>
                                <p className="font-medium">News & Media</p>
                                <p className="text-sm text-muted-foreground">Publish articles</p>
                            </div>
                        </a>
                        <a
                            href="/admin/settings"
                            className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-muted"
                        >
                            <Settings className="h-5 w-5 text-primary" />
                            <div>
                                <p className="font-medium">Site Settings</p>
                                <p className="text-sm text-muted-foreground">Configure site options</p>
                            </div>
                        </a>
                    </div>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
