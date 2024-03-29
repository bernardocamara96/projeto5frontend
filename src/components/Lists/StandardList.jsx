import "./StandardList.css";
import { useEffect, useState } from "react";
import { loadDeletedTasks, loadCategories } from "../../utilities/services";
import { userStore } from "../../stores/userStore";
import NonDraggableTask from "../cards/NonDraggableTask";
import CategoryCard from "../cards/CategoryCard";
import AddCategory from "../addCategoryDiv/AddCategory";
import ModalEditTask from "../somemodals/ModalEditTask";

export default function StandardList({ type }) {
   const user = userStore.getState().user;
   const [deletedTasks, setDeletedTasks] = useState([]);
   const [fetchTrigger, setFetchTrigger] = useState(false);
   const [categoryList, setCategoryList] = useState([]);
   const [taskData, setTaskData] = useState({});
   const [modalEditVisibility, setModalEditVisibility] = useState(false);
   const [searchTerm, setSearchTerm] = useState("");
   const [searchCategory, setSearchCategory] = useState("");

   //fetch the deleted tasks or categories, depending on the page
   useEffect(() => {
      if (type === "taskList") {
         loadDeletedTasks(user.token).then((response) => {
            if (!response.ok) {
               throw new Error("Network response was not ok");
            }
            return response.json().then((data) => {
               setDeletedTasks(data);
            });
         });
      } else if (type === "categoriesList") {
         loadCategories(user.token).then((response) => {
            if (!response.ok) {
               throw new Error("Network response was not ok");
            }
            return response.json().then((data) => {
               setCategoryList(data);
            });
         });
      }
   }, [fetchTrigger]);

   //function to handle the double click on a task, it will create the modal to edit the task
   const handleTaskDoubleClick = (taskData) => {
      setModalEditVisibility(true);
      setTaskData(taskData);
   };

   return (
      <div className="mainBoard-settings" id="mainBoard-settings">
         <div className="user-list">
            <br />

            <br />
            <div className="box-container" id="box-deletedTasks">
               {type === "taskList" ? (
                  <>
                     <div id="title-deleted-tasks">
                        <h3 id="user-list">List of Deleted Tasks</h3>
                     </div>
                     <div className="search-container" id="search-container-deleted">
                        <input
                           type="text"
                           id="taskSearch"
                           placeholder="🔍 Search tasks by title or description"
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                        />
                     </div>
                  </>
               ) : (
                  <>
                     <div id="title-deleted-tasks">
                        <h3 id="user-list">List of Categories</h3>
                     </div>
                     <div className="search-container" id="search-container-deleted">
                        <input
                           type="text"
                           id="taskSearch"
                           placeholder="🔍 Search categories"
                           value={searchCategory}
                           onChange={(e) => setSearchCategory(e.target.value)}
                        />
                        <AddCategory setCategoryList={setCategoryList} />
                     </div>
                  </>
               )}
               <div id="scrollable-div">
                  <ul className="ul-tasks" id="DELETED_COLUMN">
                     {type === "taskList" &&
                        deletedTasks.map((task) => {
                           return (
                              <NonDraggableTask
                                 key={task.id}
                                 id={task.id}
                                 title={task.title}
                                 description={task.description}
                                 priority={task.priority}
                                 startDate={task.startDate}
                                 endDate={task.endDate}
                                 category_type={task.category_type}
                                 username_author={task.username_author}
                                 status={task.status === 100 ? "TO DO" : task.status === 200 ? "DOING" : "DONE"}
                                 setFetchTrigger={setFetchTrigger}
                                 onDoubleClick={handleTaskDoubleClick}
                                 searchTerm={searchTerm}
                              />
                           );
                        })}

                     {type === "categoriesList" &&
                        categoryList.map((category) => {
                           return (
                              <CategoryCard
                                 key={category.id}
                                 category_type={category.type}
                                 setFetchTrigger={setFetchTrigger}
                                 searchTerm={searchCategory}
                              />
                           );
                        })}
                  </ul>
               </div>
            </div>
         </div>
         {modalEditVisibility && (
            <ModalEditTask
               setModalVisibility={setModalEditVisibility}
               token={user.token}
               data={taskData}
               setFetchTrigger={setFetchTrigger}
               modalType={"deletedTask"}
            />
         )}
      </div>
   );
}
