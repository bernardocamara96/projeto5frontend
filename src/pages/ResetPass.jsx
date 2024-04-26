import ResetPassword from "../components/Forms/ResetPassword";

import Footer from "../components/Footers/Footer";
import AlertsMessage from "../components/somemodals/messagesModal/AlertsMessage";
import { useState } from "react";
import translationStore from "../stores/translationStore";

export default function ResetPass() {
   const { locale, updateLocale } = translationStore();
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
            <ResetPassword />
         </main>
         <Footer />
         <AlertsMessage />
      </>
   );
}
