import "./AsideMenu.css";
import { useNavigate } from "react-router-dom";

export default function AsideMenu({ type }) {
   const navigate = useNavigate();

   return (
      <aside className="col-leftMenu" id="aside-menu">
         {(type === "productOwner" || type === "scrumMaster") && (
            <>
               <a
                  className="menu-item set-pro"
                  id="difSettings-users"
                  onClick={() => navigate("/users", { replace: true })}
               >
                  <h4>Users</h4>
               </a>
               <a
                  className="menu-item set-pro"
                  id="difSettings-tasks"
                  onClick={() => navigate("/tasks", { replace: true })}
               >
                  <h4>Deleted Tasks</h4>
               </a>
               <a
                  className="menu-item set-pro"
                  id="difSettings-categories"
                  onClick={() => navigate("/categories", { replace: true })}
               >
                  <h4>Categories</h4>
               </a>
            </>
         )}
      </aside>
   );
}
