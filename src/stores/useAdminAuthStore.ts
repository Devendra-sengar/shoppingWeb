import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminUser, AdminRole } from '../types/admin';

// Default mock admin profiles for authorized store owners and staff
export const DEFAULT_ADMIN_USERS: AdminUser[] = [
  {
    id: 'admin_owner',
    email: 'admin@elan.com',
    name: 'Atelier Director',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    isActive: true,
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'admin_fulfillment',
    email: 'fulfillment@elan.com',
    name: 'Dispatch Manager',
    role: 'fulfillment_staff',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    isActive: true,
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'admin_catalog',
    email: 'catalog@elan.com',
    name: 'Curator & Merchandiser',
    role: 'catalog_manager',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    isActive: true,
    lastLogin: new Date().toISOString(),
  },
];

interface AdminAuthState {
  currentUser: AdminUser | null;
  isAuthenticated: boolean;
  staffList: AdminUser[];
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: AdminRole) => void;
  addStaff: (user: Omit<AdminUser, 'id' | 'isActive'>) => void;
  toggleStaffStatus: (userId: string) => void;
  hasPermission: (allowedRoles: AdminRole[]) => boolean;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      currentUser: DEFAULT_ADMIN_USERS[0], // Pre-authenticated with Atelier Director for demonstration
      isAuthenticated: true,
      staffList: DEFAULT_ADMIN_USERS,

      login: async (email: string) => {
        // Authenticate email from allowed staff list
        const user = get().staffList.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (user) {
          if (!user.isActive) {
            return { success: false, error: 'This staff account has been deactivated by Super Admin.' };
          }
          const updated = { ...user, lastLogin: new Date().toISOString() };
          set({ currentUser: updated, isAuthenticated: true });
          return { success: true };
        }
        // If unknown email, provide friendly error
        return { 
          success: false, 
          error: 'Unrecognized administrator credentials. Contact Super Admin to provision access.' 
        };
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },

      switchRole: (role: AdminRole) => {
        const current = get().currentUser;
        if (current) {
          set({ currentUser: { ...current, role } });
        }
      },

      addStaff: (newStaff) => {
        const id = `staff_${Date.now()}`;
        const createdUser: AdminUser = {
          ...newStaff,
          id,
          isActive: true,
          lastLogin: undefined,
        };
        set((state) => ({ staffList: [...state.staffList, createdUser] }));
      },

      toggleStaffStatus: (userId: string) => {
        set((state) => ({
          staffList: state.staffList.map((u) =>
            u.id === userId && u.role !== 'super_admin' ? { ...u, isActive: !u.isActive } : u
          ),
        }));
      },

      hasPermission: (allowedRoles: AdminRole[]) => {
        const user = get().currentUser;
        if (!user || !user.isActive) return false;
        if (user.role === 'super_admin') return true;
        return allowedRoles.includes(user.role);
      },
    }),
    {
      name: 'elan_admin_auth_storage',
    }
  )
);
