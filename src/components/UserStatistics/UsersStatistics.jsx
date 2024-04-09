import "./UsersStatistics.css";
import { useState, useEffect } from "react";
import { tasksNumberByUsernameAndStatus } from "../../utilities/services";
import { usernameStore } from "../../stores/userStore";
import { userStore } from "../../stores/userStore";

export default function UsersStatistics({ username, inputsDisabled, setInputsDisabled }) {
   const [totalTasks, setTotalTasks] = useState(0);
   const [toDoTasks, setToDoTasks] = useState(0);
   const [doingTasks, setDoingTasks] = useState(0);
   const [doneTasks, setDoneTasks] = useState(0);
   const [deletedTasks, setDeletedTasks] = useState(0);
   const { token } = userStore.getState().user;
   const usernameStorage = usernameStore.getState().username;

   useEffect(() => {
      tasksNumberByUsernameAndStatus(username, "total", token).then((response) => {
         return response.json().then((data) => {
            setTotalTasks(data);
         });
      });
      tasksNumberByUsernameAndStatus(username, "100", token).then((response) => {
         return response.json().then((data) => {
            setToDoTasks(data);
         });
      });
      tasksNumberByUsernameAndStatus(username, "200", token).then((response) => {
         return response.json().then((data) => {
            setDoingTasks(data);
         });
      });
      tasksNumberByUsernameAndStatus(username, "300", token).then((response) => {
         return response.json().then((data) => {
            setDoneTasks(data);
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
            <div className="agileCol col-userStats" id="agileCol-userStats">
               <div>Active tasks:</div>
               <div>To Do tasks:</div>
               <div>Doing tasks:</div>
               <div>Done tasks:</div>
               <div>Deleted tasks:</div>
            </div>
            <div className="agileCol  col-userStats col-numTasks">
               <div className="content-userStats-span">{totalTasks}</div>
               <div className="content-userStats-span">{toDoTasks}</div>
               <div className="content-userStats-span">{doingTasks}</div>
               <div className="content-userStats-span">{doneTasks}</div>
               <div className="content-userStats-span">{deletedTasks}</div>
            </div>
         </div>
      </div>
   );
}
