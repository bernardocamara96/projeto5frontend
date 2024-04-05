import "./ResetPassword.css";
import { recoverPassword } from "../../utilities/services";
import { useState } from "react";
import { useParams } from "react-router-dom";
import alertStore from "../../stores/alertStore";
import { useNavigate } from "react-router-dom";

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
         <div id="resetPass-div">
            <h1>Reset Password</h1>
            <form id="resetPass-form">
               <label htmlFor="password">New Password</label>
               <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
               />
               <label htmlFor="repeatPassword">Repeat Password</label>
               <input
                  type="password"
                  id="repeatPassword"
                  name="repeatPassword"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  required
               />
               <button type="submit" onClick={handleSubmit}>
                  Submit new password
               </button>
            </form>
         </div>
      </>
   );
}
