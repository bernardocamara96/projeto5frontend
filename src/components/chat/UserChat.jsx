import React, { useEffect, useState } from "react";
import { Widget } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import { getUserPhotoDto } from "../../utilities/services";
import "./UserChat.css";

export default function UserChat({ username, token }) {
   const [userPhoto, setUserPhoto] = useState("");
   const [name, setName] = useState("");
   const [confirmed, setConfirmed] = useState(false);
   const [deleted, setDeleted] = useState(false);
   const [messages, setMessages] = useState([]);

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

   useEffect(() => {
      // Simulate marking the last message as seen by the other user after a delay
      const timeout = setTimeout(() => {
         if (messages.length > 0 && !messages[messages.length - 1].isUser) {
            markMessageAsSeen(messages.length - 1);
         }
      }, 3000);

      // Clear the timeout on component unmount
      return () => clearTimeout(timeout);
   }, [messages]);

   const handleNewUserMessage = (newMessage) => {
      setMessages([...messages, { id: Date.now(), text: newMessage, seen: false }]);
   };

   const markMessageAsSeen = (index) => {
      const updatedMessages = [...messages];
      updatedMessages[index].seen = true;
      setMessages(updatedMessages);
   };

   const customMessageRenderer = (message) => {
      // Dynamic styling based on "seen" attribute
      const messageStyle = {
         backgroundColor: message.seen ? "green" : "red",
         color: "white", // Adjust text color for better visibility
      };

      return (
         <div key={message.id} style={messageStyle}>
            {message.text}
         </div>
      );
   };

   return (
      <>
         {!deleted && confirmed && (
            <>
               <Widget
                  handleNewUserMessage={handleNewUserMessage}
                  title={name}
                  subtitle={null}
                  senderPlaceHolder="Type your message here..."
                  titleAvatar={userPhoto}
                  customMessageRenderer={customMessageRenderer}
               />
            </>
         )}
      </>
   );
}
