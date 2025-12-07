import { useAdminAuthStore } from '@/stores';
import { Head, router } from '@inertiajs/react';
import {
    BarChart3,
    Briefcase,
    Building2,
    ChevronDown,
    FileText,
    FolderKanban,
    Home,
    Image,
    Layers,
    LogOut,
    Mail,
    Menu,
    Newspaper,
    Settings,
    Users,
    X,
} from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { ScrollArea } from '../components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { cn } from '../lib/utils';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
}

const sidebarNavigation = [
    {
        title: 'Dashboard',
        href: '/admin',
        icon: BarChart3,
    },
    {
        title: 'Pages',
        icon: FileText,
        children: [
            { title: 'Home', href: '/admin/pages/home', icon: Home },
            { title: 'About', href: '/admin/pages/about', icon: Users },
            { title: 'Services', href: '/admin/pages/services', icon: Layers },
            { title: 'Products', href: '/admin/pages/products', icon: FolderKanban },
            { title: 'Investment', href: '/admin/pages/investment', icon: BarChart3 },
            { title: 'Business', href: '/admin/pages/business', icon: Building2 },
            { title: 'Land Wanted', href: '/admin/pages/land-wanted', icon: FolderKanban },
            { title: 'Contact', href: '/admin/pages/contact', icon: Mail },
            { title: 'Career', href: '/admin/pages/career', icon: Briefcase },
            { title: 'Media', href: '/admin/pages/media', icon: Newspaper },
        ],
    },
    {
        title: 'Projects',
        href: '/admin/projects',
        icon: Building2,
    },
    {
        title: 'Testimonials',
        href: '/admin/testimonials',
        icon: Users,
    },
    {
        title: 'News & Articles',
        href: '/admin/news',
        icon: Newspaper,
    },
    {
        title: 'Inquiries',
        href: '/admin/inquiries',
        icon: Mail,
    },
    {
        title: 'Applications',
        href: '/admin/applications',
        icon: Briefcase,
    },
    {
        title: 'Media Library',
        href: '/admin/media-library',
        icon: Image,
    },
    {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings,
    },
];

function SidebarNav({
    className,
    onNavClick,
}: {
    className?: string;
    onNavClick?: () => void;
}) {
    const [openMenus, setOpenMenus] = useState<string[]>(['Pages']);

    const toggleMenu = (title: string) => {
        setOpenMenus((prev) =>
            prev.includes(title)
                ? prev.filter((t) => t !== title)
                : [...prev, title],
        );
    };

    return (
        <nav className={cn('space-y-1', className)}>
            {sidebarNavigation.map((item) => {
                const Icon = item.icon;

                if (item.children) {
                    const isOpen = openMenus.includes(item.title);
                    return (
                        <div key={item.title}>
                            <button
                                onClick={() => toggleMenu(item.title)}
                                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className="h-5 w-5" />
                                    {item.title}
                                </div>
                                <ChevronDown
                                    className={cn(
                                        'h-4 w-4 transition-transform',
                                        isOpen && 'rotate-180',
                                    )}
                                />
                            </button>
                            {isOpen && (
                                <div className="ml-4 mt-1 space-y-1 border-l pl-4">
                                    {item.children.map((child) => {
                                        const ChildIcon = child.icon;
                                        return (
                                            <a
                                                key={child.href}
                                                href={child.href}
                                                onClick={onNavClick}
                                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                            >
                                                <ChildIcon className="h-4 w-4" />
                                                {child.title}
                                            </a>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                }

                return (
                    <a
                        key={item.href}
                        href={item.href}
                        onClick={onNavClick}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                        <Icon className="h-5 w-5" />
                        {item.title}
                    </a>
                );
            })}
        </nav>
    );
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
    const { isAuthenticated, user, logout } = useAdminAuthStore();
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.visit('/admin/login');
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
        logout();
        router.visit('/admin/login');
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
            <Head title={title ? `${title} - Admin` : 'Admin Dashboard'} />
            <div className="flex min-h-screen bg-muted/40">
                {/* Sidebar - Desktop */}
                <aside className="hidden w-64 flex-shrink-0 lg:block">
                    <div className="fixed top-0 left-0 z-30 flex h-screen w-64 flex-col border-r bg-background">
                        {/* Logo */}
                        <div className="flex h-16 items-center gap-2 border-b px-6">
                            <Building2 className="h-8 w-8 text-primary" />
                            <span className="font-bold">Nex Admin</span>
                        </div>

                        {/* Navigation */}
                        <ScrollArea className="flex-1 px-3 py-4">
                            <SidebarNav />
                        </ScrollArea>

                        {/* User */}
                        <div className="border-t p-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start gap-3"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                                            {user?.name?.charAt(0) || 'A'}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-sm font-medium">{user?.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuItem asChild>
                                        <a href="/admin/settings">
                                            <Settings className="mr-2 h-4 w-4" />
                                            Settings
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex flex-1 flex-col">
                    {/* Header */}
                    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
                        {/* Mobile Menu */}
                        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                            <SheetTrigger asChild className="lg:hidden">
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-64 p-0">
                                <div className="flex h-full flex-col">
                                    <div className="flex h-16 items-center gap-2 border-b px-6">
                                        <Building2 className="h-8 w-8 text-primary" />
                                        <span className="font-bold">Nex Admin</span>
                                    </div>
                                    <ScrollArea className="flex-1 px-3 py-4">
                                        <SidebarNav onNavClick={() => setMobileOpen(false)} />
                                    </ScrollArea>
                                </div>
                            </SheetContent>
                        </Sheet>

                        <div className="flex flex-1 items-center justify-between">
                            <h1 className="text-lg font-semibold">{title || 'Dashboard'}</h1>
                            <div className="flex items-center gap-4">
                                <Button variant="outline" size="sm" asChild>
                                    <a href="/" target="_blank">
                                        View Site
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
                </div>
            </div>
        </>
    );
}

export default AdminLayout;
