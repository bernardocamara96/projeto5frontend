import "./UnseenMessages.css";
import NotificationsCard from "../cards/NotificationsCard";

export default function UnseenMessages({ notifications }) {
   return (
      <div id="unseenMessages-container">
         {notifications.map((notification) => {
            return (
               <NotificationsCard
                  username={notification.senderUsername}
                  firstName={notification.senderFirstName}
                  text={notification.text}
                  photo={notification.photoUrl}
                  timestamp={notification.timestamp}
                  seen={notification.seen}
               />
            );
         })}
      </div>
   );
}
