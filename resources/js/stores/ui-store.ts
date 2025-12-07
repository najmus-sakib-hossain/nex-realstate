import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface UIState {
    sidebarOpen: boolean;
    sidebarCollapsed: boolean;
    mobileMenuOpen: boolean;
    isLoading: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    toggleSidebarCollapse: () => void;
    toggleMobileMenu: () => void;
    setMobileMenuOpen: (open: boolean) => void;
    setLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>()(
    devtools(
        immer((set) => ({
            sidebarOpen: true,
            sidebarCollapsed: false,
            mobileMenuOpen: false,
            isLoading: false,
            toggleSidebar: () =>
                set((state) => ({ sidebarOpen: !state.sidebarOpen })),
            setSidebarOpen: (open) => set({ sidebarOpen: open }),
            toggleSidebarCollapse: () =>
                set((state) => ({
                    sidebarCollapsed: !state.sidebarCollapsed,
                })),
            toggleMobileMenu: () =>
                set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
            setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
            setLoading: (loading) => set({ isLoading: loading }),
        })),
        { name: 'nex-ui-store' },
    ),
);
