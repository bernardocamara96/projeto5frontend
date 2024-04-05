import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

//store for filter data
const notificationsStore = create(
   persist(
      (set) => ({
         notifications: [], // state variable to keep all notifications
         updateNotifications: (notifications) => (set = { notifications }), // a function to update the list of notifications
         addNotification: (newNotification) =>
            set((state) => ({ notifications: [...state.notifications, newNotification] })), // a function to add a new notification to the list of notifications
      }),
      {
         name: "notifications-storage",
         storage: createJSONStorage(() => sessionStorage),
      }
   )
);

export default notificationsStore;
