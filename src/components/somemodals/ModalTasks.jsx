import "./ModalTasks.css";
import { getAllCategories, addTaskBE } from "../../utilities/services";
import { useEffect, useState } from "react";
import ModalContent from "./ModalContent";
import alertStore from "../../stores/alertStore";

export default function ModalTasks({ token, setModalVisibility, setFetchTrigger }) {
   const [categories, setCategories] = useState([]);
   const [taskTitle, setTaskTitle] = useState("");
   const [taskDescription, setTaskDescription] = useState("");
   const [taskPriority, setTaskPriority] = useState(1);
   const [taskStartDate, setTaskStartDate] = useState("");
   const [taskEndDate, setTaskEndDate] = useState("");
   const [category_type, setCategory_type] = useState("No_Category");

   //function to set the alert messages
   function handleAlert(message, error) {
      alertStore.getState().setMessage(message);
      alertStore.getState().setVisible(true);
      alertStore.getState().setError(error);
   }

   // Fetch all categories
   useEffect(() => {
      getAllCategories(token)
         .then((response) => {
            if (!response.ok) {
               throw new Error("Network response was not ok");
            }
            return response.json();
         })
         .then(function (data) {
            setCategories(data);
         })

         .catch((error) => {
            console.error("Error fetching data:", error);
         });
   }, []);

   // Function to handle the submit of the add task form
   const handleSubmit = (e) => {
      e.preventDefault();
      addTaskBE(token, taskTitle, taskDescription, taskPriority, taskStartDate, taskEndDate, category_type).then(
         function (response) {
            if (response.status == 201) {
               setTaskTitle("");
               setTaskDescription("");
               setTaskPriority(1);
               setTaskStartDate("");
               setTaskEndDate("");
               setCategory_type("No_Category");
               setFetchTrigger((prev) => !prev);
               setModalVisibility(false);

               handleAlert("Task added successfully!", false);
            } else if (response.status == 400) {
               handleAlert("Invalid data, please check the fields and try again", true);
            } else if (response.status == 403) {
               handleAlert("You don't have permission to add this task :(", true);
            } else {
               handleAlert("Error adding task :(", true);
            }
         }
      );
   };

   return (
      <div>
         <div className="tasksModal" id="tasksModalCreate">
            <form id="taskForm">
               <div className="row-task">
                  <h2 id="add-task">Add Task</h2>
               </div>
               <ModalContent
                  categories={categories}
                  taskTitle={taskTitle}
                  taskDescription={taskDescription}
                  category_type={category_type}
                  taskPriority={taskPriority}
                  taskStartDate={taskStartDate}
                  taskEndDate={taskEndDate}
                  setTaskTitle={setTaskTitle}
                  setTaskDescription={setTaskDescription}
                  setTaskPriority={setTaskPriority}
                  setTaskStartDate={setTaskStartDate}
                  setTaskEndDate={setTaskEndDate}
                  setCategory_type={setCategory_type}
                  modalType={"create"}
               />
               <div className="btns-div">
                  <div className="row-submit">
                     <input id="save-task" type="submit" value="Save Task" onClick={handleSubmit} />
                  </div>
                  <div className="row-cancel">
                     <button id="cancel-task" onClick={() => setModalVisibility(false)}>
                        Cancel
                     </button>
                  </div>
               </div>
            </form>
         </div>
         <div className="modalBackground" onClick={() => setModalVisibility(false)}></div>
      </div>
   );
}
