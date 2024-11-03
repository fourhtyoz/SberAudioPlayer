// src/useWebSocket.js
import { useEffect, useRef, useState } from 'react';

const useWebSocket = (url) => {
  const [messages, setMessages] = useState([]);  // To store received messages
  const socketRef = useRef(null);                // WebSocket reference

  useEffect(() => {
    socketRef.current = new WebSocket(url);

    // Handle incoming messages
    socketRef.current.onmessage = (event) => {
      const message = event.data;
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    // Clean up WebSocket on component unmount
    return () => {
      socketRef.current.close();
    };
  }, [url]);

  // Send a message through the WebSocket
  const sendMessage = (message) => {
    if (socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    }
  };

  return { messages, sendMessage };
};

export default useWebSocket;
