import "./AsideMenu.css";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { userStore } from "../../stores/userStore";
import notificationsStore from "../../stores/notificationsStore";
import translationStore from "../../stores/translationStore";
import languages from "../../translations";
import { IntlProvider, FormattedMessage } from "react-intl";

export default function AsideMenu() {
   const navigate = useNavigate();
   const isAsideCollapsed = useMediaQuery({ maxWidth: 1160 });
   const user = userStore.getState().user;
   const setSeeNotifications = notificationsStore((state) => state.setSeeNotifications);
   const { locale, updateLocale } = translationStore();

   return (
      <aside className="col-leftMenu" id="aside-menu" onClick={() => setSeeNotifications(false)}>
         <>
            <IntlProvider locale={locale} messages={languages[locale]}>
               {user.role === "productOwner" && (
                  <>
                     <a className="menu-item set-pro" id="difSettings-dashboard" onClick={() => navigate("/dashboard")}>
                        <i className="bi bi-bar-chart-line"></i>
                        {isAsideCollapsed ? null : (
                           <h4>
                              <FormattedMessage id="app-dashboard" />
                           </h4>
                        )}
                     </a>
                     <a
                        className="menu-item set-pro"
                        id="difSettings-configurations"
                        onClick={() => navigate("/configurations", { replace: true })}
                     >
                        <i className="fas fa-tools"></i>
                        {isAsideCollapsed ? null : (
                           <h4>
                              <FormattedMessage id="configurations" />
                           </h4>
                        )}
                     </a>
                  </>
               )}
               <a
                  className="menu-item set-pro"
                  id="difSettings-users"
                  onClick={() => navigate("/users", { replace: true })}
               >
                  <i className="fas fa-users"></i>
                  {isAsideCollapsed ? null : (
                     <h4>
                        <FormattedMessage id="users" />
                     </h4>
                  )}
               </a>
               {(user.role === "productOwner" || user.role === "scrumMaster") && (
                  <>
                     <a
                        className="menu-item set-pro"
                        id="difSettings-tasks"
                        onClick={() => navigate("/tasks", { replace: true })}
                     >
                        <i className="bi bi-trash"></i>
                        {isAsideCollapsed ? null : (
                           <h4>
                              {" "}
                              <FormattedMessage id="deleted-tasks" />
                           </h4>
                        )}
                     </a>
                     <a
                        className="menu-item set-pro"
                        id="difSettings-categories"
                        onClick={() => navigate("/categories", { replace: true })}
                     >
                        <i className="bi bi-tags"></i>
                        {isAsideCollapsed ? null : (
                           <h4>
                              {" "}
                              <FormattedMessage id="categories" />
                           </h4>
                        )}
                     </a>
                  </>
               )}
            </IntlProvider>
         </>
      </aside>
   );
}
