import HeaderScrum from "../components/Headers/HeaderScrum";
import Footer from "../components/Footers/Footer";
import PieGraphic from "../components/charts/PieGraphic";
import AsideMenu from "../components/Menus/AsideMenu";
import "./Dashboard.css";
import { useEffect, useState } from "react";
import { getDashboardStats } from "../utilities/services";
import { userStore } from "../stores/userStore";
import { useNavigate } from "react-router-dom";
import LineGraphic from "../components/charts/LineGraphic";

export default function Dashboard() {
   const navigate = useNavigate();
   const user = userStore.getState().user;
   const [usersPieData, setUsersPieData] = useState([
      { name: "Confirmed", value: 0 },
      { name: "Not Confirmed", value: 0 },
   ]);
   const [tasksPieData, setTasksPieData] = useState([
      { name: "TO DO", value: 0 },
      { name: "DOING", value: 0 },
      { name: "DONE", value: 0 },
   ]);
   const [averageTasksPerUser, setAverageTasksPerUser] = useState(0);
   const [averageHoursToCompleteTask, setAverageHoursToCompleteTask] = useState(0);
   const [averageMinutesToCompleteTask, setAverageMinutesToCompleteTask] = useState(0);

   const usersPieColors = ["rgba(0, 60, 255, 0.7)", "#FF8042"];
   const tasksPieColors = ["rgb(0, 60, 255, 0.7)", "rgb(255,0,0,0.7)", "rgb(0,128,0,0.65)"];

   const setUsersValues = (confirmedUsers, notConfirmedUsers) => {
      // Create a new array with the updated value
      const updatedData = [
         { name: "Confirmed", value: confirmedUsers }, // Update value for confirmed users
         { name: "Not Confirmed", value: notConfirmedUsers }, // Leave other value unchanged
      ];
      // Set the state with the new array
      setUsersPieData(updatedData);
   };

   const setTasksValues = (toDo_tasks, doing_tasks, done_tasks) => {
      // Create a new array with the updated value
      const updatedData = [
         { name: "TO DO", value: toDo_tasks },
         { name: "DOING", value: doing_tasks },
         { name: "DONE", value: done_tasks },
      ];
      // Set the state with the new array
      setTasksPieData(updatedData);
   };

   useEffect(() => {
      getDashboardStats(user.token).then((response) => {
         if (response.status === 403) {
            navigate("/", { replace: true });
         } else if (response.ok) {
            return response.json().then((data) => {
               setUsersValues(data.confirmedUsers, data.notConfirmedUsers);
               setTasksValues(data.tasksNumberByState[0], data.tasksNumberByState[1], data.tasksNumberByState[2]);
               setAverageTasksPerUser(data.averageTasksNumberByUser);
               setAverageHoursToCompleteTask(Math.floor(data.averageConclusionTime));
               setAverageMinutesToCompleteTask(Math.floor((data.averageConclusionTime % 1) * 60));
            });
         }
      });
   }, []);

   return (
      <>
         <HeaderScrum />
         <AsideMenu />
         <main className="scrum-main">
            <div id="dashboard-body">
               <div className="containerPieDiv">
                  <div id="banner-PieDiv" className="banner_register">
                     <span>
                        <i class="fas fa-users"></i>&nbsp;&nbsp;Users
                     </span>
                  </div>
                  <div className="flex-row-charts">
                     <div id="pieDiv">
                        <PieGraphic data={usersPieData} colors={usersPieColors} />
                     </div>
                     <LineGraphic></LineGraphic>
                  </div>
                  <div>
                     <p className="tasks-number-per-user">Average number of tasks per user: {averageTasksPerUser}</p>
                  </div>
               </div>
               <div className="containerPieDiv">
                  <div id="banner-PieDiv" className="banner_register">
                     <span>
                        <i class="fas fa-tasks"></i>&nbsp;&nbsp;Tasks
                     </span>
                  </div>
                  <div className="flex-row-charts">
                     <div id="pieDiv">
                        <PieGraphic data={tasksPieData} colors={tasksPieColors} />
                     </div>
                     <LineGraphic></LineGraphic>
                  </div>
                  <div>
                     <p className="tasks-number-per-user">
                        Average time it takes for a task to be completed: {averageHoursToCompleteTask} hours and{" "}
                        {averageMinutesToCompleteTask} minutes
                     </p>
                  </div>
               </div>
            </div>
         </main>
         <Footer />
      </>
   );
}
