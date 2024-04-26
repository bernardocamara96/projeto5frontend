import { useEffect } from "react";

function useDashboardWebSocket(
   token,
   setUsersValues,
   setTasksValues,
   setDataPerHour,
   setAverageTasksPerUser,
   setAverageHoursToCompleteTask,
   setAverageMinutesToCompleteTask,
   setPrevUsersData,
   setPrevTasksNumberByState
) {
   const WS_URL = `ws://localhost:8080/projeto5backend/websocket/dashboard/${token}`;

   useEffect(() => {
      const socket = new WebSocket(WS_URL);

      socket.onopen = () => {
         console.log("The websocket connection is open");
      };

      socket.onmessage = (event) => {
         console.log(event.data);
         const message = JSON.parse(event.data);

         console.log(message.tasksNumberByState[0]);

         setUsersValues(message.confirmedUsers, message.notConfirmedUsers);
         setTasksValues(message.tasksNumberByState[0], message.tasksNumberByState[1], message.tasksNumberByState[2]);
         setPrevUsersData([message.confirmedUsers, message.notConfirmedUsers]);
         setPrevTasksNumberByState(message.tasksNumberByState);
         setAverageTasksPerUser(message.averageTasksNumberByUser);
         setAverageHoursToCompleteTask(Math.floor(message.averageConclusionTime));
         setAverageMinutesToCompleteTask(Math.floor((message.averageConclusionTime % 1) * 60));
         setDataPerHour("users", message.appHoursArray, message.numberOfUsersRegisterByHour);
         setDataPerHour("tasks", message.appHoursArray, message.cumulativeTasksNumberByHour);
         // Assuming backend sends JSON data
         // Assuming the received data is of the shape { statisticsDto: { /* StatisticsDto fields */ } }
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

export default useDashboardWebSocket;
