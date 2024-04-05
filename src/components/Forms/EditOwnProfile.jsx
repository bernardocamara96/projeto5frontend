import "./EditOwnProfile.css";
import { useState, useEffect } from "react";
import { fetchUserData, editUserData, editPassword, editOtherUser } from "../../utilities/services";
import { userStore } from "../../stores/userStore";
import { useNavigate } from "react-router-dom";
import alertStore from "../../stores/alertStore";
import { usernameStore } from "../../stores/userStore";
import editPNG from "../../assets/edit.png";

export default function EditOwnProfile({ username, selectedUserRole, inputsDisabled, setInputsDisabled }) {
   const [passwordActive, setPasswordActive] = useState(false);
   const [phone, setPhone] = useState("");
   const [email, setEmail] = useState("");
   const [oldEmail, setOldEmail] = useState("");
   const [firstname, setFirstname] = useState("");
   const [userRole, setUserRole] = useState(selectedUserRole);
   const [isDeleted, setIsDeleted] = useState("");
   const [lastname, setLastname] = useState("");
   const [photo, setPhoto] = useState("");
   const { token, role } = userStore.getState().user;
   const [oldPassword, setOldPassword] = useState("");
   const [newPassword, setNewPassword] = useState("");
   const [repeatPassword, setRepeatPassword] = useState("");
   const usernameStorage = usernameStore.getState().username;

   const navigate = useNavigate();

   //function to fetch the user data to fill the form
   useEffect(() => {
      fetchUserData(username)
         .then((response) => {
            if (!response.ok) {
               throw new Error("Network response was not ok");
            }
            return response.json();
         })
         .then(function (data) {
            setPhone(data.phoneNumber);
            setEmail(data.email);
            setOldEmail(data.email);
            setFirstname(data.firstName);
            setLastname(data.lastName);
            setPhoto(data.photoURL);
            setUserRole(data.role);
            setIsDeleted(data.deleted);
         })
         .catch((error) => {
            console.error("Error fetching data:", error);
         });
   }, [username]);

   // Function to set the alert messages
   function handleAlert(message, error) {
      alertStore.getState().setMessage(message);
      alertStore.getState().setVisible(true);
      alertStore.getState().setError(error);
   }

   // Function to handle the submit of the edit form
   const handleSubmit = (e) => {
      e.preventDefault();
      let user = {};

      if (phone !== "") user.phoneNumber = phone;
      if (email !== "") user.email = email;
      if (firstname !== "") user.firstName = firstname;
      if (lastname !== "") user.lastName = lastname;
      if (photo !== "") user.photoURL = photo;

      user.role = userRole;
      user.deleted = isDeleted;

      editOtherUser(token, username, userRole, firstname, lastname, email, oldEmail, phone, photo, isDeleted).then(
         (response) => {
            if (response.ok) {
               handleAlert("User updated successfully :)", false);

               navigate("/users", { replace: true });
            } else if (response.status === 409) {
               handleAlert("Email already exists :(", true);
            } else if (response.status === 400) {
               handleAlert("Invalid data :(", true);
            } else if (response.status === 401) {
               navigate("/", { replace: true });
            }
         }
      );

      /*if (phone.length >= 7 && phone.length <= 20) {
         if (isValidURL(photo)) {
            if (firstname.length >= 1 && firstname.length <= 25 && lastname.length >= 1 && lastname.length <= 25) {
               editUserData(user, token).then((response) => {
                  if (response.ok) {
                     handleAlert("User updated successfully :)", false);

                     navigate("/scrum", { replace: true });
                  } else if (response.status === 409) {
                     handleAlert("Email already exists :(", true);
                  } else if (response.status === 400) {
                     handleAlert("Invalid data :(", true);
                  } else if (response.status === 401) {
                     navigate("/", { replace: true });
                  }
               });
            } else {
               handleAlert("First Name and Last Name must have between 1 and 25 characters :(", true);
            }
         } else {
            handleAlert("Invalid photo url :(", true);
         }
      } else {
         handleAlert("Phone must have between 7 and 20 characters :(", true);
      }*/
   };

   function isValidURL(url) {
      try {
         new URL(url);
         return true;
      } catch (error) {
         return false;
      }
   }

   // Function to handle the save of the new password
   const handleSavePassword = () => {
      if (newPassword.length >= 4) {
         if (newPassword === repeatPassword) {
            editPassword(oldPassword, newPassword, token).then((response) => {
               if (response.ok) {
                  handleAlert("Password is updated successfully :)", false);
                  navigate("/scrum", { replace: true });
               } else {
                  handleAlert("Invalid data :(", true);
               }
            });
         } else {
            handleAlert("Passwords do not match :(", true);
         }
      } else {
         handleAlert("Password must have at least 4 characters :(", true);
      }
   };

   return (
      <div
         id="edit_container"
         style={{
            marginTop:
               usernameStorage !== username && !inputsDisabled
                  ? "37px"
                  : usernameStorage === username && !inputsDisabled && "93.6px",
         }}
      >
         {!passwordActive && (
            <form className="editForm" onSubmit={handleSubmit}>
               <div className="banner_register">
                  <img name="img_user" id="login-icon" alt="IMG" src={photo} />
                  <p id="member-registration-banner">Edit Profile</p>
               </div>
               <div
                  className="content_register content_editProfile"
                  style={{ paddingTop: usernameStorage !== username && role !== "productOwner" && "11%" }}
               >
                  {(usernameStorage === username || role === "productOwner") && (
                     <button id="editProfile-btn" type="button" onClick={() => setInputsDisabled((prev) => !prev)}>
                        <img id="editProfile-icon" src={editPNG} alt="Edit" />
                     </button>
                  )}

                  <label id="username-label" htmlFor="username-field">
                     Username
                  </label>
                  <input
                     type="text"
                     name="username"
                     id="username-field"
                     maxLength="25"
                     placeholder="Enter your username"
                     value={username}
                     disabled
                  />

                  <label id="phone-label" htmlFor="phone-field">
                     Phone
                  </label>
                  <input
                     type="tel"
                     name="phone"
                     id="phone-field"
                     maxLength="35"
                     placeholder="Enter your phone"
                     value={phone}
                     onChange={(e) => setPhone(e.target.value)}
                     required
                     disabled={inputsDisabled}
                  />
                  <label id="email-label" htmlFor="email-field">
                     Email
                  </label>
                  <input
                     type="email"
                     name="email"
                     id="email-field"
                     maxLength="35"
                     placeholder="Enter your email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                     disabled={inputsDisabled}
                  />
                  <label id="first-name-label" htmlFor="firstname-field">
                     First Name
                  </label>
                  <input
                     type="text"
                     name="firstname"
                     id="firstname-field"
                     maxLength="35"
                     placeholder="Enter your First Name"
                     value={firstname}
                     onChange={(e) => setFirstname(e.target.value)}
                     required
                     disabled={inputsDisabled}
                  />
                  <label id="last-name-label" htmlFor="lastname-field">
                     Last Name
                  </label>
                  <input
                     type="text"
                     name="lastname"
                     id="lastname-field"
                     maxLength="35"
                     placeholder="Enter your Last Name"
                     value={lastname}
                     onChange={(e) => setLastname(e.target.value)}
                     required
                     disabled={inputsDisabled}
                  />
                  <label id="URL" htmlFor="photo-field">
                     Photography
                  </label>
                  <input
                     type="text"
                     name="photo"
                     id="photo-field"
                     maxLength="500"
                     placeholder="Enter your Photo URL"
                     value={photo}
                     onChange={(e) => setPhoto(e.target.value)}
                     required
                     disabled={inputsDisabled}
                  />

                  {role === "productOwner" && usernameStorage !== username && (
                     <>
                        <label id="role-label" htmlFor="role-field">
                           Role
                        </label>
                        <select
                           name="role"
                           id="role-field"
                           value={userRole}
                           onChange={(e) => {
                              setUserRole(e.target.value);
                              setChangeTrigger(true);
                              setStatusChange(true);
                           }}
                           disabled={inputsDisabled}
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
                           disabled={inputsDisabled}
                        >
                           <option value="false">Active</option>
                           <option value="true">Inactive</option>
                        </select>
                     </>
                  )}
                  {usernameStorage === username && !inputsDisabled && (
                     <button
                        className="btnChangePassword"
                        onClick={(e) => {
                           e.preventDefault();
                           setPasswordActive(!passwordActive);
                        }}
                     >
                        Change Password
                     </button>
                  )}
                  {!inputsDisabled && (usernameStorage === username || role === "productOwner") && (
                     <input type="submit" id="registration" value="Submit" />
                  )}
               </div>
            </form>
         )}

         {passwordActive && (
            <div className="editForm passForm">
               <div className="banner_register">
                  <p id="member-registration-banner">Change Password</p>
               </div>
               <div className="content_register content_editProfile" id="content_pass">
                  <label id="oldPassword-label" htmlFor="oldPassword-field">
                     Old Password
                  </label>
                  <input
                     type="password"
                     name="oldPassword"
                     id="oldPassword-field"
                     maxLength="35"
                     placeholder="Enter your phone"
                     value={oldPassword}
                     onChange={(e) => setOldPassword(e.target.value)}
                  />
                  <label id="newPass-label" htmlFor="newPass-field">
                     New Password
                  </label>
                  <input
                     type="password"
                     name="newPass"
                     id="newPass-field"
                     maxLength="35"
                     placeholder="Enter your phone"
                     value={newPassword}
                     onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <label id="repeatPass-label" htmlFor="repeatPass-field">
                     Repeat Password
                  </label>
                  <input
                     type="password"
                     name="repeatPass"
                     id="repeatPass-field"
                     maxLength="35"
                     placeholder="Enter your phone"
                     value={repeatPassword}
                     onChange={(e) => setRepeatPassword(e.target.value)}
                  />
                  <button className="btnChangePassword" onClick={() => setPasswordActive(false)}>
                     Back to Edition
                  </button>
                  <button className="btnChangePassword" onClick={handleSavePassword}>
                     Save Password
                  </button>
               </div>
            </div>
         )}
      </div>
   );
}
