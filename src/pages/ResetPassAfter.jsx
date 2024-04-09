import ResetPasswordAfter from "../components/Forms/ResetPasswordAfter";
import LoginHeader from "../components/Headers/LoginHeader";
import Footer from "../components/Footers/Footer";
import AlertsMessage from "../components/somemodals/messagesModal/AlertsMessage";

export default function ResetPassAfter() {
   return (
      <>
         <main>
            <ResetPasswordAfter />
         </main>
         <Footer />
         <AlertsMessage />
      </>
   );
}
