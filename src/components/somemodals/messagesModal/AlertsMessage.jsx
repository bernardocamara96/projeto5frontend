import "./messagesModal.css";
import { useEffect } from "react";
import alertStore from "../../../stores/alertStore";
import translationStore from "../../../stores/translationStore";

export default function AlertsMessage() {
   const { error, message, visible, setVisible, setMessage } = alertStore((state) => state);
   const { locale } = translationStore();

   useEffect(() => {
      if (visible) {
         setTimeout(() => {
            setVisible(false);
            setMessage("");
         }, 1300);
      }
   }, [visible]);

   return (
      <>
         {visible ? (
            <div id="alertMessage" className={`alert ${error ? "alert-danger" : "alert-success"}`}>
               <h4 class="alert-heading">
                  {error ? (locale === "en" ? "Failed" : "Erro") : locale === "en" ? "Seccess" : "Sucesso"}
               </h4>
               {message}
            </div>
         ) : null}
      </>
   );
}
