import ResetPassword from "../components/Forms/ResetPassword";

import Footer from "../components/Footers/Footer";
import AlertsMessage from "../components/somemodals/messagesModal/AlertsMessage";

export default function ResetPass() {
   return (
      <>
         <main>
            <ResetPassword />
         </main>
         <Footer />
         <AlertsMessage />
      </>
   );
}
