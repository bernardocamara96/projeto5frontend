import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import alertStore from "../../stores/alertStore";

function useMessageWebSocket(token, username, setMessages) {
   const WS_URL = `ws://localhost:8080/projeto5backend/websocket/message/${token}/${username}`;
   const navigate = useNavigate();
   const [sendMsg, setSendMsg] = useState(null);

   function handleAlert(message, error) {
      alertStore.getState().setMessage(message);
      alertStore.getState().setVisible(true);
      alertStore.getState().setError(error);
   }

   useEffect(() => {
      const socket = new WebSocket(WS_URL);

      socket.onopen = () => {
         console.log("The websocket connection is open");
      };

      socket.onmessage = (event) => {
         console.log(event.data);
         const message = event.data;
         if (message.startsWith("getMessages:")) {
            var json = message.substring("getMessages: ".length);

            var messagesDto = JSON.parse(json);
            setMessages((prevMessages) => [
               ...prevMessages,
               {
                  position: "left",
                  type: "text",
                  title: username,
                  text: messagesDto.text,
                  avatar: messagesDto.senderPhoto,
                  className: "custom-left-message",
                  date: new Date(),
               },
            ]);
         } else if (message.startsWith("All messages were seen:")) {
            setMessages((prevMessages) =>
               prevMessages.map((msg) => ({
                  ...msg,
                  status: "read",
               }))
            );
         } else if (message.startsWith("Messages number:")) {
            console.log(message);
            var json = message.substring("Messages number: ".length);
            var messagesNumber = JSON.parse(json);
            setMessages(messagesNumber);
            console.log(messagesNumber);
         } else if (message.startsWith("Token has expired")) {
            handleAlert("Token has expired", true);
            navigate("/", { replace: true });
         }
      };

      socket.onerror = (error) => {
         console.error("WebSocket error:", error);
      };

      socket.onclose = () => {
         console.log(`The websocket ${token}/${username}connection is closed`);
      };

      function sendMessage(messageDto) {
         socket.send(JSON.stringify(messageDto));
         console.log("Message sent to server:", messageDto);
      }

      setSendMsg(() => sendMessage);

      return () => {
         socket.close();
      };
   }, []);
   return { sendMsg };
}

export default useMessageWebSocket;
