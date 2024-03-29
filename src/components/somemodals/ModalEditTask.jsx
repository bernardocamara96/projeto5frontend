import "./ModalTasks.css";
import { getAllCategories, addTaskBE } from "../../utilities/services";
import { useEffect, useState } from "react";
import ModalContent from "./ModalContent";
import { editTaskBE, deleteListener, deleteTask, restaureTask } from "../../utilities/services";
import editPNG from "../../assets/edit.png";
import { userStore, usernameStore } from "../../stores/userStore";
import alertStore from "../../stores/alertStore";

export default function ModalEditTask({ data, setModalVisibility, setFetchTrigger, modalType }) {
   const [categories, setCategories] = useState([]);
   const [newTaskTitle, setNewTaskTitle] = useState(data.title);
   const [newTaskDescription, setNewTaskDescription] = useState(data.description);
   const [newTaskPriority, setNewTaskPriority] = useState(data.priority);
   const [newTaskStartDate, setNewTaskStartDate] = useState(data.startDate);
   const [newTaskEndDate, setNewTaskEndDate] = useState(data.endDate);
   const [newCategory_type, setNewCategory_type] = useState(data.category_type);
   const [inputDisabled, setInputDisabled] = useState(true);
   const { setConfirmMessage, setConfirmVisible, setConfirmCallback } = alertStore();
   const { token, role } = userStore.getState().user;
   const username = usernameStore.getState().username;

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

   //function to set the alert messages
   function handleAlert(message, error) {
      alertStore.getState().setMessage(message);
      alertStore.getState().setVisible(true);
      alertStore.getState().setError(error);
   }

   //function to set the confirm messages
   const handleAction = (message, callback) => {
      setConfirmMessage(message);
      setConfirmVisible(true);
      setConfirmCallback(callback);
   };

   // Function to handle the submit of the edit task form
   const handleSubmit = (e) => {
      e.preventDefault();
      if (modalType !== "deletedTask") {
         editTaskBE(
            token,
            data.id,
            newTaskTitle,
            newTaskDescription,
            newTaskPriority,
            newTaskStartDate,
            newTaskEndDate,
            newCategory_type
         ).then((response) => {
            if (response.ok) {
               setModalVisibility(false);

               setFetchTrigger((prev) => !prev);

               handleAlert("Task edited successfully!", false);
            } else if (response.status === 400) {
               handleAlert("Error editing task :(", true);
            } else if (response.status === 403) {
               handleAlert("You don't have permission to edit this task :(", true);
            } else {
               handleAlert("Error editing task :(", true);
            }
         });
      } else if (modalType === "deletedTask") {
         handleAction("Are you sure you want to restore this task?", () => {
            restaureTask(data.id, token).then((response) => {
               if (response.ok) {
                  setModalVisibility(false);

                  setFetchTrigger((prev) => !prev);

                  handleAlert("Task restored successfully!", false);
               } else if (response.status === 403) {
                  handleAlert("You don't have permission to restore this task :(", true);
               } else {
                  handleAlert("Error restoring task :(", true);
               }
            });
         });
      }
   };

   // Function to handle the delete of the task in the edit task modal
   const handleDelete = (e) => {
      e.preventDefault();
      if (modalType !== "deletedTask") {
         handleAction("Are you sure you want to delete this task?", () => {
            deleteListener(token, data.id).then((response) => {
               if (response.ok) {
                  setModalVisibility(false);
                  setFetchTrigger((prev) => !prev);

                  handleAlert("Task deleted successfully!", false);
               } else {
                  console.error("Falha ao eliminar a tarefa:", response.statusText);

                  handleAlert("Error deleting task :(", true);
               }
            });
         });
      } else if (modalType === "deletedTask") {
         handleAction("Are you sure you want to permanently delete this task?", () => {
            deleteTask(data.id, token).then((response) => {
               if (response.ok) {
                  setFetchTrigger((prev) => !prev);
                  setModalVisibility(false);

                  handleAlert("Task permanently deleted successfully!", false);
               } else {
                  console.error("Falha ao eliminar a tarefa:", response.statusText);

                  handleAlert("Error deleting task :(", true);
               }
            });
         });
      }
   };

   return (
      <div>
         <div className="tasksModal">
            <form id="taskForm">
               <div className="row-task">
                  <h2 id="add-task">{inputDisabled ? "View Task" : "Edit Task"}</h2>
                  {(role === "scrumMaster" || role === "productOwner" || username === data.username_author) &&
                     modalType != "deletedTask" && (
                        <button id="edit-btn" type="button" onClick={() => setInputDisabled((prev) => !prev)}>
                           <img id="edit-icon" src={editPNG} alt="Edit" />
                        </button>
                     )}
               </div>

               <ModalContent
                  categories={categories}
                  taskTitle={newTaskTitle}
                  taskDescription={newTaskDescription}
                  taskPriority={newTaskPriority}
                  taskStartDate={newTaskStartDate}
                  taskEndDate={newTaskEndDate}
                  category_type={newCategory_type}
                  username_author={data.username_author}
                  setTaskTitle={setNewTaskTitle}
                  setTaskDescription={setNewTaskDescription}
                  setTaskPriority={setNewTaskPriority}
                  setTaskStartDate={setNewTaskStartDate}
                  setTaskEndDate={setNewTaskEndDate}
                  setCategory_type={setNewCategory_type}
                  inputDisabled={inputDisabled}
               />
               <div className="btns-div">
                  {!inputDisabled && (
                     <>
                        <div className="row-submit-edit">
                           <input id="save-edit-task" type="submit" value="Save Task" onClick={handleSubmit} />
                        </div>
                        <div className="row-delete">
                           <button id="delete-task" onClick={handleDelete}>
                              Delete task
                           </button>
                        </div>
                     </>
                  )}

                  {modalType === "deletedTask" && role === "productOwner" && (
                     <>
                        <div className="row-submit-edit">
                           <input id="save-edit-task" type="submit" value="Restaure Task" onClick={handleSubmit} />
                        </div>
                        <div className="row-delete">
                           <button id="delete-task" onClick={handleDelete}>
                              Delete Permanently
                           </button>
                        </div>
                     </>
                  )}
                  <div className="row-cancel-edit">
                     <button id="cancel-edit-task" onClick={() => setModalVisibility(false)}>
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
