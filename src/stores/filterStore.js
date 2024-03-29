import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

//store for filter data
const filterStore = create(
   persist(
      (set) => ({
         usernameFilter: "default",
         updateUsernameFilter: (newUsernameFilter) => set({ usernameFilter: newUsernameFilter }),
         categoryFilter: "default",
         updateCategoryFilter: (newCategoryFilter) => set({ categoryFilter: newCategoryFilter }),
      }),
      {
         name: "filter-storage",
         storage: createJSONStorage(() => sessionStorage),
      }
   )
);

export default filterStore;
