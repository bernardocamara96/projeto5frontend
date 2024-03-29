import trashIcon from "../../assets/trashCanIcon.png";
import "./task.css";
import { deleteListener } from "../../utilities/services";
import { userStore, usernameStore } from "../../stores/userStore";
import alertStore from "../../stores/alertStore";
import { updateTaskStatus, deleteTask, restaureTask } from "../../utilities/services";

export default function Task({
   id,
   title,
   username_author,
   category_type,
   description,
   priority,
   buttonVisibility,
   setFetchTrigger,
   status,
   type,
}) {
   const user = userStore.getState().user;
   const username = usernameStore.getState().username;

   const { setConfirmMessage, setConfirmVisible, setConfirmCallback } = alertStore();

   //function to set the confirm messages
   const handleAction = (message, callback) => {
      setConfirmMessage(message);
      setConfirmVisible(true);
      setConfirmCallback(callback);
   };

   //function to set the alert messages
   function handleAlert(message, error) {
      alertStore.getState().setMessage(message);
      alertStore.getState().setVisible(true);
      alertStore.getState().setError(error);
   }

   //function to handle the delete of the task
   const handleDelete = (e) => {
      e.preventDefault();

      if (type === "non-draggable") {
         handleAction("Are you sure you want to permanently delete this task?", () => {
            deleteTask(id, user.token).then((response) => {
               if (response.ok) {
                  setFetchTrigger((prev) => !prev);

                  handleAlert("Task permanently deleted successfully :)", false);
               } else {
                  console.error("Falha ao eliminar a tarefa:", response.statusText);
               }
            });
         });
      } else {
         handleAction("Are you sure you want to delete this task?", () => {
            deleteListener(user.token, id).then((response) => {
               if (response.ok) {
                  setFetchTrigger((prev) => !prev);

                  handleAlert("Task deleted successfully :)", false);
               } else {
                  console.error("Falha ao eliminar a tarefa:", response.statusText);
               }
            });
         });
      }
   };

   //function to handle the next button inside the task
   const handleNextButton = (e) => {
      var newStatus = status === "TO DO" ? 200 : status === "DOING" ? 300 : null;

      updateTaskStatus(user.token, id, newStatus).then((response) => {
         if (response.ok) {
            setFetchTrigger((prev) => !prev);
         } else {
            console.error("Falha ao atualizar o status da tarefa:", response.statusText);
         }
      });
   };

   //function to handle the previous button inside the task
   const handlePreviousButton = (e) => {
      var newStatus = status === "DONE" ? 200 : status === "DOING" ? 100 : null;

      updateTaskStatus(user.token, id, newStatus).then((response) => {
         if (response.ok) {
            setFetchTrigger((prev) => !prev);
         } else {
            console.error("Falha ao atualizar o status da tarefa:", response.statusText);
         }
      });
   };

   //function to handle the restore of the task
   const handleRestaure = (e) => {
      handleAction("Are you sure you want to restore this task?", () => {
         restaureTask(id, user.token).then((response) => {
            if (response.ok) {
               setFetchTrigger((prev) => !prev);
               handleAlert("Task restored successfully :)", false);
            } else {
               handleAlert("Something went wrong :(", true);

               console.error("Falha ao atualizar o status da tarefa:", response.statusText);
            }
         });
      });
   };
   return (
      <>
         <div
            className="banner"
            style={{
               backgroundColor:
                  status === "TO DO"
                     ? "rgb(0, 60, 255, 0.7)"
                     : status === "DOING"
                     ? "rgb(255,0,0,0.7)"
                     : status === "DONE" && "rgb(0,128,0,0.65)",
            }}
         >
            <h3 id="title-task-banner">{title.length > 10 ? title.substring(0, 10) + "..." : title}</h3>
            <div className="category_author">
               <span style={{ marginRight: "30px" }}>
                  {username_author === "deletedTasks" ? "Deleted user" : username_author.substring(0, 11)}
               </span>
               <span>{category_type.substring(0, 8)}</span>
            </div>
         </div>
         <div className="lower-side-task">
            <div className="content">
               <p id="description-task">
                  {description.length > 42 ? description.substring(0, 38) + "..." : description}
               </p>
            </div>

            <div
               className="priority-div"
               style={{ backgroundColor: priority === 1 ? "green" : priority === 2 ? "yellow" : "red" }}
            ></div>

            <div
               className="content_buttons"
               style={{
                  marginLeft:
                     type === "non-draggable"
                        ? "210px"
                        : status === "TO DO"
                        ? username_author === username || user.role === "productOwner" || user.role === "scrumMaster"
                           ? "255px"
                           : "280px"
                        : status === "DOING"
                        ? username_author === username || user.role === "productOwner" || user.role === "scrumMaster"
                           ? "230px"
                           : "255px"
                        : status === "DONE"
                        ? username_author === username || user.role === "productOwner" || user.role === "scrumMaster"
                           ? "255px"
                           : "280px"
                        : null,
               }}
            >
               {status === "TO DO" || type == "non-draggable" ? null : (
                  <button style={{ visibility: buttonVisibility }} children="<" onClick={handlePreviousButton}></button>
               )}

               {type === "non-draggable" && user.role === "productOwner" && (
                  <button style={{ visibility: buttonVisibility }} onClick={handleRestaure}>
                     &#x21bb;
                  </button>
               )}
               {((type != "non-draggable" &&
                  (username_author === username || user.role === "productOwner" || user.role === "scrumMaster")) ||
                  (type === "non-draggable" && user.role === "productOwner")) && (
                  <button className="btn-dlt" style={{ visibility: buttonVisibility }} onClick={handleDelete}>
                     <img src={trashIcon} alt="del" />
                  </button>
               )}

               {status === "DONE" || type === "non-draggable" ? null : (
                  <button style={{ visibility: buttonVisibility }} children=">" onClick={handleNextButton}></button>
               )}
            </div>
         </div>
      </>
   );
}
