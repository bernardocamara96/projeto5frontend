import Column from "./Column";
import "./ColumnsContainer.css";
import { useEffect } from "react";
import {
   loadTasks,
   updateTaskStatus,
   loadTasksByUser,
   loadTasksByCategory,
   loadTasksByUserAndCategory,
} from "../../utilities/services";
import { userStore } from "../../stores/userStore";
import { DragDropContext } from "react-beautiful-dnd";
import filterStore from "../../stores/filterStore";

export default function ColumnsContainer({ token, tasks, setTasks, fetchTrigger, setFetchTrigger, searchTerm }) {
   const { TODOtasks, DOINGtasks, DONEtasks } = tasks;
   const { setTODOtasks, setDOINGtasks, setDONEtasks } = setTasks;
   const { usernameFilter, categoryFilter } = filterStore.getState();

   const user = userStore.getState().user;

   // Function to handle the drag and drop of the tasks
   const handleDragEnd = (result) => {
      const { source, destination, draggableId } = result;

      if (!destination) return;

      if (destination.droppableId === source.droppableId) {
         // Reorder the tasks within the same column
         let updatedTasks;
         switch (destination.droppableId) {
            case "TO DO":
               updatedTasks = Array.from(TODOtasks);
               break;
            case "DOING":
               updatedTasks = Array.from(DOINGtasks);
               break;
            case "DONE":
               updatedTasks = Array.from(DONEtasks);
               break;
            default:
               return;
         }
         const [removed] = updatedTasks.splice(source.index, 1);
         updatedTasks.splice(destination.index, 0, removed);

         // Update the state with the reordered tasks
         switch (destination.droppableId) {
            case "TO DO":
               setTODOtasks(updatedTasks);
               break;
            case "DOING":
               setDOINGtasks(updatedTasks);
               break;
            case "DONE":
               setDONEtasks(updatedTasks);
               break;
            default:
               return;
         }
      } else {
         // If the draggable was dropped in a different column
         // Remove the task from the source column
         let sourceTasks;
         switch (source.droppableId) {
            case "TO DO":
               sourceTasks = Array.from(TODOtasks);
               break;
            case "DOING":
               sourceTasks = Array.from(DOINGtasks);
               break;
            case "DONE":
               sourceTasks = Array.from(DONEtasks);
               break;
            default:
               return;
         }
         sourceTasks.splice(source.index, 1);

         switch (source.droppableId) {
            case "TO DO":
               setTODOtasks(sourceTasks);
               break;
            case "DOING":
               setDOINGtasks(sourceTasks);
               break;
            case "DONE":
               setDONEtasks(sourceTasks);
               break;
            default:
               return;
         }
      }

      if (source.droppableId !== destination.droppableId) {
         const taskId = draggableId;
         const newStatus = destination.droppableId === "TO DO" ? 100 : destination.droppableId === "DOING" ? 200 : 300;
         updateTaskStatus(token, taskId, newStatus).then((response) => {
            if (response.ok) {
               setFetchTrigger((prev) => !prev);
            } else {
               console.error("Failed to update task status:", response.statusText);
            }
         });
      }
   };

   // Load the tasks when fetchtrigger changes

   useEffect(() => {
      if (token) {
         if (usernameFilter === "default" && categoryFilter === "default") {
            loadTasks(token).then((response) => {
               if (response.ok) {
                  response.json().then((tasksFromServer) => {
                     const tasks = tasksFromServer;
                     console.log(tasks);
                     auxiliarFilterFunction(tasks);
                  });
               } else if (response.status === 403) {
                  console.log("You don't have permission to access this page. Please login again.");
               } else {
                  console.error("Falha ao carregar tarefas:", response.statusText);
               }
            });
         } else if (usernameFilter !== "default" && categoryFilter === "default") {
            loadTasksByUser(user.token, usernameFilter).then((response) => {
               if (response.ok) {
                  response.json().then((tasksFromServer) => {
                     const tasks = tasksFromServer;

                     auxiliarFilterFunction(tasks);
                  });
               } else if (response.status === 403) {
                  alert("You don't have permission to access this page. Please login again.");
               } else {
                  console.error("Falha ao carregar tarefas:", response.statusText);
               }
            });
         } else if (usernameFilter === "default" && categoryFilter !== "default") {
            loadTasksByCategory(user.token, categoryFilter).then((response) => {
               if (response.ok) {
                  response.json().then((tasksFromServer) => {
                     const tasks = tasksFromServer;

                     auxiliarFilterFunction(tasks);
                  });
               } else if (response.status === 403) {
                  alert("You don't have permission to access this page. Please login again.");
               } else {
                  console.error("Falha ao carregar tarefas:", response.statusText);
               }
            });
         } else {
            loadTasksByUserAndCategory(user.token, usernameFilter, categoryFilter).then((response) => {
               if (response.ok) {
                  response.json().then((tasksFromServer) => {
                     const tasks = tasksFromServer;
                     auxiliarFilterFunction(tasks);
                  });
               } else if (response.status === 403) {
                  alert("You don't have permission to access this page. Please login again.");
               } else {
                  console.error("Falha ao carregar tarefas:", response.statusText);
               }
            });
         }
      }
   }, [fetchTrigger]);

   //auxiliar function to filter the tasks
   function auxiliarFilterFunction(tasks) {
      const componentsByStatus = {
         TODO: tasks.filter((task) => task.status === 100),
         DOING: tasks.filter((task) => task.status === 200),
         DONE: tasks.filter((task) => task.status === 300),
      };

      setTODOtasks(componentsByStatus.TODO);
      setDOINGtasks(componentsByStatus.DOING);
      setDONEtasks(componentsByStatus.DONE);
   }
   return (
      <DragDropContext onDragEnd={handleDragEnd}>
         <div className="tasks-row" style={{ marginLeft: user.role === "developer" ? "150px" : "300px" }}>
            <Column
               title="TO DO"
               token={token}
               tasks={TODOtasks}
               setFetchTrigger={setFetchTrigger}
               tasksNumber={TODOtasks.length}
               searchTerm={searchTerm}
            />
            <Column
               title="DOING"
               tasks={DOINGtasks}
               setFetchTrigger={setFetchTrigger}
               tasksNumber={DOINGtasks.length}
               searchTerm={searchTerm}
            />
            <Column
               title="DONE"
               tasks={DONEtasks}
               setFetchTrigger={setFetchTrigger}
               tasksNumber={DONEtasks.length}
               searchTerm={searchTerm}
            />
         </div>
      </DragDropContext>
   );
}
