import Login from "../components/Forms/Login";
import Footer from "../components/Footers/Footer";
import AlertsMessage from "../components/somemodals/messagesModal/AlertsMessage";
import { useEffect } from "react";
import translationStore from "../stores/translationStore";

function App() {
   const { locale, updateLocale } = translationStore();

   // Clear filters and user storage
   useEffect(() => {
      sessionStorage.removeItem("username-storage");
      sessionStorage.removeItem("filter-storage");
      sessionStorage.removeItem("user-storage");
      sessionStorage.removeItem("tasks-storage");
   }, []);
   return (
      <>
         <div id="languages-row-login">
            <div
               style={{ fontWeight: locale === "pt" && "bold" }}
               onClick={() => {
                  updateLocale("pt");
               }}
            >
               PT
            </div>
            <div
               style={{ fontWeight: locale === "en" && "bold" }}
               onClick={() => {
                  updateLocale("en");
               }}
            >
               EN
            </div>
         </div>
         <main className="wrapper">
            <Login />
         </main>
         <Footer />
         <AlertsMessage />
      </>
   );
}

export default App;
