import { useEffect } from "react";
import useTasksStore from "../../stores/tasksStore";

function useTasksWebSocket(token) {
   const WS_URL = `ws://localhost:8080/projeto5backend/websocket/tasks/${token}`;
   const {
      updateTaskById,
      updateTaskStatusById,
      setSocketTrigger,
      deleteTaskById,
      addDeletedTask,
      deleteDeletedTaskById,
      addTask,
      deletedTasksArray,
      tasksArray,
      setOtherTrigger,
   } = useTasksStore(); // Calling the store directly to get the state

   useEffect(() => {
      const socket = new WebSocket(WS_URL);

      socket.onopen = () => {
         console.log("The websocket connection is open");
      };

      socket.onmessage = (event) => {
         const message = event.data;

         if (message.startsWith("taskStatus:")) {
            var json = message.substring("taskStatus: ".length);

            var taskStatusDto = JSON.parse(json);

            console.log(taskStatusDto);
            updateTaskStatusById(taskStatusDto.id, taskStatusDto.status);

            setSocketTrigger((prev) => !prev);
         } else if (message.startsWith("taskEdit:")) {
            var json = message.substring("taskEdit: ".length);

            var taskDto = JSON.parse(json);

            updateTaskById(taskDto.id, taskDto);

            setSocketTrigger((prev) => !prev);

            // Handle the task status message
         } else if (message.startsWith("taskTempDelete:")) {
            var json = message.substring("taskTempDelete: ".length);

            var taskDto = JSON.parse(json);

            deleteTaskById(taskDto.id);
            addDeletedTask(taskDto);

            setSocketTrigger((prev) => !prev);

            // Handle the task status message
         } else if (message.startsWith("taskRecycle:")) {
            var json = message.substring("taskRecycle: ".length);

            var taskDto = JSON.parse(json);

            addTask(taskDto);
            deleteDeletedTaskById(taskDto.id);
            console.log(tasksArray);

            setSocketTrigger((prev) => !prev);

            // Handle the task status message
         } else if (message.startsWith("taskPermDelete:")) {
            var json = message.substring("taskPermDelete: ".length);

            var id = JSON.parse(json);

            deleteDeletedTaskById(id);

            // Handle the task status message
         } else if (message.startsWith("newTask:")) {
            var json = message.substring("newTask: ".length);

            var taskDto = JSON.parse(json);

            console.log(taskDto);

            addTask(taskDto);

            setOtherTrigger((prev) => !prev);

            // Handle the task status message
         } else if (message.startsWith("allTasksTempDelete:")) {
            var json = message.substring("allTasksTempDelete: ".length);

            var tasksDtos = JSON.parse(json);

            console.log(tasksDtos);

            tasksDtos.forEach((taskDto) => {
               deleteTaskById(taskDto.id);
               addDeletedTask(taskDto);
            });

            setSocketTrigger((prev) => !prev);

            // Handle the task status message
         }
      };

      socket.onerror = (error) => {
         console.error("WebSocket error:", error);
      };

      socket.onclose = () => {
         console.log("The websocket connection is closed");
      };

      return () => {
         // Clean up function to close the websocket connection when the component unmounts
         socket.close();
      };
   }, []);
}

export default useTasksWebSocket;
