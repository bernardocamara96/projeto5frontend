import "./ResetPassword.css";
import { recoverPassword } from "../../utilities/services";
import { useState } from "react";
import { useParams } from "react-router-dom";
import alertStore from "../../stores/alertStore";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import Button from "react-bootstrap/Button";

export default function ResetPasswordAfter() {
   const { token } = useParams();
   const [password, setPassword] = useState("");
   const [repeatPassword, setRepeatPassword] = useState("");
   const navigate = useNavigate();

   //function to set the alert messages
   function handleAlert(message, error) {
      alertStore.getState().setMessage(message);
      alertStore.getState().setVisible(true);
      alertStore.getState().setError(error);
   }

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (password === repeatPassword) {
         recoverPassword(password, token).then((response) => {
            if (response.status == 200) {
               handleAlert("Password changed", false);
               setTimeout(() => {
                  navigate("/", { replace: true });
               }, 1200);
            } else {
               handleAlert("Error changing password", true);
            }
         });
      } else {
         handleAlert("Passwords do not match", true);
      }
   };

   return (
      <>
         <div id="resetPass-div" className="agileForm">
            <div className="banner_register">
               <i class="fas fa-key fa-lg"></i>
               <span id="member-login-banner">
                  <img src={logo} alt="img" className="logo" />
                  &nbsp;&nbsp;AgileFlow
               </span>
            </div>
            <div className="content_register">
               <form id="resetPassAfter-form">
                  <div className="resetPassCol">
                     <label htmlFor="password">New Password</label>
                     <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        placeholder="Enter your new password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        required
                     />
                  </div>
                  <div className="resetPassCol">
                     <label htmlFor="repeatPassword">Repeat Password</label>
                     <input
                        type="password"
                        id="repeatPassword"
                        name="repeatPassword"
                        value={repeatPassword}
                        placeholder="Repeat your new password"
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        className="form-control"
                        required
                     />
                  </div>
                  <Button
                     className="btn-outline-secondary"
                     id="btn-submit-PassAfter"
                     type="submit"
                     onClick={handleSubmit}
                  >
                     <i class="bi bi-arrow-right-circle fa-lg"></i>&nbsp; Submit new password
                  </Button>
               </form>
            </div>
         </div>
      </>
   );
}
