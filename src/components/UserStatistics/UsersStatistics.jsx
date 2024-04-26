import "./UsersStatistics.css";
import { useState, useEffect } from "react";
import { tasksNumberByUsernameAndStatus } from "../../utilities/services";
import { userStore } from "../../stores/userStore";
import PieGraphic from "../charts/PieGraphic";
import translationStore from "../../stores/translationStore";
import languages from "../../translations";
import { IntlProvider, FormattedMessage } from "react-intl";

export default function UsersStatistics({ username, inputsDisabled, setInputsDisabled }) {
   const [deletedTasks, setDeletedTasks] = useState(0);
   const { token } = userStore.getState().user;
   const { locale } = translationStore();
   const [tasksPieData, setTasksPieData] = useState([
      { name: locale === "en" ? "TO DO" : "POR FAZER", value: 0 },
      { name: locale === "en" ? "DOING" : "EM PROGRESSO", value: 0 },
      { name: locale === "en" ? "DONE" : "FEITO", value: 0 },
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
      const fetchTasksData = async () => {
         try {
            const todoResponse = await tasksNumberByUsernameAndStatus(username, "100", token);
            const doingResponse = await tasksNumberByUsernameAndStatus(username, "200", token);
            const doneResponse = await tasksNumberByUsernameAndStatus(username, "300", token);
            const deletedResponse = await tasksNumberByUsernameAndStatus(username, "deleted", token);

            const todoData = await todoResponse.json();
            const doingData = await doingResponse.json();
            const doneData = await doneResponse.json();
            const deletedData = await deletedResponse.json();

            // Update task data based on the locale
            setTasksPieData([
               { name: locale === "en" ? "TO DO" : "POR FAZER", value: todoData },
               { name: locale === "en" ? "DOING" : "EM PROGRESSO", value: doingData },
               { name: locale === "en" ? "DONE" : "FEITO", value: doneData },
            ]);

            setDeletedTasks(deletedData);
            setInputsDisabled(true);
         } catch (error) {
            console.error("Error fetching tasks data:", error);
         }
      };

      fetchTasksData();
   }, [username, locale]);

   return (
      <IntlProvider locale={locale} messages={languages[locale]}>
         <div id="userStatistics-container" className="agileForm">
            <div className="banner_register" id="banner-userStatistics">
               <i class="fas fa-chart-line fa-lg"></i>
               <p id="usersStatistics-p">
                  <FormattedMessage id="user-stats" />
               </p>
            </div>
            <div className="agileRow" id="content-userStats">
               <div className="agileCol  col-userStats col-numTasks">
                  <div id="pie-userStatistics">
                     {tasksPieData[0].value === 0 && tasksPieData[1].value === 0 && tasksPieData[2].value === 0 ? (
                        <div
                           className="content-userStats-span"
                           style={{ width: "100%", border: "none", marginBottom: "20%", marginTop: "20%" }}
                        >
                           <FormattedMessage id="user-without-tasks" />
                        </div>
                     ) : (
                        <PieGraphic data={tasksPieData} colors={tasksPieColors} />
                     )}
                  </div>
                  <div id="flex-row-deletedTasks">
                     <FormattedMessage id="deleted-tasks" /> :
                     <div className="content-userStats-span">{deletedTasks}</div>
                  </div>
               </div>
            </div>
         </div>
      </IntlProvider>
   );
}
