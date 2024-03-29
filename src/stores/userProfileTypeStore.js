import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const userProfileTypeStore = create(
   persist(
      (set) => ({
         userProfileType: "",
         updateUserProfileType: (newUserProfileType) => set({ userProfileType: newUserProfileType }),
      }),
      {
         name: "userProfileType-storage",
         storage: createJSONStorage(() => sessionStorage),
      }
   )
);

export default userProfileTypeStore;
