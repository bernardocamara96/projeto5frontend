import ResetPassword from "../components/Forms/ResetPassword";
import LoginHeader from "../components/Headers/LoginHeader";
import Footer from "../components/Footers/Footer";
import AlertsMessage from "../components/somemodals/messagesModal/AlertsMessage";

export default function ResetPass() {
   return (
      <>
         <LoginHeader />
         <ResetPassword />
         <Footer />
         <AlertsMessage />
      </>
   );
}
