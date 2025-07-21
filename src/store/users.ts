import { create } from 'zustand';

export interface User {
  id: number;
  username: string;
  role: string;
  deleted?: boolean;
}

export interface UsersState {
  users: User[];
  setUsers: (users: User[]) => void;
  activeUsers: () => User[];
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  setUsers: (users) => set({ users }),
  activeUsers: () => get().users.filter((u) => !u.deleted),
})); 