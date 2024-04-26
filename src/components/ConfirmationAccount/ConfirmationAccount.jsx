import "./ConfirmationAccount.css";
import { resendEmail, confirmUser } from "../../utilities/services";
import alertStore from "../../stores/alertStore";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../stores/userStore";
import { useState } from "react";
import logo from "../../assets/logo.png";
import Button from "react-bootstrap/Button";
import translationStore from "../../stores/translationStore";
import languages from "../../translations";
import { IntlProvider, FormattedMessage } from "react-intl";

export default function ConfirmationAccount({ token }) {
   const navigate = useNavigate();
   const user = userStore.getState().user;
   const [password, setPassword] = useState("");
   const [repeatPass, setRepeatPass] = useState("");
   const { locale, updateLocale } = translationStore();
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
         <IntlProvider locale={locale} messages={languages[locale]}>
            {token === "notconfirmed" ? (
               <div id="confirmationAccount_div" className="agileForm notConfirmed-width">
                  <div className="banner-accountConfirm">
                     <i class="bi bi-check-circle-fill fa-lg"></i>
                     <div>
                        <img src={logo} alt="img" className="logo" />
                        &nbsp;&nbsp;AgileFlow
                     </div>
                  </div>
                  <div className="content_register">
                     <p>
                        <FormattedMessage id="account-confirmation-message1" />,{" "}
                        <b>
                           <FormattedMessage id="account-confirmation-message2" />
                        </b>
                        <FormattedMessage id="account-confirmation-message3" />
                        <b>
                           <FormattedMessage id="account-confirmation-message4" />
                        </b>
                        <FormattedMessage id="account-confirmation-message5" />
                        &nbsp;
                        <b>
                           <FormattedMessage id="account-confirmation-message6" />
                        </b>
                        <FormattedMessage id="account-confirmation-message7" />
                     </p>

                     <Button className="btn-outline-secondary" type="button" id="resend-btn" onClick={handleClick}>
                        <i class="bi bi-arrow-repeat"></i>
                        <FormattedMessage id="resend-email" />
                     </Button>
                     <Button className="btn-outline-primary" type="button" id="login-btn" onClick={() => navigate("/")}>
                        <i className="fas fa-sign-in-alt login-btn"></i> <FormattedMessage id="login" />
                     </Button>
                  </div>
               </div>
            ) : (
               <form id="confirmationAccount_div" className="agileForm confirmed-width">
                  <div className="banner-accountConfirm">
                     <i class="bi bi-check-circle-fill fa-lg"></i>
                     <div>
                        <img src={logo} alt="img" className="logo" />
                        &nbsp;&nbsp;AgileFlow
                     </div>
                  </div>
                  <div className="content_register">
                     <div className="register-flex">
                        <label htmlFor="password">
                           <FormattedMessage id="your-password" />
                        </label>
                        <input
                           type="password"
                           name="password"
                           id="password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           placeholder={languages[locale]["password-placeholder"]}
                           className="form-control"
                           required
                        />
                     </div>
                     <div className="register-flex">
                        <label htmlFor="repeatPass">
                           {" "}
                           <FormattedMessage id="repeat-your-password" />
                        </label>
                        <input
                           type="password"
                           name="repeatPass"
                           id="repeatPass"
                           value={repeatPass}
                           onChange={(e) => setRepeatPass(e.target.value)}
                           placeholder={languages[locale]["repeat-password-placeholder"]}
                           className="form-control"
                           required
                        />
                     </div>
                     <Button className="btn-outline-secondary" type="submit" id="submit-pass" onClick={handleSubmit}>
                        <i class="bi bi-arrow-right-circle fa-lg"></i>&nbsp;
                        <FormattedMessage id="submit" />
                     </Button>
                  </div>
               </form>
            )}
         </IntlProvider>
      </>
   );
}
