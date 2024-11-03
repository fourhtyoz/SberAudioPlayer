import React, { useState } from 'react';
import useWebSocket from '../utils/hooks/useWebSocket';


export default function Main({ isAuthenticated }) {
    const [input, setInput] = useState('');
    const { messages, sendMessage } = useWebSocket('ws://localhost:8000/ws');  // Replace with your server URL

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
        setInput('');  // Clear input after sending
    };

    if (!isAuthenticated) return;

    return (
        <div>
            <h2>WebSocket Chat</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message"
                />
                <button type="submit">Send</button>
            </form>

            <div>
            <h3>Messages:</h3>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
            </div>
        </div>
    );
};
