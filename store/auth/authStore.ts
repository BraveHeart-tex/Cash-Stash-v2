/* eslint-disable no-unused-vars */

import { User } from "lucia";
import { create } from "zustand";

interface AuthStoreState {
  user: User | null;
  setUser: (user: User | null) => void;
  uri: string;
  setUri: (uri: string) => void;
}

const useAuthStore = create<AuthStoreState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  uri: "",
  setUri: (uri) => set({ uri }),
}));

export default useAuthStore;
