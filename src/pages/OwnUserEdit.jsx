import EditOwnProfile from "../components/Forms/EditOwnProfile";
import HeaderScrum from "../components/Headers/HeaderScrum";
import Footer from "../components/Footers/Footer";
import AlertsMessage from "../components/somemodals/messagesModal/AlertsMessage";
import { useState } from "react";

export default function OwnUserEdit() {
   const [passwordActive, setPasswordActive] = useState(false);
   return (
      <>
         <HeaderScrum />
         <EditOwnProfile passwordActive={passwordActive} setPasswordActive={setPasswordActive} />
         <Footer />
         <AlertsMessage />
      </>
   );
}
