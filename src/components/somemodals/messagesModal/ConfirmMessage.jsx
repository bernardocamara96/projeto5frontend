import "./messagesModal.css";
import alertStore from "../../../stores/alertStore";
import { useEffect } from "react";

export default function ConfirmMessage() {
   const { confirmVisible, confirmMessage, confirmCallback, setConfirmVisible } = alertStore((state) => state);

   const handleConfirm = (confirmed) => {
      if (confirmed) {
         confirmCallback(); // Execute callback function upon confirmation
      }
      setConfirmVisible(false);
   };

   return (
      <>
         {confirmVisible ? (
            <>
               <div className="messagesModal" id="confirmModal">
                  {confirmMessage}
                  <div id="buttonsConfirm">
                     <button className="confirmButton" id="button_Ok" onClick={() => handleConfirm(true)}>
                        Ok
                     </button>
                     <button className="confirmButton" onClick={() => handleConfirm(false)}>
                        Cancel
                     </button>
                  </div>
               </div>
               <div id="confirmBackground"></div>
            </>
         ) : null}
      </>
   );
}
