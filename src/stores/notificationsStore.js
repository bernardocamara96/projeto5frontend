import { create } from "zustand";

//store for filter data
const notificationsStore = create((set) => ({
   seeNotifications: false,
   setSeeNotifications: (newSeeNotifications) => set({ seeNotifications: newSeeNotifications }),
}));

export default notificationsStore;
