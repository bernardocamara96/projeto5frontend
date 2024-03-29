import "./Login.css";
import userPNG from "../../assets/user-login.png";
import { useNavigate } from "react-router-dom";
import { loginAttempt } from "../../utilities/services";
import { useState, useEffect } from "react";
import { userStore, usernameStore } from "../../stores/userStore";
import filterStore from "../../stores/filterStore";
import alertStore from "../../stores/alertStore";

export default function Login() {
   const updateUserToken = userStore((state) => state.updateToken);
   const updateUsername = usernameStore((state) => state.updateUsername);
   const { updateUsernameFilter, updateCategoryFilter } = filterStore.getState();
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");

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
            updateUserToken(response.token);
            updateUsername(username);
            //alert("Login successful");
            alertStore.getState().setMessage("Login successful");

            handleAlert("Login successful", false);

            navigate("/scrum", { replace: true });
         });
   };

   // Clear filters and user storage
   useEffect(() => {
      updateUsernameFilter("default");
      updateCategoryFilter("default");
      sessionStorage.removeItem("user-storage");
   }, []);
   return (
      <>
         <main>
            <form id="loginForm">
               <div className="banner_login">
                  <img id="login-icon" src={userPNG} alt="IMG" />
                  <p id="member-login-banner">Member Login</p>
               </div>
               <div className="content_login">
                  <label id="username-label" htmlFor="username">
                     Username
                  </label>
                  <input
                     type="text"
                     name="username"
                     id="username"
                     maxLength="25"
                     placeholder="Enter your username"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                  />
                  <div id="errorLogin"></div>
                  <label id="password-label" htmlFor="password">
                     Password
                  </label>
                  <input
                     type="password"
                     name="password"
                     id="password"
                     maxLength="25"
                     placeholder="Enter your password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                  />
                  <input type="submit" id="login" value="Login" onClick={handleSubmit} />
               </div>
            </form>
            <div id="signup">
               Don't have an account?{" "}
               <a id="a_registration" onClick={handleClick}>
                  Sign up
               </a>
            </div>
         </main>
      </>
   );
}
