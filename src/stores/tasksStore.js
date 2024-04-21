import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

//store for filter data
const useTasksStore = create(
   persist(
      (set) => ({
         tasksArray: [],
         deletedTasksArray: [],
         updateTasks: (tasks) => set({ tasksArray: tasks }),
         updateDeletedTasks: (tasks) => set({ deletedTasksArray: tasks }),
         addTask: (newTask) => set((state) => ({ tasksArray: [...state.tasksArray, newTask] })),
         addDeletedTask: (newTask) => set((state) => ({ deletedTasksArray: [...state.deletedTasksArray, newTask] })),

         updateTaskById: (taskId, updatedTask) => {
            set((state) => {
               // Find the index of the task in the array
               const index = state.tasksArray.findIndex((task) => task.id === taskId);

               if (index !== -1) {
                  // Create a new array with the updated task
                  const updatedTasks = [...state.tasksArray];
                  updatedTasks[index] = { ...updatedTasks[index], ...updatedTask };
                  console.log(updatedTasks[index].status);

                  // Return the new state with the updated array
                  return { tasksArray: updatedTasks };
               }

               // If task with given ID is not found, return current state
               return state;
            });
         },
         updateTaskStatusById: (taskId, newStatus) => {
            set((state) => {
               // Find the index of the task in the array
               const index = state.tasksArray.findIndex((task) => task.id === taskId);

               if (index !== -1) {
                  // Create a new array with the updated task
                  const updatedTasks = [...state.tasksArray];
                  // Update only the status of the task at the found index
                  updatedTasks[index] = { ...updatedTasks[index], status: newStatus };

                  // Return the new state with the updated array
                  return { tasksArray: updatedTasks };
               }

               // If task with given ID is not found, return current state
               return state;
            });
         },
         otherTrigger: false,
         setOtherTrigger: (trigger) => set({ otherTrigger: trigger }),
         getTaskById: (taskId) => {
            return useTasksStore.getState().tasksArray.find((task) => task.id === taskId); // a function to add a new notification to the list of notifications
         },
         socketTrigger: false,
         setSocketTrigger: (trigger) => set({ socketTrigger: trigger }),
         deleteTaskById: (taskId) => {
            set((state) => ({
               tasksArray: state.tasksArray.filter((task) => task.id !== taskId),
            }));
         },
         deleteDeletedTaskById: (taskId) => {
            set((state) => ({
               deletedTasksArray: state.deletedTasksArray.filter((task) => task.id !== taskId),
            }));
         },
      }),
      {
         name: "tasks-storage",
         storage: createJSONStorage(() => sessionStorage),
      }
   )
);

export default useTasksStore;
