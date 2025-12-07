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
import AppLayout from '@/layouts/app-layout';
import { useCMSStore } from '@/stores/cms-store';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
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
    Users,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

// Chart data
const monthlyData = [
    { month: 'Jan', inquiries: 12, applications: 4 },
    { month: 'Feb', inquiries: 19, applications: 6 },
    { month: 'Mar', inquiries: 15, applications: 5 },
    { month: 'Apr', inquiries: 22, applications: 8 },
    { month: 'May', inquiries: 18, applications: 7 },
    { month: 'Jun', inquiries: 25, applications: 9 },
];

const trafficData = [
    { month: 'Jan', visitors: 1200 },
    { month: 'Feb', visitors: 1800 },
    { month: 'Mar', visitors: 1600 },
    { month: 'Apr', visitors: 2200 },
    { month: 'May', visitors: 2800 },
    { month: 'Jun', visitors: 3200 },
];

export default function Dashboard() {
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
            title: 'Contact Inquiries',
            value: contactInquiries.length,
            change: `${contactInquiries.filter(i => i.status === 'pending').length} pending`,
            icon: Mail,
            color: 'bg-chart-2',
        },
        {
            title: 'Job Applications',
            value: careerApplications.length,
            change: `${careerApplications.filter(a => a.status === 'pending').length} to review`,
            icon: Briefcase,
            color: 'bg-chart-4',
        },
        {
            title: 'News Articles',
            value: newsArticles.length,
            change: `${newsArticles.filter(n => n.featured).length} featured`,
            icon: Newspaper,
            color: 'bg-chart-5',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Welcome Back!</h1>
                        <p className="text-muted-foreground">
                            Here's an overview of your real estate business
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin">
                            <Settings className="mr-2 h-4 w-4" />
                            Go to Admin Panel
                        </Link>
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <div className={`rounded-full p-2 ${stat.color}`}>
                                    <stat.icon className="h-4 w-4 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.change}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Inquiries Chart */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Inquiries & Applications</CardTitle>
                            <CardDescription>
                                Monthly overview of customer inquiries and job applications
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BarChart
                                data={monthlyData}
                                xAxisKey="month"
                                bars={[
                                    { dataKey: 'inquiries', name: 'Inquiries', fill: 'hsl(var(--primary))' },
                                    { dataKey: 'applications', name: 'Applications', fill: 'hsl(217 91% 60%)' },
                                ]}
                                height={300}
                                className="w-full"
                            />
                        </CardContent>
                    </Card>

                    {/* Project Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Status</CardTitle>
                            <CardDescription>
                                Distribution of projects by status
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PieChartComponent
                                data={[
                                    { name: 'Ongoing', value: 3, fill: 'hsl(var(--primary))' },
                                    { name: 'Completed', value: 5, fill: 'hsl(142 76% 36%)' },
                                    { name: 'Upcoming', value: 2, fill: 'hsl(38 92% 50%)' },
                                ]}
                                height={300}
                                showLabel
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Traffic Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Website Traffic</CardTitle>
                        <CardDescription>
                            Monthly visitor trends for your website
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AreaChart
                            data={trafficData}
                            xAxisKey="month"
                            areas={[
                                { dataKey: 'visitors', name: 'Visitors', fill: 'hsl(var(--primary) / 0.2)', stroke: 'hsl(var(--primary))' },
                            ]}
                            height={250}
                            className="w-full"
                        />
                    </CardContent>
                </Card>

                {/* Recent Activity & Quick Links */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>
                                Latest actions in your CMS
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {activityLog.slice(0, 5).map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="mt-0.5 rounded-full bg-muted p-1.5">
                                            {activity.type === 'create' && <Plus className="h-3 w-3 text-chart-2" />}
                                            {activity.type === 'update' && <FileEdit className="h-3 w-3 text-primary" />}
                                            {activity.type === 'delete' && <Trash2 className="h-3 w-3 text-destructive" />}
                                            {activity.type === 'status_change' && <Settings className="h-3 w-3 text-chart-4" />}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {activity.entityName}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {activity.description}
                                            </p>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                        </span>
                                    </div>
                                ))}
                                {activityLog.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No recent activity
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Links */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>
                                Manage your website content
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3">
                                <Link
                                    href="/admin/pages/home"
                                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-primary/10 p-2">
                                            <Building2 className="h-4 w-4 text-primary" />
                                        </div>
                                        <span className="font-medium">Edit Home Page</span>
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                                </Link>
                                <Link
                                    href="/admin/projects"
                                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-chart-2/10 p-2">
                                            <Building2 className="h-4 w-4 text-chart-2" />
                                        </div>
                                        <span className="font-medium">Manage Projects</span>
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                                </Link>
                                <Link
                                    href="/admin/leads"
                                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-chart-4/10 p-2">
                                            <Mail className="h-4 w-4 text-chart-4" />
                                        </div>
                                        <span className="font-medium">View Inquiries</span>
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                                </Link>
                                <Link
                                    href="/admin/settings"
                                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-chart-5/10 p-2">
                                            <Settings className="h-4 w-4 text-chart-5" />
                                        </div>
                                        <span className="font-medium">Site Settings</span>
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Projects Table */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Recent Projects</CardTitle>
                                <CardDescription>
                                    Your latest real estate projects
                                </CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/admin/projects">
                                    View All
                                    <ArrowUpRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Project</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Type</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.slice(0, 5).map((project) => (
                                    <TableRow key={project.id}>
                                        <TableCell className="font-medium">
                                            {project.title}
                                        </TableCell>
                                        <TableCell>{project.location}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    project.status === 'completed'
                                                        ? 'default'
                                                        : project.status === 'ongoing'
                                                          ? 'secondary'
                                                          : 'outline'
                                                }
                                            >
                                                {project.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="capitalize">
                                            {project.category}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {projects.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                                            No projects yet
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
