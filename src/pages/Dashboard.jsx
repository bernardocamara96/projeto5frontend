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
import { useMediaQuery } from "react-responsive";
import useDashboardWebSocket from "../components/websocket/useDashboardWebSocket";
import notificationsStore from "../stores/notificationsStore";

export default function Dashboard() {
   const navigate = useNavigate();
   const user = userStore.getState().user;
   const [usersPieData, setUsersPieData] = useState([
      { name: "Confirmed", value: 0 },
      { name: "Unconfirmed", value: 0 },
   ]);
   const [tasksPieData, setTasksPieData] = useState([
      { name: "TO DO", value: 0 },
      { name: "DOING", value: 0 },
      { name: "DONE", value: 0 },
   ]);
   const [averageTasksPerUser, setAverageTasksPerUser] = useState(0);
   const [averageHoursToCompleteTask, setAverageHoursToCompleteTask] = useState(0);
   const [averageMinutesToCompleteTask, setAverageMinutesToCompleteTask] = useState(0);
   const [userByHour, setUserByHour] = useState([]);
   const [tasksByHour, setTasksByHour] = useState([]);
   const usersPieColors = ["rgba(0, 60, 255, 0.7)", "#FF8042"];
   const tasksPieColors = ["rgb(0, 60, 255, 0.7)", "rgb(255,0,0,0.7)", "rgb(0,128,0,0.65)"];
   const isTablet = useMediaQuery({ query: "(max-width: 1020px)" });
   const isMobile = useMediaQuery({ query: "(max-width: 860px)" });
   const isSmallMobile = useMediaQuery({ query: "(max-width: 670px)" });
   const screenWidth = window.innerWidth;
   const screenHeight = window.innerHeight;
   const resolution = screenWidth / screenHeight;
   const isMobileResolution = resolution < 0.75;
   const setSeeNotifications = notificationsStore((state) => state.setSeeNotifications);

   const setUsersValues = (confirmedUsers, notConfirmedUsers) => {
      // Create a new array with the updated value
      const updatedData = [
         { name: "Confirmed", value: confirmedUsers }, // Update value for confirmed users
         { name: "Unconfirmed", value: notConfirmedUsers }, // Leave other value unchanged
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

   const setDataPerHour = (string, dates, users) => {
      let usersByDate = [];

      let newDates = [];

      dates.forEach((item) => {
         let date = new Date(item);

         let formattedDate = date.getDate() + " " + date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });

         newDates.push(formattedDate);
      });

      for (let i = 0; i < newDates.length; i++) {
         if (string === "users") {
            var entry = {
               date: newDates[i],
               users: users[i],
            };
         } else {
            var entry = {
               date: newDates[i],
               tasks: users[i],
            };
         }
         usersByDate.push(entry);
      }
      if (string === "users") setUserByHour(usersByDate);
      else setTasksByHour(usersByDate);

      console.log(userByHour);
   };

   useDashboardWebSocket(
      user.token,
      setUsersValues,
      setTasksValues,
      setDataPerHour,
      setAverageTasksPerUser,
      setAverageHoursToCompleteTask,
      setAverageMinutesToCompleteTask
   );

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
               setDataPerHour("users", data.appHoursArray, data.numberOfUsersRegisterByHour);
               setDataPerHour("tasks", data.appHoursArray, data.cumulativeTasksNumberByHour);
               console.log(data);
            });
         }
      });
   }, []);

   return (
      <>
         <HeaderScrum />
         <AsideMenu />
         <main className="scrum-main" onClick={() => setSeeNotifications(false)}>
            <div id="dashboard-body">
               <div className="containerPieDiv">
                  <div id="banner-PieDiv" className="banner_register">
                     <span>
                        <i class="fas fa-users"></i>&nbsp;&nbsp;Users
                     </span>
                  </div>
                  <div className="flex-row-charts" style={{ flexDirection: isMobileResolution && "column" }}>
                     <div
                        id="pieDiv"
                        style={{ height: isMobileResolution && "23vh", width: isMobileResolution && "100%" }}
                     >
                        <PieGraphic
                           data={usersPieData}
                           colors={usersPieColors}
                           isSmallMobile={isSmallMobile}
                           isMobileResolution={isMobileResolution}
                        />
                     </div>

                     <LineGraphic
                        data={userByHour}
                        isTablet={isTablet}
                        isMobile={isMobile}
                        isSmallMobile={isSmallMobile}
                        isMobileResolution={isMobileResolution}
                        dataName="users"
                     />
                  </div>
                  <div className="flex-row-charts" style={{ marginTop: isMobileResolution && "5px" }}>
                     <div className="tasks-number-per-user">
                        Average number of tasks per user: {averageTasksPerUser}
                     </div>
                     <div className="tasks-number-per-user graph-label">
                        Chart: Number of registered users over time (day and hour)
                     </div>
                  </div>
               </div>
               <div className="containerPieDiv">
                  <div id="banner-PieDiv" className="banner_register">
                     <span>
                        <i class="fas fa-tasks"></i>&nbsp;&nbsp;Tasks
                     </span>
                  </div>
                  <div className="flex-row-charts" style={{ flexDirection: isMobileResolution && "column" }}>
                     <div
                        id="pieDiv"
                        style={{ height: isMobileResolution && "23vh", width: isMobileResolution && "100%" }}
                     >
                        <PieGraphic
                           data={tasksPieData}
                           colors={tasksPieColors}
                           isSmallMobile={isSmallMobile}
                           isMobileResolution={isMobileResolution}
                        />
                     </div>
                     <LineGraphic
                        data={tasksByHour}
                        isTablet={isTablet}
                        isMobile={isMobile}
                        isSmallMobile={isSmallMobile}
                        isMobileResolution={isMobileResolution}
                        dataName="tasks"
                     />
                  </div>
                  <div>
                     <div className="flex-row-charts" style={{ marginTop: isMobileResolution && "5px" }}>
                        <div className="tasks-number-per-user">
                           Average task completion time:{" "}
                           {averageHoursToCompleteTask != 0 && averageHoursToCompleteTask + " hours and "}
                           {averageMinutesToCompleteTask} minutes
                        </div>
                        <div className="tasks-number-per-user graph-label">
                           Chart: Number of tasks completed over time (day and hour)
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </main>
         <Footer />
      </>
   );
}
