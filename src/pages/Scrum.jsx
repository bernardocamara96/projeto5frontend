import AsideMenu from "../components/Menus/AsideMenu.jsx";
import HeaderScrum from "../components/Headers/HeaderScrum.jsx";
import Footer from "../components/Footers/Footer.jsx";
import ColumnsContainer from "../components/columns/ColumnsContainer.jsx";
import "../main.css";
import { useEffect, useState } from "react";
import { userStore } from "../stores/userStore";
import Filters from "../components/Filters/Filters.jsx";
import AlertsMessage from "../components/somemodals/messagesModal/AlertsMessage.jsx";
import { userRole } from "../utilities/services.js";
import { useNavigate } from "react-router-dom";

export default function Scrum() {
   const user = userStore.getState().user;

   const [fetchTrigger, setFetchTrigger] = useState(false);
   const [searchTermHome, setSearchTermHome] = useState("");
   const [TODOtasks, setTODOtasks] = useState([]);
   const [DOINGtasks, setDOINGtasks] = useState([]);
   const [DONEtasks, setDONEtasks] = useState([]);
   const [role, setRole] = useState("developer");
   const navigate = useNavigate();

   useEffect(() => {
      userRole(user.token).then((response) => {
         if (response.ok) {
            response.json().then((data) => {
               setRole(data.role);
            });
         } else {
            navigate("/", { replace: true });
         }
      });
   });

   return (
      <>
         <HeaderScrum />
         <AsideMenu />
         <main id="scrumMain" className="scrum-main">
            <div id="scrumPage-content">
               <div className="search-container-homepage" id="search-container-homepage">
                  <input
                     type="text"
                     id="taskSearchHomepage"
                     placeholder="🔍 Search tasks by title or description"
                     value={searchTermHome}
                     className="form-control"
                     onChange={(e) => setSearchTermHome(e.target.value)}
                     style={{ marginLeft: user.role === "developer" && "15%" }}
                  />
                  {user.role === "developer" ? null : (
                     <Filters
                        id="filters-scrum"
                        tasks={{ TODOtasks, DOINGtasks, DONEtasks }}
                        setTasks={{ setTODOtasks, setDOINGtasks, setDONEtasks }}
                        fetchTrigger={fetchTrigger}
                        setFetchTrigger={setFetchTrigger}
                     />
                  )}
               </div>
               <ColumnsContainer
                  token={user.token}
                  tasks={{ TODOtasks, DOINGtasks, DONEtasks }}
                  setTasks={{ setTODOtasks, setDOINGtasks, setDONEtasks }}
                  fetchTrigger={fetchTrigger}
                  setFetchTrigger={setFetchTrigger}
                  searchTerm={searchTermHome}
               />
            </div>
         </main>
         <Footer />
         <AlertsMessage />
      </>
   );
}
