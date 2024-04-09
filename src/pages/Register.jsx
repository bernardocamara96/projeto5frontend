import RegisterForm from "../components/Forms/RegisterForm";

import Footer from "../components/Footers/Footer";
import { useLocation } from "react-router-dom";
import HeaderScrum from "../components/Headers/HeaderScrum";
import AlertsMessage from "../components/somemodals/messagesModal/AlertsMessage";
import AsideMenu from "../components/Menus/AsideMenu";

export default function Register() {
   const location = useLocation();
   const { type } = location.state || {};

   return (
      <>
         {type === "normalRegister" ? null : (
            <>
               <HeaderScrum />
               <AsideMenu />
            </>
         )}
         <main className={type === "productOwnerRegister" && "scrum-main"}>
            <RegisterForm type={type} />;
         </main>
         <Footer id="footer-register" />
         <AlertsMessage />
      </>
   );
}
