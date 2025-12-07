import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminAuthStore } from '@/stores';
import { Head, router } from '@inertiajs/react';
import { Building2, Mail, Eye, EyeOff } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
    const { isAuthenticated, login } = useAdminAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            router.visit('/admin');
        }
    }, [isAuthenticated]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const success = await login(email, password);

        if (success) {
            toast.success('Login successful!');
            router.visit('/admin');
        } else {
            toast.error('Invalid credentials', {
                description: 'Please check your email and password.',
            });
        }

        setIsLoading(false);
    };

    return (
        <>
            <Head title="Admin Login" />
            <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                            <Building2 className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <CardTitle className="text-2xl">Admin Login</CardTitle>
                        <CardDescription>
                            Sign in to access the admin dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        // placeholder="nex-realstate@gmail.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="pr-9"
                                    />
                                    <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        // placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pr-9"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </Button>
                            {/* <div className="rounded-md bg-muted p-3 text-center text-sm text-muted-foreground">
                                <p className="font-medium">Demo Credentials:</p>
                                <p>Email: nex-realstate@gmail.com</p>
                                <p>Password: password</p>
                            </div> */}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
