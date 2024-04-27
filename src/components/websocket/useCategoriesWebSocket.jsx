import { useEffect } from "react";

function useCategoriesWebSocket(token, setCategoryList) {
   const WS_URL = `ws://localhost:8080/projeto5backend/websocket/categories/${token}`;

   useEffect(() => {
      const socket = new WebSocket(WS_URL);

      socket.onopen = () => {
         console.log("The websocket connection is open");
      };

      socket.onmessage = (event) => {
         console.log(event.data);
         const message = event.data;
         const json = JSON.parse(message);
         setCategoryList(json);
      };

      socket.onerror = (error) => {
         console.error("WebSocket error:", error);
      };

      socket.onclose = () => {
         console.log("The websocket connection is closed");
      };

      return () => {
         // Clean up function to close the websocket connection when the component unmounts
         socket.close();
      };
   }, []);
}

export default useCategoriesWebSocket;
