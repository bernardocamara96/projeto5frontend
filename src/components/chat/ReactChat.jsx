import React, { useState } from "react";
import ChatBot from "react-simple-chatbot";

export default function ReactChat({ username, token }) {
   const [messages, setMessages] = useState([]);

   const handleEnd = () => {
      // Add logic to handle end of conversation
   };

   const handleUserInput = (input) => {
      // Add logic to handle user input and update messages state
      const newMessages = [...messages, { message: input, seen: false }];
      setMessages(newMessages);
   };

   const renderMessages = () => {
      return messages.map((msg, index) => (
         <div key={index}>
            <span>{msg.message}</span>
            {msg.seen && <span>✅</span>}
         </div>
      ));
   };

   return (
      <div>
         <ChatBot
            steps={[
               {
                  id: "intro",
                  message: "Hello!",
                  trigger: "askName",
               },
               {
                  id: "askName",
                  message: "What is your name?",
                  trigger: "userInput",
               },
               {
                  id: "userInput",
                  user: true,
                  trigger: "showReadReceipt",
                  validator: (value) => {
                     handleUserInput(value);
                     return true;
                  },
               },
               {
                  id: "showReadReceipt",
                  component: renderMessages,
                  trigger: "end",
               },
               {
                  id: "end",
                  message: "Thanks for chatting!",
                  end: true,
               },
            ]}
            headerTitle="Chatbot"
            floating
            handleEnd={handleEnd}
         />
      </div>
   );
}
