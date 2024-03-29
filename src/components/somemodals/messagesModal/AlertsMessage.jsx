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

   return <>{visible ? <div className={`messagesModal  ${error ? "error" : "noError"}`}>{message}</div> : null}</>;
}
