import ConfirmationAccount from "../components/ConfirmationAccount/ConfirmationAccount";
import LoginHeader from "../components/Headers/LoginHeader";
import Footer from "../components/Footers/Footer";
import { useParams } from "react-router-dom";
import AlertsMessage from "../components/somemodals/messagesModal/AlertsMessage";
import { auxiliarTokenValidator } from "../utilities/services";
import { useState, useEffect } from "react";

export default function AccountConfirmation() {
   const { token } = useParams();
   const [tokenValidated, setTokenValidated] = useState(false);

   useEffect(() => {
      auxiliarTokenValidator(token).then((response) => {
         if (response.ok) {
            setTokenValidated(true);
         } else {
            setTokenValidated(false);
         }
      });
   }, []);

   return (
      <>
         <LoginHeader />
         {tokenValidated || token === "notconfirmed" ? <ConfirmationAccount token={token} /> : <h1>404 Not Found</h1>}
         <Footer />
         <AlertsMessage />
      </>
   );
}
