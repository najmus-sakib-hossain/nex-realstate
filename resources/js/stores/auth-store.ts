import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface AdminAuthState {
    isAuthenticated: boolean;
    user: { email: string; name: string } | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

// Admin credentials
const ADMIN_CREDENTIALS = {
    email: 'nex-realstate@gmail.com',
    password: 'password',
    name: 'Admin',
};

export const useAdminAuthStore = create<AdminAuthState>()(
    devtools(
        persist(
            immer((set) => ({
                isAuthenticated: false,
                user: null,
                login: async (email: string, password: string) => {
                    // Simulate API call delay
                    await new Promise((resolve) => setTimeout(resolve, 500));

                    if (
                        email === ADMIN_CREDENTIALS.email &&
                        password === ADMIN_CREDENTIALS.password
                    ) {
                        set({
                            isAuthenticated: true,
                            user: {
                                email: ADMIN_CREDENTIALS.email,
                                name: ADMIN_CREDENTIALS.name,
                            },
                        });
                        return true;
                    }
                    return false;
                },
                logout: () => {
                    set({ isAuthenticated: false, user: null });
                },
            })),
            {
                name: 'nex-admin-auth',
            },
        ),
    ),
);
