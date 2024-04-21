import React, { useEffect, useRef, useState } from "react";
import { MessageList, Input } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import "./MyUserChat.css";
import { getUserPhotoDto } from "../../utilities/services";
import { Button } from "react-bootstrap";
import { getMessages, addMessage, seenMessages } from "../../utilities/services";
import { usernameStore } from "../../stores/userStore";

export default function MyChat({ username, token }) {
   const [name, setName] = useState("");
   const [userPhoto, setUserPhoto] = useState("");
   const [messages, setMessages] = useState([]);
   const [messageText, setMessageText] = useState("");
   const usernameStorage = usernameStore.getState().username;
   const messageListContainerRef = useRef(null);

   useEffect(() => {
      getUserPhotoDto(token, usernameStorage).then((response) => {
         if (response.ok) {
            response.json().then((data) => {
               setUserPhoto(data.photoURL);
               setName(data.firstName);
               //setDeleted(data.deleted);
               //setConfirmed(data.confirmed);
            });
         }
      });
      seenMessages(token, username);
      getMessages(token, username).then((response) => {
         if (response.ok) {
            response.json().then((data) => {
               const formattedMessages = data.map((message) => ({
                  position: message.senderUsername === username ? "left" : "right",
                  type: "text",
                  title: message.senderFirstName,
                  text: message.text,
                  status: message.senderUsername === username ? null : message.seen ? "read" : "received",
                  avatar: message.senderPhoto,
                  className: message.senderUsername === username ? "custom-left-message" : "custom-right-message",
               }));
               setMessages(formattedMessages);
            });
         }
      });
   }, []);

   useEffect(() => {
      // Scroll to the bottom of the message list after messages are updated
      if (messageListContainerRef.current) {
         messageListContainerRef.current.scrollTop = messageListContainerRef.current.scrollHeight;
      }
   }, [messages]);

   const handleClick = () => {
      const messageDto = {
         text: messageText,
         senderUsername: usernameStorage,
         recipientUsername: username,
      };
      addMessage(token, messageDto).then((response) => {
         if (response.ok) {
            const newMessage = {
               position: "right",
               type: "text",
               title: usernameStorage,
               text: messageText,
               status: "received",
               avatar: userPhoto,
               className: "custom-right-message",
            };
            setMessages([...messages, newMessage]);
            setMessageText("");

            if (messageListContainerRef.current) {
               messageListContainerRef.current.scrollTop = messageListContainerRef.current.scrollHeight;
            }
         }
      });
   };
   return (
      <div className="agileForm" id="chatForm">
         <div className="banner_register">
            <i className="fas fa-comment"></i>
         </div>
         <div className="content_register" id="content-messages-container">
            <div id="messageListContainer" ref={messageListContainerRef}>
               <MessageList className="message-list" lockable={true} toBottomHeight={"100%"} dataSource={messages} />
            </div>
            <div className="content_register" id="content-input-messages">
               <div className="agileRow" id="reply-row">
                  <Input
                     placeholder="Type here..."
                     multiline={true}
                     value={messageText}
                     onChange={(e) => setMessageText(e.target.value)}
                  ></Input>
                  <Button className="btn-outline-primary" id="button-reply" onClick={handleClick}>
                     <i className="fas fa-reply"></i>
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}
