import RegisterForm from "../components/Forms/RegisterForm";
import Header from "../components/Headers/LoginHeader";
import Footer from "../components/Footers/Footer";
import { useLocation } from "react-router-dom";
import HeaderScrum from "../components/Headers/HeaderScrum";
import AlertsMessage from "../components/somemodals/messagesModal/AlertsMessage";

export default function Register() {
   const location = useLocation();
   const { type } = location.state || {};

   return (
      <>
         {type === "normalRegister" ? <Header /> : <HeaderScrum />}
         <RegisterForm type={type} />;
         <Footer />
         <AlertsMessage />
      </>
   );
}
