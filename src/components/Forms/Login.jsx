import "./Login.css";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { loginAttempt } from "../../utilities/services";
import { useState, useEffect } from "react";
import { userStore, usernameStore } from "../../stores/userStore";
import filterStore from "../../stores/filterStore";
import alertStore from "../../stores/alertStore";
import Button from "react-bootstrap/Button";
import translationStore from "../../stores/translationStore";
import languages from "../../translations";
import { IntlProvider, FormattedMessage } from "react-intl";

export default function Login() {
   const updateUserToken = userStore((state) => state.updateToken);
   const updateUsername = usernameStore((state) => state.updateUsername);
   const { updateUsernameFilter, updateCategoryFilter } = filterStore.getState();
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const updateRole = userStore((state) => state.updateRole);
   const navigate = useNavigate();
   const { locale, updateLocale } = translationStore();

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
         .then(function(response) {
            if (response.status == 200) {
               return response.json();
            } else if (response.status == 401) {
               //alert("Login failed, please check your credentials");
               if (locale === "en") handleAlert("Login failed, please check your credentials", true);
               else if (locale === "pt") handleAlert("Falha no login, verifique suas credenciais", true);
            } else {
               //alert("Login failed");

               if (locale === "en") handleAlert("Login failed", true);
               else if (locale === "pt") handleAlert("Falha no login", true);
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

   return (
      <>
         <IntlProvider locale={locale} messages={languages[locale]}>
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
                        <FormattedMessage id="username" />
                     </label>
                     <input
                        type="text"
                        name="username"
                        id="username"
                        maxLength="25"
                        placeholder={languages[locale]["username-placeholder"]}
                        value={username}
                        className="form-control"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                     />
                  </div>
                  <div>
                     <label htmlFor="password" className="login-label">
                        <FormattedMessage id="password" />
                     </label>
                     <input
                        type="password"
                        name="password"
                        id="password"
                        maxLength="25"
                        placeholder={languages[locale]["password-placeholder"]}
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                     />
                  </div>
                  <a className="a_login" id="a_forgot" href="/resetPass">
                     <FormattedMessage id="forgot-password" />
                  </a>
                  <Button className="btn-outline-primary" type="submit" id="login-btn" value="Login">
                     <i className="fas fa-sign-in-alt login-btn"></i> &nbsp;
                     <FormattedMessage id="login" />
                  </Button>
                  <Button className="btn-outline-danger" id="a_registration" onClick={handleClick}>
                     <i className="fas fa-user-plus a_registration"></i>&nbsp; <FormattedMessage id="register" />
                  </Button>
               </div>
            </form>
         </IntlProvider>
      </>
   );
}
