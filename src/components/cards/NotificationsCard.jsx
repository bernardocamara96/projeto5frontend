import "./NotificationsCard.css";
import { useNavigate } from "react-router-dom";

export default function NotificationsCard({ username, photo, firstName, text, timestamp, seen }) {
   const navigate = useNavigate();
   return (
      <div
         id="notifications-card-container"
         className={seen ? "notification-seen" : "notification-notSeen"}
         onClick={() => navigate(`/userProfile/${username}`)}
      >
         <div className="agileCol">
            <div className="agileRow" id="notifications-header">
               <img src={photo} alt="senderPhoto" />
               <span>{firstName}</span>
            </div>
            <div id="notification-text">{text.length > 50 ? `${text.substring(0, 48)}...` : text}</div>
            <div id="notifications-timestamp">
               {timestamp > 3600
                  ? `${Math.floor(timestamp / 3600)} hours ago`
                  : timestamp > 60
                  ? `${Math.floor(timestamp / 60)} mins ago`
                  : "now"}
            </div>
         </div>
      </div>
   );
}
