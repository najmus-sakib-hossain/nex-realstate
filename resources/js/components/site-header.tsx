import { ModeToggle } from '@/components/mode-toggle';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import {
    Building2,
    ChevronDown,
    Facebook,
    Linkedin,
    Mail,
    MapPin,
    Menu,
    Phone,
    X,
    Youtube,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    {
        name: 'Services',
        href: '/services',
        children: [
            { name: 'Project Management', href: '/services/project-management' },
            { name: 'Consultancy', href: '/services/consultancy' },
            { name: 'Property Buy & Sales', href: '/services/property-buy-sales' },
            { name: 'Land Development', href: '/services/land-development' },
            { name: 'Construction Services', href: '/services/construction-services' },
            { name: 'Interior & Design', href: '/services/interior-design' },
            { name: 'After-Sales Support', href: '/services/after-sales-support' },
        ],
    },
    {
        name: 'Products',
        href: '/products',
        children: [
            { name: 'Residential', href: '/products/residential' },
            { name: 'Commercial', href: '/products/commercial' },
            { name: 'Land', href: '/products/land' },
            { name: 'Resorts', href: '/products/resorts' },
            { name: 'Hospitals', href: '/products/hospitals' },
            { name: 'Hotels', href: '/products/hotels' },
        ],
    },
    {
        name: 'Projects',
        href: '/projects',
        children: [
            { name: 'Ongoing', href: '/projects/ongoing' },
            { name: 'Completed', href: '/projects/completed' },
            { name: 'Upcoming', href: '/projects/upcoming' },
        ],
    },
    { name: 'Investment', href: '/investment' },
    { name: 'Land Wanted', href: '/land-wanted' },
    { name: 'Media & News', href: '/media' },
    { name: 'Career', href: '/career' },
    { name: 'Business', href: '/business' },
    { name: 'Contact', href: '/contact' },
];

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            {/* Top Bar */}
            <div className="hidden border-b bg-primary text-sm text-primary-foreground lg:block">
                <div className="container mx-auto flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-6">
                        <a
                            href="tel:+8801677600000"
                            className="flex items-center gap-2 transition-opacity hover:opacity-80"
                        >
                            <Phone className="h-4 w-4" />
                            +880 1677-600000
                        </a>
                        <a
                            href="mailto:hello.nexrealestate@gmail.com"
                            className="flex items-center gap-2 transition-opacity hover:opacity-80"
                        >
                            <Mail className="h-4 w-4" />
                            hello.nexrealestate@gmail.com
                        </a>
                    </div>
                    <div className="flex items-center gap-4">
                        <a
                            href="https://www.facebook.com/NexRealEstateLtd"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary-foreground/80"
                        >
                            <Facebook className="h-4 w-4" />
                        </a>
                        <a
                            href="https://www.youtube.com/@NexRealEstateLtd"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary-foreground/80"
                        >
                            <Youtube className="h-4 w-4" />
                        </a>
                        <a
                            href="https://www.linkedin.com/company/nex-realestate/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary-foreground/80"
                        >
                            <Linkedin className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <div className="container mx-auto px-4 w-full lg:max-w-9xl">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Building2 className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold">
                            Nex <span className="text-primary">Real Estate</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center gap-1 lg:flex">
                        {navigation.map((item) =>
                            item.children ? (
                                <DropdownMenu key={item.name}>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="gap-1 text-sm font-medium"
                                        >
                                            {item.name}
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="min-w-[240px]">
                                        {item.children.map((child) => (
                                            <DropdownMenuItem key={child.name} asChild>
                                                <Link href={child.href}>{child.name}</Link>
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        'px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ),
                        )}
                    </nav>

                    {/* Actions */}
                    <div className="hidden items-center gap-4 lg:flex">
                        <Button asChild>
                            <Link href="/contact">Book a Visit</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu */}
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild className="lg:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-full max-w-sm p-0 sm:max-w-md">
                            <div className="flex items-center justify-start gap-2 border-b px-6 py-4">
                                <Link
                                    href="/"
                                    className="flex items-center gap-2 text-lg font-semibold"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <Building2 className="h-7 w-7 text-primary" />
                                    Nex Real Estate
                                </Link>
                            </div>
                            <div className="space-y-6 overflow-y-auto px-6 py-6">
                                <nav className="space-y-3">
                                    {navigation.map((item) => (
                                        <div key={item.name} className="rounded-2xl border border-border/60 bg-muted/30 p-3 shadow-sm">
                                            <Link
                                                href={item.href}
                                                className="flex items-center justify-between text-base font-semibold"
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                {item.name}
                                                {item.children && <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                                            </Link>
                                            {item.children && (
                                                <div className="mt-3 space-y-2 pl-1">
                                                    {item.children.map((child) => (
                                                        <Link
                                                            key={child.name}
                                                            href={child.href}
                                                            className="block rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-background hover:text-foreground"
                                                            onClick={() => setMobileOpen(false)}
                                                        >
                                                            {child.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </nav>
                                <div className="space-y-3">
                                    <Button className="w-full" asChild>
                                        <Link href="/contact" onClick={() => setMobileOpen(false)}>
                                            Book a Visit
                                        </Link>
                                    </Button>
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href="/projects" onClick={() => setMobileOpen(false)}>
                                            View Projects
                                        </Link>
                                    </Button>
                                </div>
                                <div className="flex items-center gap-4 text-muted-foreground">
                                    <ModeToggle />
                                    <a
                                        href="https://www.facebook.com/NexRealEstateLtd"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-foreground"
                                    >
                                        <Facebook className="h-5 w-5" />
                                    </a>
                                    <a
                                        href="https://www.youtube.com/@NexRealEstateLtd"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-foreground"
                                    >
                                        <Youtube className="h-5 w-5" />
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/company/nex-realestate/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-foreground"
                                    >
                                        <Linkedin className="h-5 w-5" />
                                    </a>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}

export function Footer() {
    return (
        <footer className="border-t bg-muted/50 text-muted-foreground">
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Company Info */}
                    <div>
                        <div className="mb-4 flex items-center gap-2">
                            <Building2 className="h-8 w-8 text-primary" />
                            <span className="text-xl font-bold text-foreground">
                                Nex Real Estate
                            </span>
                        </div>
                        <p className="mb-4 text-sm">
                            Where Quality meets Comfort, and every space builds a lasting
                            Legacy.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="https://www.facebook.com/NexRealEstateLtd"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="https://www.youtube.com/@NexRealEstateLtd"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <Youtube className="h-5 w-5" />
                            </a>
                            <a
                                href="https://www.linkedin.com/company/nex-realestate/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-foreground">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/about" className="hover:text-foreground">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" className="hover:text-foreground">
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link href="/projects" className="hover:text-foreground">
                                    Projects
                                </Link>
                            </li>
                            <li>
                                <Link href="/investment" className="hover:text-foreground">
                                    Investment
                                </Link>
                            </li>
                            <li>
                                <Link href="/career" className="hover:text-foreground">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-foreground">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Products */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-foreground">Products</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/products/residential" className="hover:text-foreground">
                                    Residential
                                </Link>
                            </li>
                            <li>
                                <Link href="/products/commercial" className="hover:text-foreground">
                                    Commercial
                                </Link>
                            </li>
                            <li>
                                <Link href="/products/land" className="hover:text-foreground">
                                    Land
                                </Link>
                            </li>
                            <li>
                                <Link href="/products/resorts" className="hover:text-foreground">
                                    Resorts
                                </Link>
                            </li>
                            <li>
                                <Link href="/products/hotels" className="hover:text-foreground">
                                    Hotels
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-foreground">Contact Us</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <MapPin className="mt-1 h-4 w-4 flex-shrink-0" />
                                <span>
                                    House: 50, Level-5, Lake Circus Kalabagan, Dhaka 1209,
                                    Bangladesh
                                </span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4 flex-shrink-0" />
                                <a href="tel:+8801677600000" className="hover:text-foreground">
                                    +880 1677-600000
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4 flex-shrink-0" />
                                <a
                                    href="mailto:hello.nexrealestate@gmail.com"
                                    className="hover:text-foreground"
                                >
                                    hello.nexrealestate@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t">
                <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 text-center text-sm md:flex-row md:text-left">
                    <p>© 2025 Nex Real Estate. All rights reserved.</p>
                    <p>
                        Developed and maintained by{' '}
                        <a
                            href="https://nexkraft.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-foreground hover:underline"
                        >
                            NexKraft
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
