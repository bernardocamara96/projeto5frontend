import "./ConfirmationAccount.css";
import { resendEmail, confirmUser } from "../../utilities/services";
import alertStore from "../../stores/alertStore";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../stores/userStore";
import { useState } from "react";

export default function ConfirmationAccount({ token }) {
   const navigate = useNavigate();
   const user = userStore.getState().user;
   const [password, setPassword] = useState("");
   const [repeatPass, setRepeatPass] = useState("");
   // Function to set the alert messages
   function handleAlert(message, error) {
      alertStore.getState().setMessage(message);
      alertStore.getState().setVisible(true);
      alertStore.getState().setError(error);
   }
   const handleClick = () => {
      {
         console.log(user.token);
      }
      resendEmail(user.token).then((response) => {
         if (response.ok) {
            handleAlert("Email sent successfully", false);
            setTimeout(() => {
               navigate("/", { replace: true });
            }, 800);
         } else {
            handleAlert("There was an error resending the email", true);
         }
      });
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      if (password.length < 8) {
         handleAlert("Password must be at least 8 characters long", true);
      } else if (password !== repeatPass) {
         handleAlert("Passwords do not match", true);
      } else {
         confirmUser(true, password, token).then((response) => {
            if (response.ok) {
               handleAlert("Account confirmed successfully", false);
               setTimeout(() => {
                  navigate("/", { replace: true });
               }, 1000);
            } else {
               handleAlert("There was an error confirming the account", true);
            }
         });
      }
   };
   return (
      <>
         {token === "notconfirmed" ? (
            <div id="confirmationAccount_div">
               <h1>Account Verification</h1>
               <p>
                  To complete your account registration, <b>please check your email inbox for a message from us.</b>{" "}
                  Click on the confirmation link provided in the email to <b>activate your account</b> and start using
                  our services. If you haven't received the email, please check your spam or junk folder. If you still
                  can't find it, you can &nbsp;<b>request a new confirmation email</b> by clicking on the button below.
               </p>
               <button onClick={handleClick}>Resend Confirmation Email</button>
            </div>
         ) : (
            <form id="confirmationAccount_div" style={{ width: "23%", gap: "10px" }}>
               <h1>Account Confirmation</h1>
               <label htmlFor="password">Your Password</label>
               <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
               />
               <label htmlFor="repeatPass">Repeat your Password</label>
               <input
                  type="password"
                  name="repeatPass"
                  id="repeatPass"
                  value={repeatPass}
                  onChange={(e) => setRepeatPass(e.target.value)}
                  required
               />
               <button type="submit" style={{ width: "100%", marginTop: "10px" }} onClick={handleSubmit}>
                  Submit
               </button>
            </form>
         )}
      </>
   );
}
