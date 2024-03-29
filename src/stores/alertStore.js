import { create } from "zustand";

const alertStore = create((set) => ({
   message: "",
   setMessage: (newMessage) => set({ message: newMessage }),
   visible: false,
   setVisible: (newVisible) => set({ visible: newVisible }),
   error: false,
   setError: (newError) => set({ error: newError }),
   confirmMessage: "",
   setConfirmMessage: (newConfirmMessage) => set({ confirmMessage: newConfirmMessage }),
   confirmVisible: false,
   setConfirmVisible: (newConfirmVisible) => set({ confirmVisible: newConfirmVisible }),

   confirmCallback: () => {},
   setConfirmCallback: (newConfirmCallback) => set({ confirmCallback: newConfirmCallback }),
}));

export default alertStore;
