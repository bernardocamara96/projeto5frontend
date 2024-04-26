import RegisterForm from "../components/Forms/RegisterForm";
import translationStore from "../stores/translationStore";
import Footer from "../components/Footers/Footer";
import { useLocation } from "react-router-dom";
import HeaderScrum from "../components/Headers/HeaderScrum";
import AlertsMessage from "../components/somemodals/messagesModal/AlertsMessage";
import AsideMenu from "../components/Menus/AsideMenu";
import { useState } from "react";

export default function Register() {
   const location = useLocation();
   const { type } = location.state || {};
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
