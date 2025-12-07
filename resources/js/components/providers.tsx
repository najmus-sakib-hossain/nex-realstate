import { queryClient } from '@/lib/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { Toaster } from 'sonner';

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <Toaster
                position="top-right"
                expand={false}
                richColors
                closeButton
                duration={4000}
                toastOptions={{
                    style: {
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
                        color: 'var(--card-foreground)',
                    },
                }}
            />
        </QueryClientProvider>
    );
}

export default Providers;
