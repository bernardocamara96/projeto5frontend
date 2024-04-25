import "./AsideMenu.css";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { userStore } from "../../stores/userStore";
import notificationsStore from "../../stores/notificationsStore";

export default function AsideMenu() {
   const navigate = useNavigate();
   const isAsideCollapsed = useMediaQuery({ maxWidth: 1110 });
   const user = userStore.getState().user;
   const setSeeNotifications = notificationsStore((state) => state.setSeeNotifications);

   return (
      <aside className="col-leftMenu" id="aside-menu" onClick={() => setSeeNotifications(false)}>
         <>
            {user.role === "productOwner" && (
               <>
                  <a className="menu-item set-pro" id="difSettings-dashboard" onClick={() => navigate("/dashboard")}>
                     <i className="bi bi-bar-chart-line"></i>
                     {isAsideCollapsed ? null : <h4>App Dashboard</h4>}
                  </a>
                  <a
                     className="menu-item set-pro"
                     id="difSettings-configurations"
                     onClick={() => navigate("/configurations", { replace: true })}
                  >
                     <i className="fas fa-tools"></i>
                     {isAsideCollapsed ? null : <h4>Configurations</h4>}
                  </a>
               </>
            )}
            <a
               className="menu-item set-pro"
               id="difSettings-users"
               onClick={() => navigate("/users", { replace: true })}
            >
               <i className="fas fa-users"></i>
               {isAsideCollapsed ? null : <h4>Users</h4>}
            </a>
            {(user.role === "productOwner" || user.role === "scrumMaster") && (
               <>
                  <a
                     className="menu-item set-pro"
                     id="difSettings-tasks"
                     onClick={() => navigate("/tasks", { replace: true })}
                  >
                     <i className="bi bi-trash"></i>
                     {isAsideCollapsed ? null : <h4>Deleted Tasks</h4>}
                  </a>
                  <a
                     className="menu-item set-pro"
                     id="difSettings-categories"
                     onClick={() => navigate("/categories", { replace: true })}
                  >
                     <i className="bi bi-tags"></i>
                     {isAsideCollapsed ? null : <h4>Categories</h4>}
                  </a>
               </>
            )}
         </>
      </aside>
   );
}
