import "./ResetPassword.css";
import { newPassEmail } from "../../utilities/services";
import { useState } from "react";
import alertStore from "../../stores/alertStore";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import logo from "../../assets/logo.png";

export default function ResetPassword() {
   const [email, setEmail] = useState("");
   const navigate = useNavigate();

   {
      console.log(email);
   }
   function handleAlert(message, error) {
      alertStore.getState().setMessage(message);
      alertStore.getState().setVisible(true);
      alertStore.getState().setError(error);
   }

   const handleClick = (e) => {
      e.preventDefault();
      newPassEmail(email).then((response) => {
         if (response.status == 200) {
            handleAlert("Email sent", false);
            setTimeout(() => {
               navigate("/", { replace: true });
            }, 1200);
         } else if (response.status == 404) {
            handleAlert("Email not found", true);
         } else if (response.status == 406) {
            handleAlert("Email not valid", true);
         } else {
            handleAlert("Error sending email", true);
         }
      });
   };
   return (
      <>
         <form id="resetPass-form" className="agileForm">
            <div id="banner_login">
               <i className="bi bi-key-fill fa-lg"></i>
               <span id="member-login-banner">
                  <img src={logo} alt="img" className="logo" />
                  &nbsp;&nbsp;AgileFlow
               </span>
            </div>
            <div id="content_login">
               <div>
                  <label htmlFor="email" id="email-lbl-resetPass">
                     Your Email
                  </label>
                  <input
                     type="email"
                     id="email-resetPass"
                     name="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="Enter your email"
                     className="form-control register-input"
                     required
                  />
               </div>
               <Button className="btn-outline-secondary" id="btn-resetPass" type="submit" onClick={handleClick}>
                  <i className="bi bi-key-fill"></i> Reset Password
               </Button>
               <Button className="btn-outline-primary" type="button" id="login-btn" onClick={() => navigate("/")}>
                  <i class="fas fa-sign-in-alt login-btn"></i> Login
               </Button>
            </div>
         </form>
      </>
   );
}
