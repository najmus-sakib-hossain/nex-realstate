import { Footer, Navbar } from '@/components/site-header';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface FrontendLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
}

export function FrontendLayout({
    children,
    title = 'Home',
    description = 'Nex Real Estate - Quality. Comfort. Legacy.',
}: FrontendLayoutProps) {
    return (
        <>
            <Head title={`${title} - Nex Real Estate`}>
                <meta name="description" content={description} />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
            </div>
        </>
    );
}

export default FrontendLayout;
