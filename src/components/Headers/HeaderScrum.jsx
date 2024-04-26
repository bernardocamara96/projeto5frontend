import "./Header.css";
import appLogo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../stores/userStore";
import filterStore from "../../stores/filterStore";
import alertStore from "../../stores/alertStore";
import { useState, useEffect } from "react";
import {
   fetchPhotoNameAndRedirect,
   logoutAttempt,
   getMessagesNumber,
   getNotifications,
   seenMessagesByRecipient,
} from "../../utilities/services";
import ConfirmMessage from "../somemodals/messagesModal/ConfirmMessage";
import { usernameStore } from "../../stores/userStore";
import { useMediaQuery } from "react-responsive";
import Button from "react-bootstrap/Button";
import useMessageWebSocket from "../websocket/useMessageWebSocket";
import UnseenMessages from "../Lists/UnseenMessages";
import notificationsStore from "../../stores/notificationsStore";
import translationStore from "../../stores/translationStore";
import languages from "../../translations";
import { IntlProvider, FormattedMessage } from "react-intl";

export default function HeaderScrum({ userProfile }) {
   const navigate = useNavigate();
   const { updateUsernameFilter, updateCategoryFilter } = filterStore.getState();
   const { setConfirmMessage, setConfirmVisible, setConfirmCallback } = alertStore();
   const [username, setUsername] = useState("");
   const [userPhoto, setUserPhoto] = useState("");
   const updateRole = userStore((state) => state.updateRole);
   const user = userStore.getState().user;
   const usernameStorage = usernameStore.getState().username;
   usernameStore((state) => state.updateUsername);
   const isTablet = useMediaQuery({ maxWidth: 570 });
   const isMobile = useMediaQuery({ maxWidth: 450 });
   const [notificationsNumber, setNotificationsNumber] = useState(0);
   const [notifications, setNotifications] = useState([]);
   const { seeNotifications, setSeeNotifications } = notificationsStore();
   const { locale, updateLocale } = translationStore();

   useMessageWebSocket(user.token, usernameStorage, setNotificationsNumber);

   //if the token exists it will fetch the photo and name of the user and set it to the state to put in the Header
   useEffect(() => {
      if (user.token) {
         setSeeNotifications(false);
         fetchPhotoNameAndRedirect(user.token)
            .then((response) => {
               if (!response.ok) {
                  if (response.status === 403 || response.status === 401) navigate("/", { replace: true });
                  throw new Error("Network response was not ok");
               }
               return response.json();
            })
            .then(function(data) {
               setUserPhoto(data.photoUrl);
               setUsername(data.name);
               updateRole(data.role);
            })
            .catch((error) => {
               console.error("Error fetching data:", error);
            });
         {
            userProfile
               ? setTimeout(() => {
                    getMessagesNumber(user.token).then((response) => {
                       if (response.ok) {
                          response.json().then((data) => {
                             setNotificationsNumber(data);
                          });
                       }
                    });
                 }, 100)
               : getMessagesNumber(user.token).then((response) => {
                    if (response.ok) {
                       response.json().then((data) => {
                          setNotificationsNumber(data);
                       });
                    }
                 });
         }
      } else {
         navigate("/", { replace: true });
      }
   }, []);

   //function to set the confirm messages
   const handleAction = (message, callback) => {
      setConfirmMessage(message);
      setConfirmVisible(true);
      setConfirmCallback(callback);
   };

   // Function to handle the exit of the app
   function clickOnExit() {
      handleAction("Are you sure you want to exit the app?", () => {
         logoutAttempt(user.token);
         navigate("/", { replace: true });
         sessionStorage.removeItem("username-storage");
         sessionStorage.removeItem("filter-storage");
         sessionStorage.removeItem("user-storage");
         sessionStorage.removeItem("tasks-storage");
      });
   }

   const handleNotificationsClick = () => {
      if (!seeNotifications) {
         getNotifications(user.token).then((response) => {
            if (response.ok) {
               response.json().then((data) => {
                  console.log(data);
                  if (data.length > 0) {
                     setSeeNotifications(true);
                     setNotifications(data);
                     seenMessagesByRecipient(user.token);
                     setNotificationsNumber(0);
                  }
               });
            }
         });
      } else setSeeNotifications(false);
   };

   return (
      <>
         <IntlProvider locale={locale} messages={languages[locale]}>
            <header onClick={() => setSeeNotifications(false)}>
               <div id="logo-div">
                  <img
                     className="logo"
                     id="logo-header"
                     src={appLogo}
                     alt="IMG"
                     onClick={() => navigate("/scrum", { replace: true })}
                  />
                  {!isMobile && (
                     <span id="app-name" onClick={() => navigate("/scrum", { replace: true })}>
                        <b>AgileFlow</b>
                     </span>
                  )}
               </div>

               <div className="topnav">
                  {!isTablet && (
                     <a id="nav-home" className="active" onClick={() => navigate("/scrum", { replace: true })}>
                        <FormattedMessage id="homepage" />
                     </a>
                  )}
                  <a id="nav-exit" onClick={clickOnExit}>
                     <FormattedMessage id="exit" />
                  </a>
               </div>

               <div id="right-aligned">
                  <div id="languages-row">
                     <div
                        style={{ fontWeight: locale === "pt" && "bold" }}
                        onClick={() => {
                           updateLocale("pt");
                        }}
                     >
                        PT
                     </div>
                     <div
                        style={{ fontWeight: locale === "en" && "bold" }}
                        onClick={() => {
                           updateLocale("en");
                        }}
                     >
                        EN
                     </div>
                  </div>
                  <Button className="btn-dark" id="btn-notifications" onClick={handleNotificationsClick}>
                     <i class="fas fa-bell fa-lg"></i>
                     {notificationsNumber > 0 && <span id="notifications-number">{notificationsNumber}</span>}
                  </Button>
                  <a onClick={() => navigate(`/userProfile/${usernameStorage}`, { replace: true })}>
                     <h4>
                        <span id="usernameDisplay" data-testid="usernameDisplay">
                           {username}
                        </span>
                     </h4>
                  </a>
                  <a id="userPhotolink" onClick={() => navigate(`/userProfile/${usernameStorage}`, { replace: true })}>
                     <div className="user-photo-div">
                        <img id="userPhoto" src={userPhoto} alt="" />
                     </div>
                  </a>
               </div>
            </header>
            {seeNotifications && <UnseenMessages notifications={notifications} />}
            <ConfirmMessage />
         </IntlProvider>
      </>
   );
}
