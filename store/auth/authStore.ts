/* eslint-disable no-unused-vars */

import { User } from "lucia";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface AuthStoreState {
  user: User | null;
  setUser: (user: User | null) => void;
  uri: string;
  setUri: (uri: string) => void;
}

const useAuthStore = create<AuthStoreState, [["zustand/devtools", never]]>(
  devtools(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      uri: "",
      setUri: (uri) => set({ uri }),
    }),
    {
      name: "AuthStore",
    }
  )
);

export default useAuthStore;
