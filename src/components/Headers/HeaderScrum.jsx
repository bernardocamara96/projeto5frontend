import "./Header.css";
import appLogo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../stores/userStore";
import filterStore from "../../stores/filterStore";
import alertStore from "../../stores/alertStore";
import { useState, useEffect } from "react";
import { fetchPhotoNameAndRedirect } from "../../utilities/services";
import ConfirmMessage from "../somemodals/messagesModal/ConfirmMessage";

export default function HeaderScrum() {
   const navigate = useNavigate();
   const { updateUsernameFilter, updateCategoryFilter } = filterStore.getState();
   const { setConfirmMessage, setConfirmVisible, setConfirmCallback } = alertStore();
   const [username, setUsername] = useState("");
   const [userPhoto, setUserPhoto] = useState("");
   const updateRole = userStore((state) => state.updateRole);
   const user = userStore.getState().user;

   //if the token exists it will fetch the photo and name of the user and set it to the state to put in the Header
   useEffect(() => {
      if (user.token) {
         fetchPhotoNameAndRedirect(user.token)
            .then((response) => {
               if (!response.ok) {
                  if (response.status === 403) navigate("/", { replace: true });
                  throw new Error("Network response was not ok");
               }
               return response.json();
            })
            .then(function (data) {
               setUserPhoto(data.photoUrl);
               setUsername(data.name);
               updateRole(data.role);
            })
            .catch((error) => {
               console.error("Error fetching data:", error);
            });
      } else {
         navigate("/", { replace: true });
      }
   });

   //function to set the confirm messages
   const handleAction = (message, callback) => {
      setConfirmMessage(message);
      setConfirmVisible(true);
      setConfirmCallback(callback);
   };

   // Function to handle the exit of the app
   function clickOnExit() {
      handleAction("Are you sure you want to exit the app?", () => {
         updateUsernameFilter("default");
         updateCategoryFilter("default");
         navigate("/", { replace: true });
         sessionStorage.removeItem("user-storage");
      });
   }
   return (
      <>
         <header>
            <img id="logo" src={appLogo} alt="IMG" onClick={() => navigate("/scrum", { replace: true })} />

            <div className="topnav">
               <a id="nav-home" className="active" onClick={() => navigate("/scrum", { replace: true })}>
                  Homepage
               </a>

               <a id="nav-exit" onClick={clickOnExit}>
                  Exit
               </a>
            </div>

            <div id="right-aligned">
               <a>
                  <h4>
                     <span
                        id="usernameDisplay"
                        data-testid="usernameDisplay"
                        onClick={() => navigate("/editProfile", { replace: true })}
                     >
                        {username}
                     </span>
                  </h4>
               </a>
            </div>

            <a id="userPhotolink" onClick={() => navigate("/editProfile", { replace: true })}>
               <div className="user-photo-div">
                  <img id="userPhoto" src={userPhoto} alt="" />
               </div>
            </a>
         </header>
         <ConfirmMessage />
      </>
   );
}
