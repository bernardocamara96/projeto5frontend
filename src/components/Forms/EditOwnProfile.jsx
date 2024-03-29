import "./EditOwnProfile.css";
import { useState, useEffect } from "react";
import { fetchUserData, editUserData, editPassword } from "../../utilities/services";
import { userStore } from "../../stores/userStore";
import { useNavigate } from "react-router-dom";
import alertStore from "../../stores/alertStore";

export default function EditOwnProfile() {
   const [passwordActive, setPasswordActive] = useState(false);
   const [username, setUsername] = useState("");
   const [phone, setPhone] = useState("");
   const [email, setEmail] = useState("");
   const [firstname, setFirstname] = useState("");
   const [lastname, setLastname] = useState("");
   const [photo, setPhoto] = useState("");
   const { token } = userStore.getState().user;
   const [oldPassword, setOldPassword] = useState("");
   const [newPassword, setNewPassword] = useState("");
   const [repeatPassword, setRepeatPassword] = useState("");
   const navigate = useNavigate();

   //function to fetch the user data to fill the form
   useEffect(() => {
      fetchUserData(token)
         .then((response) => {
            if (!response.ok) {
               throw new Error("Network response was not ok");
            }
            return response.json();
         })
         .then(function (data) {
            setUsername(data.username);
            setPhone(data.phoneNumber);
            setEmail(data.email);
            setFirstname(data.firstName);
            setLastname(data.lastName);
            setPhoto(data.photoURL);
         })
         .catch((error) => {
            console.error("Error fetching data:", error);
         });
   }, []);

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

      if (phone.length >= 7 && phone.length <= 20) {
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
      }
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
      <div id="edit_container">
         {!passwordActive && (
            <form className="editForm" onSubmit={handleSubmit}>
               <div className="banner_register">
                  <img name="img_user" id="login-icon" alt="IMG" src={photo} />
                  <p id="member-registration-banner">Edit Profile</p>
               </div>
               <div className="content_register">
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
                  />
                  <button
                     className="btnChangePassword"
                     onClick={(e) => {
                        e.preventDefault();
                        setPasswordActive(!passwordActive);
                     }}
                  >
                     Change Password
                  </button>
                  <input type="submit" id="registration" value="Submit" />
               </div>
            </form>
         )}

         {passwordActive && (
            <div className="editForm passForm">
               <div className="banner_register">
                  <p id="member-registration-banner">Change Password</p>
               </div>
               <div className="content_register">
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
