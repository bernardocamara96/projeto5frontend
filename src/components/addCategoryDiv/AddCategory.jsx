import "./AddCategory.css";
import { addCategory } from "../../utilities/services";
import { useState } from "react";
import { userStore } from "../../stores/userStore";
import alertStore from "../../stores/alertStore";
import Button from "react-bootstrap/Button";
import { useMediaQuery } from "react-responsive";

export default function AddCategory({ setCategoryList }) {
   const [category, setCategory] = useState("");
   const user = userStore.getState().user;
   const isMobile = useMediaQuery({ query: "(max-width: 920px)" });

   //function to set the alert messages
   function handleAlert(message, error) {
      alertStore.getState().setMessage(message);
      alertStore.getState().setVisible(true);
      alertStore.getState().setError(error);
   }

   //function to handle the click of the add category button
   function handleClick() {
      if (category !== "" || category !== null) {
         addCategory(category, user.token).then((response) => {
            if (response.ok) {
               return response.json().then((response) => {
                  response.tasksNumber = 0;
                  setCategoryList((prevList) => [...prevList, response]);
                  setCategory("");

                  handleAlert("Category added successfully!", false);
               });
            } else if (response.status == 400) {
               handleAlert("Category already exists", true);

               setCategory("");
            } else {
               handleAlert("Error adding category", true);
            }
         });
      }
   }
   return (
      <>
         {user.role === "productOwner" && (
            <div id="addCategory-id">
               <input
                  type="text"
                  data-testid="category-input"
                  value={category}
                  className="form-control"
                  onChange={(e) => setCategory(e.target.value)}
               />
               <Button data-testid="add-category-button btn-outline-primary" id="addCategory-btn" onClick={handleClick}>
                  <i class="fas fa-plus fa-sm"></i>
                  {!isMobile && <span>&nbsp; Add Category</span>}
               </Button>
            </div>
         )}
      </>
   );
}
