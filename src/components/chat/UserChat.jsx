import React, { useEffect, useState } from "react";
import { Widget, addUserMessage, addResponseMessage } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import { getUserPhotoDto } from "../../utilities/services";
import "./UserChat.css";
import { ChatFeed, Message } from "react-chat-ui";

export default function UserChat({ username, token }) {
   const [userPhoto, setUserPhoto] = useState("");
   const [name, setName] = useState("");
   const [confirmed, setConfirmed] = useState(false);
   const [deleted, setDeleted] = useState(false);
   const [messages, setMessages] = useState([]);
   const [newMessage, setNewMessage] = useState("");

   useEffect(() => {
      getUserPhotoDto(token, username).then((response) => {
         if (response.ok) {
            response.json().then((data) => {
               setUserPhoto(data.photoURL);
               setName(data.firstName);
               setDeleted(data.deleted);
               setConfirmed(data.confirmed);
            });
         }
      });
   }, []);

   const handleNewUserMessage = () => {
      // Your custom logic goes here
      console.log("User sent message:", newMessage);

      // Example: Check if the user's message contains certain keywords
      if (newMessage.toLowerCase().includes("hello")) {
         // If the message contains "hello", respond with a greeting
         addUserMessage("Hello! How can I assist you?");
         addResponseMessage("Hello! How can I assist you?");
      } else if (newMessage.toLowerCase().includes("bye")) {
         // If the message contains "bye", respond with a farewell
         addUserMessage("Goodbye! Have a great day!");
      } else {
         // If the message doesn't match any predefined patterns, handle it as needed
         addUserMessage("Im sorry, I didnt understand that.");
      }
      setNewMessage("");
   };

   const customMessageRenderer = (message, index) => {
      const messageStyle = {
         fontWeight: message.unread ? "bold" : "normal",
         // Add additional styling for unread messages if needed
      };

      return (
         <div key={index} style={messageStyle} onClick={() => markMessageAsRead(index)}>
            {message.text}
         </div>
      );
   };

   return (
      <>
         {!deleted && confirmed && (
            <>
               <Widget
                  title={name}
                  subtitle={null}
                  senderPlaceHolder="Type your message here..."
                  titleAvatar={userPhoto}
               />
               <input
                  id="rwc-sender-input"
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
               />
               <button onClick={handleNewUserMessage} id="rwc-sender-btn">
                  <img
                     src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4IiB2aWV3Qm94PSIwIDAgNTM1LjUgNTM1LjUiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUzNS41IDUzNS41OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGcgaWQ9InNlbmQiPgoJCTxwb2x5Z29uIHBvaW50cz0iMCw0OTcuMjUgNTM1LjUsMjY3Ljc1IDAsMzguMjUgMCwyMTYuNzUgMzgyLjUsMjY3Ljc1IDAsMzE4Ljc1ICAgIiBmaWxsPSIjY2JjYmNiIi8+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg=="
                     alt="Send"
                  />
               </button>
            </>
         )}
      </>
   );
}
