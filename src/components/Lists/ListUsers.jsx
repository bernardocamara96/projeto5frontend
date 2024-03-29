import "./StandardList.css";
import UserCard from "../cards/UserCard";
import { useState, useEffect } from "react";
import { loadUsers } from "../../utilities/services";
import { userStore } from "../../stores/userStore";
import {
   fetchUserDataByUsername,
   editOtherUser,
   deletePermanentlyUser,
   deleteTasksByUser,
} from "../../utilities/services";
import { useNavigate } from "react-router-dom";
import alertStore from "../../stores/alertStore";
import imagePlaceholder from "../../assets/placeholderform.png";

export default function ListUsers() {
   const { token } = userStore.getState().user;
   const userRole = userStore.getState().user.role;
   const [users, setUsers] = useState([]);
   const [displayBackground, setDisplayBackground] = useState("inline");
   const [imageBackground, setImageBackground] = useState(imagePlaceholder);
   const [photo, setPhoto] = useState("");
   const [usernameClicked, setUsernameClicked] = useState("");
   const [isDeleted, setIsDeleted] = useState(false);
   const [role, setRole] = useState("");
   const [firstName, setFirstName] = useState("");
   const [lastName, setLastName] = useState("");
   const [email, setEmail] = useState("");
   const [phone, setPhone] = useState("");
   const [newEmail, setNewEmail] = useState("");
   const [activeTrigger, setActiveTrigger] = useState(false);
   const [changeTrigger, setChangeTrigger] = useState(false);
   const [statusChangeTrigger, setStatusChangeTrigger] = useState(false);
   const [statusChange, setStatusChange] = useState(false);
   const [buttonsDisabled, setButtonsDisabled] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const navigate = useNavigate();
   const { setConfirmMessage, setConfirmVisible, setConfirmCallback } = alertStore();
   const [visibility, setVisibility] = useState("hidden");
   const [backgroundColor, setBackgroundColor] = useState("transparent");

   // Load users
   useEffect(() => {
      loadUsers(token).then((response) => {
         if (!response.ok) {
            throw new Error("Network response was not ok");
         }
         return response.json().then((data) => {
            setUsers(data);
         });
      });
   }, [statusChangeTrigger]);

   //function to set the confirm modals
   const handleAction = (message, callback) => {
      setConfirmMessage(message);
      setConfirmVisible(true);

      setConfirmCallback(callback);
   };

   //function to handle the click on a user card and fetch the user data
   function handleClick(username) {
      setImageBackground("none");
      setActiveTrigger(!activeTrigger);
      setChangeTrigger(false);
      setStatusChange(false);
      setButtonsDisabled(false);
      setVisibility("visible");
      setBackgroundColor("transparent");

      fetchUserDataByUsername(username, token).then((response) => {
         if (!response.ok) {
            throw new Error("Network response was not ok");
         }
         return response.json().then((data) => {
            console.log(data);
            setPhoto(data.photoURL);
            setFirstName(data.firstName);
            setLastName(data.lastName);
            setEmail(data.email);
            setPhone(data.phoneNumber);
            setRole(data.role);
            setIsDeleted(data.deleted);
            setUsernameClicked(username);
            setNewEmail(data.email);
         });
      });
   }

   //function to set the alert messages

   function handleAlert(message, error) {
      alertStore.getState().setMessage(message);
      alertStore.getState().setVisible(true);
      alertStore.getState().setError(error);
   }

   //function to handle the submit of the edit user form
   function handleSubmit(e) {
      e.preventDefault();
      if (changeTrigger) {
         if (phone.length >= 7 && phone.length <= 20) {
            if (isValidURL(photo)) {
               if (firstName.length >= 1 && firstName.length <= 25 && lastName.length >= 1 && lastName.length <= 25) {
                  handleAction("Are you sure you want to edit this user?", () => {
                     editOtherUser(
                        token,
                        usernameClicked,
                        role,
                        firstName,
                        lastName,
                        email,
                        newEmail,
                        phone,
                        photo,
                        isDeleted
                     ).then((response) => {
                        if (response.ok) {
                           setChangeTrigger(false);
                           handleAlert("User edited :)", false);
                           setEmail(newEmail);
                           if (statusChange) {
                              setStatusChangeTrigger(!statusChangeTrigger);
                              setStatusChange(false);
                           }
                        } else {
                           handleAlert("Error editing user :(", true);
                        }
                     });
                  });
               } else {
                  handleAlert("First Name and Last Name must have between 1 and 25 characters :(", true);
               }
            } else {
               handleAlert("Invalid photo url :(", true);
            }
         } else {
            handleAlert("Phone must have between 7 and 20 characters :(", true);
         }
      } else {
         handleAlert("No changes were made", true);
      }
   }

   function isValidURL(url) {
      try {
         new URL(url);
         return true;
      } catch (error) {
         return false;
      }
   }
   //function to handle the delete of a user
   function handleDelete() {
      handleAction("Are you sure you want to delete this user?", () => {
         deletePermanentlyUser(token, usernameClicked).then((response) => {
            if (response.ok) {
               handleAlert("User deleted", false);
               setStatusChangeTrigger(!statusChangeTrigger);
               setVisibility("hidden");
               setButtonsDisabled(true);
               setImageBackground(imagePlaceholder);
               setBackgroundColor("rgba(5, 16, 46, 0.9)");
            } else {
               handleAlert("Error deleting user", true);
            }
         });
      });
   }

   //function to handle the delete of all tasks from a user
   function handleDeleteTasks() {
      handleAction("Are you sure you want to delete all the tasks from this user?", () => {
         deleteTasksByUser(token, usernameClicked).then((response) => {
            if (response.ok) {
               handleAlert("Tasks deleted", false);
            } else {
               handleAlert("Error deleting tasks", true);
            }
         });
      });
   }
   return (
      <div className="mainBoard-settings mainBoard-settings-users" id="mainBoard-settings">
         <div className="user-list">
            <br />
            <br />
            <div className="box-container" id="box-users">
               <div className="col-user-list" id="col-users">
                  <div id="title-deleted-tasks">
                     <h3 id="user-list">List of Users</h3>
                  </div>
                  <div className="search-container">
                     <input
                        type="text"
                        id="userSearch"
                        placeholder="🔍 Search by username"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                     />
                  </div>
                  <div className="scrolable-ul" id="User_COLUMN">
                     <ul className="ul-users">
                        {console.log(users)}
                        {users.map(
                           (user) =>
                              user.username !== "admin" &&
                              user.username !== "deletedTasks" &&
                              user.username !== "developerTest" &&
                              user.username !== "scrumMasterTest" && (
                                 <UserCard
                                    key={user.username}
                                    username={user.username}
                                    isDeleted={user.deleted}
                                    role={user.role}
                                    photoURL={user.photoURL}
                                    handleClick={handleClick}
                                    activeTrigger={activeTrigger}
                                    statusChangeTrigger={statusChangeTrigger}
                                    searchTerm={searchTerm}
                                 />
                              )
                        )}
                     </ul>
                  </div>
               </div>
               <div className="centralform" id="centralform">
                  <form
                     id="editProfileForm"
                     style={{ backgroundImage: imageBackground, backgroundColor: backgroundColor }}
                     onSubmit={handleSubmit}
                  >
                     <div
                        id="individual-user-info"
                        style={{ textAlign: "left", display: displayBackground, visibility: visibility }}
                     >
                        <div className="content" id="content">
                           <div id="userImageContainer" style={{ textAlign: "center" }}>
                              <img
                                 id="userImage"
                                 style={{ width: "100px", height: "100px", borderRadius: "50%" }}
                                 src={photo}
                              />
                           </div>
                           <label id="username-label" htmlFor="username-field">
                              Username
                           </label>
                           <input
                              type="text"
                              name="username"
                              id="username-field"
                              maxLength="12"
                              value={usernameClicked}
                              disabled
                           />
                           <label id="phone-label" htmlFor="phone-field">
                              Phone
                           </label>
                           <input
                              type="text"
                              name="phone"
                              id="phone-field"
                              maxLength="35"
                              placeholder="Phone Number"
                              value={phone}
                              onChange={(e) => {
                                 setPhone(e.target.value);
                                 setChangeTrigger(true);
                              }}
                              disabled={userRole === "productOwner" ? false : true}
                           />
                           <label id="email-label" htmlFor="email-field">
                              Email
                           </label>
                           <input
                              type="email"
                              name="email"
                              id="email-field"
                              maxLength="35"
                              placeholder="email"
                              value={newEmail}
                              onChange={(e) => {
                                 setNewEmail(e.target.value);
                                 setChangeTrigger(true);
                              }}
                              disabled={userRole === "productOwner" ? false : true}
                           />
                           <label id="first-name-label" htmlFor="firstname-field">
                              First Name
                           </label>
                           <input
                              type="text"
                              name="first-name"
                              id="firstname-field"
                              maxLength="35"
                              placeholder="First name"
                              value={firstName}
                              onChange={(e) => {
                                 setFirstName(e.target.value);
                                 setChangeTrigger(true);
                              }}
                              disabled={userRole === "productOwner" ? false : true}
                           />
                           <label id="last-name-label" htmlFor="lastname-field">
                              Last Name
                           </label>
                           <input
                              type="text"
                              name="last-name"
                              id="lastname-field"
                              maxLength="35"
                              placeholder="last name"
                              value={lastName}
                              onChange={(e) => {
                                 setLastName(e.target.value);
                                 setChangeTrigger(true);
                              }}
                              disabled={userRole === "productOwner" ? false : true}
                           />
                           <label id="photo-label" htmlFor="photo-field">
                              Photography
                           </label>
                           <input
                              type="text"
                              name="photo"
                              id="photo-field"
                              maxLength="500"
                              placeholder="new photo"
                              value={photo}
                              onChange={(e) => {
                                 setPhoto(e.target.value);
                                 setChangeTrigger(true);
                                 setStatusChange(true);
                              }}
                              disabled={userRole === "productOwner" ? false : true}
                           />

                           <label id="role-label" htmlFor="role-field">
                              Role
                           </label>
                           <select
                              name="role"
                              id="role-field"
                              value={role}
                              onChange={(e) => {
                                 setRole(e.target.value);
                                 setChangeTrigger(true);
                                 setStatusChange(true);
                              }}
                              disabled={userRole === "productOwner" ? false : true}
                           >
                              <option value="developer">Developer</option>
                              <option value="scrumMaster">Scrum Master</option>
                              <option value="productOwner">Product Owner</option>
                           </select>
                           <label id="inactivate-label" htmlFor="inactivate-field">
                              State
                           </label>
                           <select
                              name="inactivate"
                              id="inactivate-field"
                              value={isDeleted}
                              onChange={(e) => {
                                 setIsDeleted(e.target.value);
                                 setChangeTrigger(true);
                                 setStatusChange(true);
                              }}
                              disabled={userRole === "productOwner" ? false : true}
                           >
                              <option value="false">Active</option>
                              <option value="true">Inactive</option>
                           </select>
                           {userRole === "productOwner" && (
                              <div id="edit-submitDiv">
                                 <button type="submit" id="edit-submit">
                                    Submit
                                 </button>
                              </div>
                           )}
                        </div>
                     </div>
                  </form>
               </div>
               {userRole === "productOwner" && (
                  <div className="other-options-user">
                     <div className="other-functions-byUser">
                        <button id="delete-permanently" onClick={handleDelete} disabled={buttonsDisabled}>
                           Permanently delete
                        </button>
                        <button id="delete-task-by-user" onClick={handleDeleteTasks} disabled={buttonsDisabled}>
                           Delete Tasks
                        </button>
                        <button
                           id="add-user"
                           onClick={() => navigate("/register", { state: { type: "productOwnerRegister" } })}
                        >
                           Add User
                        </button>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
