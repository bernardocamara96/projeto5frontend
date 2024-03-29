import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const userStore = create(
   persist(
      (set) => ({
         user: {
            token: "",
            role: "",
         },
         updateToken: (newToken) => set((state) => ({ user: { ...state.user, token: newToken } })),
         updateRole: (newRole) => set((state) => ({ user: { ...state.user, role: newRole } })),
      }),
      {
         name: "user-storage",
         storage: createJSONStorage(() => sessionStorage),
      }
   )
);

const usernameStore = create(
   persist(
      (set) => ({
         username: "",
         updateUsername: (newUsername) => set({ username: newUsername }),
      }),
      {
         name: "username-storage",
         storage: createJSONStorage(() => sessionStorage),
      }
   )
);

export { userStore, usernameStore };
