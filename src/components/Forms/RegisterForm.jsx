import "./RegisterForm.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as encryptation from "../../utilities/encryptation.js";
import { registerUser } from "../../utilities/services.js";
import alertStore from "../../stores/alertStore";
import { userStore } from "../../stores/userStore.js";
import Button from "react-bootstrap/Button";
import logo from "../../assets/logo.png";
import userPNG from "../../assets/user-login.png";

export default function RegisterForm({ type }) {
   const [role, setRole] = useState("developer");
   const [username, setUsername] = useState("");
   const [phone, setPhone] = useState("");
   const [email, setEmail] = useState("");
   const [firstname, setFirstname] = useState("");
   const [lastname, setLastname] = useState("");
   const [photo, setPhoto] = useState("");
   const { updateToken, updateRole } = userStore();
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
         if (phone.length >= 7 && phone.length <= 20) {
            if (isValidURL(photo)) {
               if (firstname.length >= 1 && firstname.length <= 25 && lastname.length >= 1 && lastname.length <= 25) {
                  let user = {
                     firstName: firstname,
                     lastName: lastname,
                     phoneNumber: phone,
                     photoURL: photo,
                     email: email,
                     username: username,
                     role: role,
                  };

                  registerUser(user).then((response) => {
                     if (response.ok) {
                        handleAlert("user created successfully :)", false);

                        if (type === "productOwnerRegister") {
                           navigate("/users", { replace: true });
                        } else
                           return response.json().then((data) => {
                              updateToken(data.token);
                              updateRole(role);

                              handleAlert("Account created successfully :)", false);

                              navigate("/confirmEmail/notconfirmed", { replace: true });
                           });
                     } else if (response.status === 409) {
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
            handleAlert("Phone must have between 7 and 20 characters :(", true);
         }
      } else {
         handleAlert("Password must have at least 4 characters :(", true);
      }
   }

   return (
      <div id="register_container">
         <form
            id="registrationForm"
            className="agileForm"
            onSubmit={handleSubmit}
            style={{
               marginTop: type === "productOwnerRegister" && "2vh",
               marginLeft: type === "productOwnerRegister" && "44%",
            }}
         >
            <div className="banner_register" id="banner-registerform">
               <i className="fas fa-user-plus fa-lg"></i>
               <span id="member-registration-banner">
                  {type === "productOwnerRegister" ? (
                     <p id="add-user-banner">Add user</p>
                  ) : (
                     <>
                        <img src={logo} alt="img" className="logo" />
                        &nbsp;&nbsp;AgileFlow
                     </>
                  )}
               </span>
            </div>

            <div className="content_register" id="content-register">
               <img src={isValidURL(photo) ? photo : userPNG} alt="userLogo" id="userLogo-register" />
               {type === "productOwnerRegister" && (
                  <div className="agileRow">
                     <label id="role-label" htmlFor="role-field">
                        Role
                     </label>
                     <select
                        name="role"
                        id="role-field"
                        className="form-control"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                     >
                        <option value="developer">Developer</option>
                        <option value="scrumMaster">Scrum Master</option>
                        <option value="productOwner">Product Owner</option>
                     </select>
                  </div>
               )}
               <div className="agileRow">
                  <div className="agileCol">
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
                        className="form-control register-input"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                     />
                  </div>
                  <div className="agileCol">
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
                        className="form-control register-input"
                        onChange={(e) => setPhone(e.target.value)}
                        required
                     />
                  </div>
               </div>
               <div className="agileRow">
                  <div className="agileCol">
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
                        className="form-control register-input"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                     />
                  </div>
                  <div className="agileCol">
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
                        className="form-control register-input"
                        onChange={(e) => setFirstname(e.target.value)}
                        required
                     />
                  </div>
               </div>
               <div className="agileRow">
                  <div className="agileCol">
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
                        className="form-control register-input"
                        onChange={(e) => setLastname(e.target.value)}
                        required
                     />
                  </div>
                  <div className="agileCol">
                     <label id="URL" htmlFor="photo-field">
                        Profile Photo
                     </label>
                     <input
                        type="text"
                        name="photo"
                        id="photo-field"
                        maxLength="500"
                        placeholder="Enter your Photo URL"
                        value={photo}
                        className="form-control register-input"
                        onChange={(e) => setPhoto(e.target.value)}
                        required
                     />
                  </div>
               </div>
               <Button type="submit" id="registration" className="btn-outline-danger">
                  <i className="fas fa-user-plus a_registration"></i>&nbsp; Confirm Registration
               </Button>
               {type === "normalRegister" && (
                  <Button className="btn-outline-primary" type="button" id="login-btn" onClick={() => navigate("/")}>
                     <i className="fas fa-sign-in-alt login-btn"></i>&nbsp; Login
                  </Button>
               )}
            </div>
         </form>
      </div>
   );
}
