import { useEffect } from "react";

function useMessageWebSocket(token, setNotificationsNumber) {
   const WS_URL = `ws://localhost:8080/projeto5backend/websocket/notifications/${token}`;

   useEffect(() => {
      const socket = new WebSocket(WS_URL);

      socket.onopen = () => {
         console.log("The websocket connection is open");
      };

      socket.onmessage = (event) => {
         console.log(event.data);
         const message = event.data;
         if (message.startsWith("Messages number:")) {
            console.log(message);
            var json = message.substring("Messages number: ".length);
            var messagesNumber = JSON.parse(json);
            setNotificationsNumber(messagesNumber);
            console.log(messagesNumber);
         }
      };

      socket.onerror = (error) => {
         console.error("WebSocket error:", error);
      };

      socket.onclose = () => {
         console.log(`The websocke connection is closed`);
      };

      return () => {
         socket.close();
      };
   }, []);
}

export default useMessageWebSocket;
