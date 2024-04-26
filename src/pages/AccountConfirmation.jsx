import ConfirmationAccount from "../components/ConfirmationAccount/ConfirmationAccount";
import LoginHeader from "../components/Headers/LoginHeader";
import Footer from "../components/Footers/Footer";
import { useParams } from "react-router-dom";
import AlertsMessage from "../components/somemodals/messagesModal/AlertsMessage";
import { auxiliarTokenValidator } from "../utilities/services";
import { useState, useEffect } from "react";
import NotFound from "./NotFound";
import { useNavigate } from "react-router-dom";
import translationStore from "../stores/translationStore";

export default function AccountConfirmation() {
   const { token } = useParams();
   const [tokenValidated, setTokenValidated] = useState(false);
   const navigate = useNavigate();
   const { locale, updateLocale } = translationStore();

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
            <div style={{ fontWeight: locale === "pt" && "bold" }} onClick={() => updateLocale("pt")}>
               PT
            </div>
            <div style={{ fontWeight: locale === "en" && "bold" }} onClick={() => updateLocale("en")}>
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
