import "./UsersStatistics.css";
import { useState, useEffect } from "react";
import { tasksNumberByUsernameAndStatus } from "../../utilities/services";

import { userStore } from "../../stores/userStore";
import PieGraphic from "../charts/PieGraphic";

export default function UsersStatistics({ username, inputsDisabled, setInputsDisabled }) {
   const [deletedTasks, setDeletedTasks] = useState(0);
   const { token } = userStore.getState().user;
   const [tasksPieData, setTasksPieData] = useState([
      { name: "TO DO", value: 0 },
      { name: "DOING", value: 0 },
      { name: "DONE", value: 0 },
   ]);
   const tasksPieColors = ["rgb(0, 60, 255, 0.7)", "rgb(255,0,0,0.7)", "rgb(0,128,0,0.65)"];

   const updateTaskValue = (name, value) => {
      setTasksPieData((prevData) => {
         // Find the index of the element to update
         const index = prevData.findIndex((task) => task.name === name);

         if (index !== -1) {
            // If the element exists, update its value
            const updatedData = [...prevData];
            updatedData[index] = { ...updatedData[index], value };
            return updatedData;
         } else {
            // If the element doesn't exist, return the previous state
            return prevData;
         }
      });
   };

   useEffect(() => {
      tasksNumberByUsernameAndStatus(username, "100", token).then((response) => {
         return response.json().then((data) => {
            updateTaskValue("TO DO", data);
         });
      });
      tasksNumberByUsernameAndStatus(username, "200", token).then((response) => {
         return response.json().then((data) => {
            updateTaskValue("DOING", data);
         });
      });
      tasksNumberByUsernameAndStatus(username, "300", token).then((response) => {
         return response.json().then((data) => {
            updateTaskValue("DONE", data);
         });
      });
      tasksNumberByUsernameAndStatus(username, "deleted", token).then((response) => {
         return response.json().then((data) => {
            setDeletedTasks(data);
         });
      });
      setInputsDisabled(true);
   }, [username]);

   return (
      <div id="userStatistics-container" className="agileForm">
         <div className="banner_register" id="banner-userStatistics">
            <i class="fas fa-chart-line fa-lg"></i>
            <p id="usersStatistics-p">User Stats</p>
         </div>
         <div className="agileRow" id="content-userStats">
            <div className="agileCol  col-userStats col-numTasks">
               <div id="pie-userStatistics">
                  <PieGraphic data={tasksPieData} colors={tasksPieColors} />
               </div>
               <div id="flex-row-deletedTasks">
                  Deleted tasks: <div className="content-userStats-span">{deletedTasks}</div>
               </div>
            </div>
         </div>
      </div>
   );
}
