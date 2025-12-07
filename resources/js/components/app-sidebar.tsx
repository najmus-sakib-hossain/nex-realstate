import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    BarChart3,
    BookOpen,
    Briefcase,
    Building2,
    FileText,
    Folder,
    Home,
    Image,
    LayoutGrid,
    Mail,
    MessageSquare,
    Newspaper,
    Package,
    Settings,
    Star,
    Users,
    Wallet,
    Map,
    Phone,
    Info,
    Megaphone,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Admin Dashboard',
        href: '/admin',
        icon: BarChart3,
    },
];

const pageNavItems: NavItem[] = [
    {
        title: 'Home Page',
        href: '/admin/pages/home',
        icon: Home,
    },
    {
        title: 'About Page',
        href: '/admin/pages/about',
        icon: Info,
    },
    {
        title: 'Services Page',
        href: '/admin/pages/services',
        icon: Users,
    },
    {
        title: 'Products Page',
        href: '/admin/pages/products',
        icon: Package,
    },
    {
        title: 'Investment Page',
        href: '/admin/pages/investment',
        icon: Wallet,
    },
    {
        title: 'Land Wanted Page',
        href: '/admin/pages/land-wanted',
        icon: Map,
    },
    {
        title: 'Career Page',
        href: '/admin/pages/career',
        icon: Briefcase,
    },
    {
        title: 'Business Page',
        href: '/admin/pages/business',
        icon: Building2,
    },
    {
        title: 'Media Page',
        href: '/admin/pages/media',
        icon: Megaphone,
    },
    {
        title: 'Contact Page',
        href: '/admin/pages/contact',
        icon: Phone,
    },
];

const contentNavItems: NavItem[] = [
    {
        title: 'Projects',
        href: '/admin/projects',
        icon: Building2,
    },
    {
        title: 'Services',
        href: '/admin/services',
        icon: Users,
    },
    {
        title: 'News & Articles',
        href: '/admin/news',
        icon: Newspaper,
    },
    {
        title: 'Testimonials',
        href: '/admin/testimonials',
        icon: Star,
    },
    {
        title: 'Media Library',
        href: '/admin/media-library',
        icon: Image,
    },
];

const manageNavItems: NavItem[] = [
    {
        title: 'Contact Inquiries',
        href: '/admin/inquiries',
        icon: Mail,
    },
    {
        title: 'Job Applications',
        href: '/admin/applications',
        icon: Briefcase,
    },
    {
        title: 'Leads',
        href: '/admin/leads',
        icon: MessageSquare,
    },
    {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} label="Overview" />
                <NavMain items={pageNavItems} label="Page Editors" />
                <NavMain items={contentNavItems} label="Content" />
                <NavMain items={manageNavItems} label="Management" />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
