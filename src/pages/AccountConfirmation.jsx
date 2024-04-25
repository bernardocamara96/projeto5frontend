import ConfirmationAccount from "../components/ConfirmationAccount/ConfirmationAccount";
import LoginHeader from "../components/Headers/LoginHeader";
import Footer from "../components/Footers/Footer";
import { useParams } from "react-router-dom";
import AlertsMessage from "../components/somemodals/messagesModal/AlertsMessage";
import { auxiliarTokenValidator } from "../utilities/services";
import { useState, useEffect } from "react";
import NotFound from "./NotFound";
import { useNavigate } from "react-router-dom";

export default function AccountConfirmation() {
   const { token } = useParams();
   const [tokenValidated, setTokenValidated] = useState(false);
   const navigate = useNavigate();
   const [english, setEnglish] = useState(true);

   useEffect(() => {
      auxiliarTokenValidator(token).then((response) => {
         if (!response.ok) {
            if (token != "notconfirmed") {
               navigate("/ErrorNotFound", { replace: true });
            }
         }
      });
   }, []);

   return (
      <>
         <div id="languages-row-login">
            <div style={{ fontWeight: !english && "bold" }} onClick={() => setEnglish(false)}>
               PT
            </div>
            <div style={{ fontWeight: english && "bold" }} onClick={() => setEnglish(true)}>
               EN
            </div>
         </div>
         <main>
            <ConfirmationAccount token={token} />
         </main>
         <Footer />
         <AlertsMessage />
      </>
   );
}
