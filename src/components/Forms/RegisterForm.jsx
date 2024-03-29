import "./RegisterForm.css";
import userPNG from "../../assets/user-login.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as encryptation from "../../utilities/encryptation.js";
import { registerUser } from "../../utilities/services.js";
import alertStore from "../../stores/alertStore";

export default function RegisterForm({ type }) {
   const [role, setRole] = useState("developer");
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [password2, setPassword2] = useState("");
   const [phone, setPhone] = useState("");
   const [email, setEmail] = useState("");
   const [firstname, setFirstname] = useState("");
   const [lastname, setLastname] = useState("");
   const [photo, setPhoto] = useState("");
   const navigate = useNavigate();

   // Function to set the alert messages
   function handleAlert(message, error) {
      alertStore.getState().setMessage(message);
      alertStore.getState().setVisible(true);
      alertStore.getState().setError(error);
   }

   function isValidURL(url) {
      try {
         new URL(url);
         return true;
      } catch (error) {
         return false;
      }
   }

   // Function to handle the submit of the register form
   async function handleSubmit(e) {
      e.preventDefault();
      if (username.length >= 2 && username.length <= 25) {
         if (password.length >= 4) {
            if (phone.length >= 7 && phone.length <= 20) {
               if (password === password2) {
                  if (isValidURL(photo)) {
                     if (
                        firstname.length >= 1 &&
                        firstname.length <= 25 &&
                        lastname.length >= 1 &&
                        lastname.length <= 25
                     ) {
                        let user = {
                           firstName: firstname,
                           lastName: lastname,
                           password: encryptation.encryptPassword(password),
                           phoneNumber: phone,
                           photoURL: photo,
                           email: email,
                           username: username,
                           role: role,
                        };

                        registerUser(user)
                           .then((response) => {
                              if (response.ok) {
                                 handleAlert("user created successfully :)", false);

                                 if (type === "productOwnerRegister") {
                                    navigate("/users", { replace: true });
                                 } else navigate("/", { replace: true });
                              }
                           })
                           .catch((status) => {
                              if (status == 409) {
                                 handleAlert("username or email already exists :)", true);
                              } else {
                                 handleAlert("something went wrong :(", true);
                              }
                           });
                     } else {
                        handleAlert("First Name and Last Name must have between 1 and 25 characters :(", true);
                     }
                  } else {
                     handleAlert("Invalid photo url :(", true);
                  }
               } else {
                  handleAlert("Passwords do not match :(", true);
               }
            } else {
               handleAlert("Phone must have between 7 and 20 characters :(", true);
            }
         } else {
            handleAlert("Password must have at least 4 characters :(", true);
         }
      } else {
         handleAlert("Username must have between 2 and 25 characters :(", true);
      }
   }

   return (
      <div id="register_container">
         <form id="registrationForm" onSubmit={handleSubmit}>
            <div className="banner_register">
               <img name="img_user" id="login-icon" src={userPNG} alt="IMG" />
               <p id="member-registration-banner">Member Registration</p>
            </div>
            <div className="content_register">
               {type === "productOwnerRegister" && (
                  <>
                     <label id="role-label" htmlFor="role-field">
                        Role
                     </label>
                     <select name="role" id="role-field" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="developer">Developer</option>
                        <option value="scrumMaster">Scrum Master</option>
                        <option value="productOwner">Product Owner</option>
                     </select>
                  </>
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
                  onChange={(e) => setUsername(e.target.value)}
                  required
               />
               <label id="password-label" htmlFor="password-field">
                  Password
               </label>
               <input
                  type="password"
                  name="password"
                  id="password-field"
                  maxLength="25"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
               />
               <label id="password-label2" htmlFor="password2-field">
                  Repeat Password
               </label>
               <input
                  type="password"
                  name="password2"
                  id="password2-field"
                  maxLength="25"
                  placeholder="Enter your password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  required
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
               <input type="submit" id="registration" value="Registration" />
            </div>
         </form>
      </div>
   );
}
