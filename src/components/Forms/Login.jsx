import "./Login.css";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { loginAttempt } from "../../utilities/services";
import { useState, useEffect } from "react";
import { userStore, usernameStore } from "../../stores/userStore";
import filterStore from "../../stores/filterStore";
import alertStore from "../../stores/alertStore";
import Button from "react-bootstrap/Button";

export default function Login() {
   const updateUserToken = userStore((state) => state.updateToken);
   const updateUsername = usernameStore((state) => state.updateUsername);
   const { updateUsernameFilter, updateCategoryFilter } = filterStore.getState();
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const updateRole = userStore((state) => state.updateRole);
   const navigate = useNavigate();

   const handleClick = (e) => {
      e.preventDefault();
      navigate("/register", { state: { type: "normalRegister" } });
   };

   // Function to set the alert messages
   function handleAlert(message, error) {
      alertStore.getState().setMessage(message);
      alertStore.getState().setVisible(true);
      alertStore.getState().setError(error);
   }

   // Function to handle the submit of the login form
   const handleSubmit = (e) => {
      e.preventDefault();
      loginAttempt(username, password)
         .then(function (response) {
            if (response.status == 200) {
               return response.json();
            } else if (response.status == 401) {
               //alert("Login failed, please check your credentials");
               handleAlert("Login failed, please check your credentials", true);
            } else {
               //alert("Login failed");

               handleAlert("Login failed", true);
            }
         })
         .then((response) => {
            updateUsername(username);
            if (response.confirmed === "true") {
               updateUserToken(response.token);

               navigate("/scrum", { replace: true });
            } else {
               updateUserToken(response.auxiliarToken);
               navigate("/confirmEmail/notconfirmed", { replace: true });
            }
         });
   };

   // Clear filters and user storage
   useEffect(() => {
      sessionStorage.clear();
   }, []);
   return (
      <>
         <form id="loginForm" className="loginForm agileForm" onSubmit={handleSubmit}>
            <div id="banner_login">
               <i className="fas fa-sign-in-alt fa-lg" id="login-icon"></i>
               <span id="member-login-banner">
                  <img src={logo} alt="img" className="logo" />
                  &nbsp;&nbsp;AgileFlow
               </span>
            </div>
            <div id="content_login">
               <div>
                  <label htmlFor="username" className="login-label">
                     Username
                  </label>
                  <input
                     type="text"
                     name="username"
                     id="username"
                     maxLength="25"
                     placeholder="Your username"
                     value={username}
                     className="form-control"
                     onChange={(e) => setUsername(e.target.value)}
                     required
                  />
               </div>
               <div>
                  <label htmlFor="password" className="login-label">
                     Password
                  </label>
                  <input
                     type="password"
                     name="password"
                     id="password"
                     maxLength="25"
                     placeholder="Enter password"
                     className="form-control"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                  />
               </div>
               <a className="a_login" id="a_forgot" href="/resetPass">
                  Forgot your password?
               </a>
               <Button className="btn-outline-primary" type="submit" id="login-btn" value="Login">
                  <i className="fas fa-sign-in-alt login-btn"></i> Login
               </Button>
               <Button className="btn-outline-danger" id="a_registration" onClick={handleClick}>
                  <i className="fas fa-user-plus a_registration"></i> Register
               </Button>
            </div>
         </form>
      </>
   );
}
