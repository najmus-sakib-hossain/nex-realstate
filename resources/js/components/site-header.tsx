import { ModeToggle } from '@/components/mode-toggle';
import { cn } from '@/lib/utils';
import { useCMSStore } from '@/stores/cms-store';
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

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { headerSettings } = useCMSStore();

    if (!headerSettings) return null;

    const navigation = headerSettings.navigation.sort((a, b) => a.order - b.order);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            {/* Top Bar */}
            {/* {headerSettings.showTopBar && (
                <div className="hidden border-b bg-primary text-sm text-primary-foreground lg:block">
                    <div className="container mx-auto flex items-center justify-between px-4 py-2">
                        <div className="flex items-center gap-6">
                            <a
                                href={`tel:${headerSettings.topBar.contactPhone.replace(/\s/g, '')}`}
                                className="flex items-center gap-2 transition-opacity hover:opacity-80"
                            >
                                <Phone className="h-4 w-4" />
                                {headerSettings.topBar.contactPhone}
                            </a>
                            <a
                                href={`mailto:${headerSettings.topBar.contactEmail}`}
                                className="flex items-center gap-2 transition-opacity hover:opacity-80"
                            >
                                <Mail className="h-4 w-4" />
                                {headerSettings.topBar.contactEmail}
                            </a>
                        </div>
                        <div className="flex items-center gap-4">
                            {headerSettings.topBar.socialLinks.facebook && (
                                <a
                                    href={headerSettings.topBar.socialLinks.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary-foreground/80"
                                >
                                    <Facebook className="h-4 w-4" />
                                </a>
                            )}
                            {headerSettings.topBar.socialLinks.youtube && (
                                <a
                                    href={headerSettings.topBar.socialLinks.youtube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary-foreground/80"
                                >
                                    <Youtube className="h-4 w-4" />
                                </a>
                            )}
                            {headerSettings.topBar.socialLinks.linkedin && (
                                <a
                                    href={headerSettings.topBar.socialLinks.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary-foreground/80"
                                >
                                    <Linkedin className="h-4 w-4" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )} */}

            {/* Main Navigation */}
            <div className="container mx-auto w-full">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <img
                            src={headerSettings.logo.url}
                            alt={headerSettings.logo.alt}
                            className="h-12 w-auto"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center gap-1 lg:flex">
                        {navigation.map((item) =>
                            item.children && item.children.length > 0 ? (
                                <DropdownMenu key={item.id}>
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
                                        {item.children
                                            .sort((a, b) => a.order - b.order)
                                            .map((child) => (
                                                <DropdownMenuItem key={child.id} asChild>
                                                    <Link href={child.href}>{child.name}</Link>
                                                </DropdownMenuItem>
                                            ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link
                                    key={item.id}
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
                            <Link href={headerSettings.ctaButton.href}>
                                {headerSettings.ctaButton.text}
                            </Link>
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
                                    <img
                                        src={headerSettings.logo.url}
                                        alt={headerSettings.logo.alt}
                                        className="h-10 w-auto"
                                    />
                                </Link>
                            </div>
                            <div className="space-y-6 overflow-y-auto px-6 py-6">
                                <nav className="space-y-3">
                                    {navigation.map((item) => (
                                        <div
                                            key={item.id}
                                            className="rounded-2xl border border-border/60 bg-muted/30 p-3 shadow-sm"
                                        >
                                            <Link
                                                href={item.href}
                                                className="flex items-center justify-between text-base font-semibold"
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                {item.name}
                                                {item.children && item.children.length > 0 && (
                                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Link>
                                            {item.children && item.children.length > 0 && (
                                                <div className="mt-3 space-y-2 pl-1">
                                                    {item.children
                                                        .sort((a, b) => a.order - b.order)
                                                        .map((child) => (
                                                            <Link
                                                                key={child.id}
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
                                        <Link
                                            href={headerSettings.ctaButton.href}
                                            onClick={() => setMobileOpen(false)}
                                        >
                                            {headerSettings.ctaButton.text}
                                        </Link>
                                    </Button>
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href="/projects" onClick={() => setMobileOpen(false)}>
                                            View Projects
                                        </Link>
                                    </Button>
                                </div>
                                {headerSettings.showTopBar && (
                                    <div className="flex items-center gap-4 text-muted-foreground">
                                        <ModeToggle />
                                        {headerSettings.topBar.socialLinks.facebook && (
                                            <a
                                                href={headerSettings.topBar.socialLinks.facebook}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-foreground"
                                            >
                                                <Facebook className="h-5 w-5" />
                                            </a>
                                        )}
                                        {headerSettings.topBar.socialLinks.youtube && (
                                            <a
                                                href={headerSettings.topBar.socialLinks.youtube}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-foreground"
                                            >
                                                <Youtube className="h-5 w-5" />
                                            </a>
                                        )}
                                        {headerSettings.topBar.socialLinks.linkedin && (
                                            <a
                                                href={headerSettings.topBar.socialLinks.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-foreground"
                                            >
                                                <Linkedin className="h-5 w-5" />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}

export function Footer() {
    const { footerSettings } = useCMSStore();

    if (!footerSettings) return null;

    const columns = footerSettings.columns.sort((a, b) => a.order - b.order);

    return (
        <footer className="border-t bg-muted/50 text-muted-foreground">
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Company Info */}
                    <div>
                        <div className="mb-4">
                            <img
                                src={footerSettings.logo.url}
                                alt={footerSettings.logo.alt}
                                className="h-12 w-auto"
                            />
                        </div>
                        <p className="mb-4 text-sm">{footerSettings.tagline}</p>
                        <div className="flex gap-4">
                            {footerSettings.socialLinks.facebook && (
                                <a
                                    href={footerSettings.socialLinks.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <Facebook className="h-5 w-5" />
                                </a>
                            )}
                            {footerSettings.socialLinks.youtube && (
                                <a
                                    href={footerSettings.socialLinks.youtube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <Youtube className="h-5 w-5" />
                                </a>
                            )}
                            {footerSettings.socialLinks.linkedin && (
                                <a
                                    href={footerSettings.socialLinks.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <Linkedin className="h-5 w-5" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Dynamic Columns */}
                    {columns.map((column) => (
                        <div key={column.id}>
                            <h3 className="mb-4 text-lg font-semibold text-foreground">
                                {column.title}
                            </h3>
                            <ul className="space-y-2 text-sm">
                                {column.links
                                    .sort((a, b) => a.order - b.order)
                                    .map((link) => (
                                        <li key={link.id}>
                                            <Link
                                                href={link.href}
                                                className="hover:text-foreground"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold text-foreground">Contact Us</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <MapPin className="mt-1 h-4 w-4 flex-shrink-0" />
                                <span>{footerSettings.contactInfo.address}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4 flex-shrink-0" />
                                <a
                                    href={`tel:${footerSettings.contactInfo.phone.replace(/\s/g, '')}`}
                                    className="hover:text-foreground"
                                >
                                    {footerSettings.contactInfo.phone}
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4 flex-shrink-0" />
                                <a
                                    href={`mailto:${footerSettings.contactInfo.email}`}
                                    className="hover:text-foreground"
                                >
                                    {footerSettings.contactInfo.email}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t">
                <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 text-center text-sm md:flex-row md:text-left">
                    <p>
                        © {footerSettings.copyright.year} {footerSettings.copyright.text}
                    </p>
                    <p>
                        Developed and maintained by{' '}
                        <a
                            href={footerSettings.developer.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-foreground hover:underline"
                        >
                            {footerSettings.developer.name}
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
