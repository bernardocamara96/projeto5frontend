import "./messagesModal.css";
import alertStore from "../../../stores/alertStore";
import { useEffect } from "react";
import Button from "react-bootstrap/Button";

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
                     <Button
                        className="confirmButton btn-outline-primary"
                        id="button_Ok"
                        onClick={() => handleConfirm(true)}
                     >
                        Ok
                     </Button>
                     <Button
                        className="confirmButton btn-outline-secondary"
                        id="btn-cancel-modal"
                        onClick={() => handleConfirm(false)}
                     >
                        Cancel
                     </Button>
                  </div>
               </div>
               <div id="confirmBackground"></div>
            </>
         ) : null}
      </>
   );
}
