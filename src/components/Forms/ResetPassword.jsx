import "./ResetPassword.css";
import { newPassEmail } from "../../utilities/services";
import { useState } from "react";
import alertStore from "../../stores/alertStore";
import { useNavigate } from "react-router-dom";

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
         <div id="resetPass-div">
            <h1>Reset Password</h1>
            <form id="resetPass-form">
               <label htmlFor="email">Your Email</label>
               <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
               />
               <button type="submit" onClick={handleClick}>
                  Reset Password
               </button>
            </form>
         </div>
      </>
   );
}
