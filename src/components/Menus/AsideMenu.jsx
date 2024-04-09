import "./AsideMenu.css";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { userStore } from "../../stores/userStore";

export default function AsideMenu() {
   const navigate = useNavigate();
   const isAsideCollapsed = useMediaQuery({ maxWidth: 1110 });
   const user = userStore.getState().user;

   return (
      <aside className="col-leftMenu" id="aside-menu">
         <>
            {user.role === "productOwner" && (
               <a
                  className="menu-item set-pro"
                  id="difSettings-dashboard"
                  onClick={() => navigate("/dashboard", { replace: true })}
               >
                  <i class="bi bi-bar-chart-line"></i>
                  {isAsideCollapsed ? null : <h4>App Dashboard</h4>}
               </a>
            )}
            <a
               className="menu-item set-pro"
               id="difSettings-users"
               onClick={() => navigate("/users", { replace: true })}
            >
               <i class="fas fa-users"></i>
               {isAsideCollapsed ? null : <h4>Users</h4>}
            </a>
            {(user.role === "productOwner" || user.role === "scrumMaster") && (
               <>
                  <a
                     className="menu-item set-pro"
                     id="difSettings-tasks"
                     onClick={() => navigate("/tasks", { replace: true })}
                  >
                     <i class="bi bi-trash"></i>
                     {isAsideCollapsed ? null : <h4>Deleted Tasks</h4>}
                  </a>
                  <a
                     className="menu-item set-pro"
                     id="difSettings-categories"
                     onClick={() => navigate("/categories", { replace: true })}
                  >
                     <i class="bi bi-tags"></i>
                     {isAsideCollapsed ? null : <h4>Categories</h4>}
                  </a>
               </>
            )}
         </>
      </aside>
   );
}
