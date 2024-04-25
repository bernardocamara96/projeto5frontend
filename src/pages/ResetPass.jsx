import ResetPassword from "../components/Forms/ResetPassword";

import Footer from "../components/Footers/Footer";
import AlertsMessage from "../components/somemodals/messagesModal/AlertsMessage";
import { useState } from "react";

export default function ResetPass() {
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
            <ResetPassword />
         </main>
         <Footer />
         <AlertsMessage />
      </>
   );
}
