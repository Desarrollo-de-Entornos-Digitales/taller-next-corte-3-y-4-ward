import { create } from 'zustand';

export interface User {
  id?: string;
  username?: string;
  email?: string;
  avatar?: string | null;
  roleId?: number;
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
  clearUser: () => set({ user: null }),
}));
