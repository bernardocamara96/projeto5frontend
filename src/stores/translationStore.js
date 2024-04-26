import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const translationStore = create(
   persist(
      (set) => ({
         locale: "en",
         updateLocale: (locale) => set({ locale }),
      }),
      {
         name: "translation-storage",
         storage: createJSONStorage(() => sessionStorage),
      }
   )
);

export default translationStore;
