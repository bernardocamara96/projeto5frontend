import React from "react";

export default function Reply() {
   return (
      <div className="message">
         <div className="response">User message</div>
         <span className="read-receipt">✅</span> {/* Checkmark icon */}
      </div>
   );
}
