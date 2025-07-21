import { create } from 'zustand';

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface UsersState {
  users: User[];
  setUsers: (users: User[]) => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
})); 