import "./messagesModal.css";
import { useEffect } from "react";
import alertStore from "../../../stores/alertStore";

export default function AlertsMessage() {
   const { error, message, visible, setVisible, setMessage } = alertStore((state) => state);

   useEffect(() => {
      if (visible) {
         setTimeout(() => {
            setVisible(false);
            setMessage("");
         }, 1200);
      }
   }, [visible]);

   return (
      <>
         {visible ? (
            <div id="alertMessage" className={`alert ${error ? "alert-danger" : "alert-success"}`}>
               <h4 class="alert-heading">{error ? "Failed" : "Success"}</h4>
               {message}
            </div>
         ) : null}
      </>
   );
}
