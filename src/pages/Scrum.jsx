import AsideMenu from "../components/Menus/AsideMenu.jsx";
import HeaderScrum from "../components/Headers/HeaderScrum.jsx";
import Footer from "../components/Footers/Footer.jsx";
import ColumnsContainer from "../components/columns/ColumnsContainer.jsx";
import "../main.css";
import { useState } from "react";
import { userStore } from "../stores/userStore";
import Filters from "../components/Filters/Filters.jsx";
import AlertsMessage from "../components/somemodals/messagesModal/AlertsMessage.jsx";

export default function Scrum() {
   const user = userStore.getState().user;
   const [fetchTrigger, setFetchTrigger] = useState(false);
   const [searchTermHome, setSearchTermHome] = useState("");
   const [TODOtasks, setTODOtasks] = useState([]);
   const [DOINGtasks, setDOINGtasks] = useState([]);
   const [DONEtasks, setDONEtasks] = useState([]);

   return (
      <>
         <HeaderScrum />
         <main id="scrumMain">
            {user.role === "developer" ? null : <AsideMenu type={user.role} />}
            <div id="scrum-content">
               <div className="search-container-homepage" id="search-container-homepage">
                  <input
                     type="text"
                     id="taskSearchHomepage"
                     placeholder="🔍 Search tasks by title or description"
                     value={searchTermHome}
                     onChange={(e) => setSearchTermHome(e.target.value)}
                     style={{ marginLeft: user.role === "developer" && "390px" }}
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
