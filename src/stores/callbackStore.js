import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const callbackStore = create(
   persist(
      (set) => ({
         callback: false,
         setCallback: (newCallback) => set({ callback: newCallback }),
      }),
      {
         name: "callback-storage",
         storage: createJSONStorage(() => sessionStorage),
      }
   )
);

export default callbackStore;
