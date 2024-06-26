import EditOwnProfile from "../components/Forms/EditOwnProfile";
import HeaderScrum from "../components/Headers/HeaderScrum";
import Footer from "../components/Footers/Footer";
import AlertsMessage from "../components/somemodals/messagesModal/AlertsMessage";
import { useParams } from "react-router-dom";
import UsersStatistics from "../components/UserStatistics/UsersStatistics";
import { userStore, usernameStore } from "../stores/userStore";
import alertStore from "../stores/alertStore";
import { deletePermanentlyUser, deleteTasksByUser } from "../utilities/services";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AsideMenu from "../components/Menus/AsideMenu";
import Button from "react-bootstrap/Button";
import MyUserChat from "../components/chat/MyUserChat";
import notificationsStore from "../stores/notificationsStore";
import { IntlProvider, FormattedMessage } from "react-intl";
import translationStore from "../stores/translationStore";
import languages from "../translations";

export default function UserProfile() {
   const { username } = useParams();
   const [passwordActive, setPasswordActive] = useState(false);
   const user = userStore.getState().user;
   const usernameStorage = usernameStore.getState().username;
   const { setConfirmMessage, setConfirmVisible, setConfirmCallback } = alertStore();
   const navigate = useNavigate();
   const setSeeNotifications = notificationsStore((state) => state.setSeeNotifications);
   const [inputsDisabled, setInputsDisabled] = useState(true);
   const { locale } = translationStore();

   //function to set the confirm modals
   const handleAction = (message, callback) => {
      setConfirmMessage(message);
      setConfirmVisible(true);

      setConfirmCallback(callback);
   };

   function handleAlert(message, error) {
      alertStore.getState().setMessage(message);
      alertStore.getState().setVisible(true);
      alertStore.getState().setError(error);
   }

   //function to handle the delete of a user
   function handleDelete() {
      handleAction("Are you sure you want to delete this user?", () => {
         deletePermanentlyUser(user.token, username).then((response) => {
            if (response.ok) {
               handleAlert("User deleted", false);
               navigate("/users", { replace: true });
            } else {
               handleAlert("Error deleting user", true);
            }
         });
      });
   }

   //function to handle the delete of all tasks from a user
   function handleDeleteTasks() {
      handleAction("Are you sure you want to delete all the tasks from this user?", () => {
         deleteTasksByUser(user.token, username).then((response) => {
            if (response.ok) {
               handleAlert("Tasks deleted", false);
            } else {
               handleAlert("Error deleting tasks", true);
            }
         });
      });
   }
   return (
      <>
         <HeaderScrum userProfile={true} />

         <AsideMenu />
         <main className="scrum-main" onClick={() => setSeeNotifications(false)}>
            <div id="container-userProfile">
               <EditOwnProfile
                  username={username}
                  inputsDisabled={inputsDisabled}
                  setInputsDisabled={setInputsDisabled}
                  passwordActive={passwordActive}
                  setPasswordActive={setPasswordActive}
               />
               {username != usernameStorage && <MyUserChat username={username} token={user.token} />}

               {!passwordActive && (
                  <div id="userStats-btns">
                     <UsersStatistics
                        username={username}
                        inputsDisabled={inputsDisabled}
                        setInputsDisabled={setInputsDisabled}
                     />

                     {user.role === "productOwner" && usernameStorage !== username && (
                        <IntlProvider locale={locale} messages={languages[locale]}>
                           <div id="container-btns-userProfile">
                              <Button className="btn-outline-danger " onClick={handleDelete}>
                                 <i class="fas fa-user-times"></i>&nbsp; <FormattedMessage id="permanently-delete" />
                              </Button>
                              <Button className="btn-outline-danger" onClick={handleDeleteTasks}>
                                 <i class="bi bi-trash"></i>&nbsp;
                                 <FormattedMessage id="delete-tasks" />
                              </Button>
                           </div>
                        </IntlProvider>
                     )}
                  </div>
               )}
            </div>
         </main>
         <Footer />
         <AlertsMessage />
      </>
   );
}
