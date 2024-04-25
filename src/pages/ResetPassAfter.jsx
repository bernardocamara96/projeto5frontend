import ResetPasswordAfter from "../components/Forms/ResetPasswordAfter";
import LoginHeader from "../components/Headers/LoginHeader";
import Footer from "../components/Footers/Footer";
import AlertsMessage from "../components/somemodals/messagesModal/AlertsMessage";
import { useState } from "react";

export default function ResetPassAfter() {
   const [english, setEnglish] = useState(true);
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
            <ResetPasswordAfter />
         </main>
         <Footer />
         <AlertsMessage />
      </>
   );
}
