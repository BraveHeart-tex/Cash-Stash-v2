import type { User } from "lucia";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type AuthStoreState = {
  user: User | null;
  setUser: (user: Partial<User> | null) => void;
  uri: string;
  setUri: (uri: string) => void;
};

const useAuthStore = create<AuthStoreState, [["zustand/devtools", never]]>(
  devtools(
    (set, _get) => ({
      user: null,
      setUser: (user) => {
        set((state) => ({
          ...state,
          user: {
            ...state.user,
            ...(user as User),
          },
        }));
      },
      uri: "",
      setUri: (uri) => set({ uri }),
    }),
    {
      name: "AuthStore",
    },
  ),
);

export default useAuthStore;
