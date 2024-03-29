import "./CategoryCard.css";
import trashIcon from "../../assets/trashCanIcon.png";
import { tasksByCategory, deleteCategory, editCategory } from "../../utilities/services";
import { useEffect, useState } from "react";
import { userStore } from "../../stores/userStore";
import alertStore from "../../stores/alertStore";

export default function CategoryCard({ category_type, searchTerm }) {
   const [tasksNumber, setTasksNumber] = useState(0);
   const user = userStore.getState().user;
   const [category_typeValue, setCategory_typeValue] = useState(category_type);
   const [atualCategory_type, setAtualCategory_type] = useState(category_type);
   const [removed, setRemoved] = useState(false);
   const { setConfirmMessage, setConfirmVisible, setConfirmCallback } = alertStore();

   //fetch the number of tasks in the category
   useEffect(() => {
      tasksByCategory(category_type, user.token).then((response) => {
         if (!response.ok) {
            throw new Error("Network response was not ok");
         }
         return response.json().then((data) => {
            setTasksNumber(data);
         });
      });
   }, [tasksNumber]);

   //function to set the confirm messages
   const handleAction = (message, callback) => {
      setConfirmMessage(message);
      setConfirmVisible(true);

      setConfirmCallback(callback);
   };

   //function to determine if the category should be visible or not
   const determineCategoryVisibility = (searchTerm) => {
      if (searchTerm === "") return true;
      const lowerCaseTitle = category_type.toLowerCase();

      return lowerCaseTitle.includes(searchTerm) ? true : false;
   };

   const [categoryVisibility, setCategoryVisibility] = useState(() => determineCategoryVisibility(searchTerm));

   // Update category visibility whenever searchTerm changes
   useEffect(() => {
      setCategoryVisibility(determineCategoryVisibility(searchTerm));
   }, [searchTerm]);

   //function to determine if the save button should be disabled or not depending if the category is the same as the current one
   function handleDisabled() {
      if (category_typeValue === atualCategory_type) {
         return true;
      }
      return false;
   }

   //function to set the alert messages
   function handleAlert(message, error) {
      alertStore.getState().setMessage(message);
      alertStore.getState().setVisible(true);
      alertStore.getState().setError(error);
   }

   //function to handle the delete of the category
   function handleDelete() {
      handleAction("Are you sure you want to delete this category?", () => {
         deleteCategory(atualCategory_type, user.token).then((response) => {
            if (!response.ok) {
               handleAlert("This category has tasks, you can't delete it", true);

               throw new Error("Network response was not ok");
            } else {
               handleAlert("Category deleted successfully!", false);
               setRemoved(true);
            }
         });
      });
   }

   //function to handle the edit of the category
   function handleEdit() {
      if (category_typeValue !== "" || category_typeValue !== null) {
         editCategory(atualCategory_type, category_typeValue, user.token).then((response) => {
            if (response.ok) {
               setAtualCategory_type(category_typeValue);

               handleAlert("Category edited successfully!", false);
            } else if (response.status == 400) {
               handleAlert("This category already exists", true);
            } else {
               handleAlert("Error editing category", true);
            }
         });
      }
   }

   return (
      <>
         {removed ? null : categoryVisibility ? (
            <li className="task-item-deleted column-itemWidth">
               <div className="contentCategories">
                  <input
                     className="categoriesTitle-style"
                     value={category_typeValue}
                     onChange={(e) => setCategory_typeValue(e.target.value)}
                     style={{ backgroundColor: handleDisabled() ? "lightgray" : "white" }}
                     disabled={user.role === "productOwner" && category_type !== "No_Category" ? false : true}
                  />

                  {user.role === "productOwner" && category_type != "No_Category" && (
                     <button className="button-edit" disabled={handleDisabled()} onClick={handleEdit}>
                        &#128190;
                     </button>
                  )}
               </div>
               <span className="numberOfTasks">{tasksNumber}</span>

               {user.role === "productOwner" && category_type != "No_Category" && (
                  <button id="deleteBtn" onClick={handleDelete}>
                     <img id="imgTrash" src={trashIcon} alt="delete" />
                  </button>
               )}
            </li>
         ) : null}
      </>
   );
}
