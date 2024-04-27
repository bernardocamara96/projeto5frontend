import React, { useEffect, useRef, useState } from "react";
import { MessageList } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import "./MyUserChat.css";
import { getUserPhotoDto } from "../../utilities/services";
import { Button } from "react-bootstrap";
import { getMessages, addMessage, seenMessages } from "../../utilities/services";
import { usernameStore } from "../../stores/userStore";
import useMessageWebSocket from "../websocket/useMessageWebSocket";
import translationStore from "../../stores/translationStore";
import languages from "../../translations";
import { IntlProvider, FormattedMessage } from "react-intl";

export default function MyChat({ username, token }) {
   const [name, setName] = useState("");
   const [userPhoto, setUserPhoto] = useState("");
   const [messages, setMessages] = useState([]);
   const [messageText, setMessageText] = useState("");
   const usernameStorage = usernameStore.getState().username;
   const messageListContainerRef = useRef(null);
   const [userChat, setUserChat] = useState("");
   const { locale } = translationStore();

   useEffect(() => {
      getUserPhotoDto(token, username).then((response) => {
         if (response.ok) {
            response.json().then((data) => {
               setUserChat(data.firstName);
               //setDeleted(data.deleted);
               //setConfirmed(data.confirmed);
            });
         }
      });
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
                  date: message.sendDate,
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

   const { sendMsg } = useMessageWebSocket(token, username, setMessages);

   const handleClick = () => {
      const messageDto = {
         text: messageText,
         senderUsername: usernameStorage,
         recipientUsername: username,
      };

      sendMsg(messageDto);
      const newMessage = {
         position: "right",
         type: "text",
         title: usernameStorage,
         text: messageText,
         status: "received",
         avatar: userPhoto,
         className: "custom-right-message",
         date: new Date(),
      };
      setMessages([...messages, newMessage]);

      setMessageText("");
   };

   return (
      <IntlProvider locale={locale} messages={languages[locale]}>
         <div className="agileForm" id="chatForm">
            <div className="banner_register">
               <p id="banner-messages-p">
                  <i className="fas fa-comment"></i>
                  <b>
                     &nbsp;&nbsp; <FormattedMessage id="chat-with" /> <span>{userChat}</span>
                  </b>
               </p>
            </div>
            <div className="content_register" id="content-messages-container">
               <div id="messageListContainer" ref={messageListContainerRef}>
                  <MessageList className="message-list" lockable={true} toBottomHeight={"100%"} dataSource={messages} />
               </div>
               <div className="content_register" id="content-input-messages">
                  <div className="agileRow" id="reply-row">
                     <textarea
                        id="sender-message-input"
                        placeholder={languages[locale]["chat-placeholder"]}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                     ></textarea>
                     <Button className="btn-outline-primary" id="button-reply" onClick={handleClick}>
                        <i className="fas fa-reply"></i>
                     </Button>
                  </div>
               </div>
            </div>
         </div>
      </IntlProvider>
   );
}
