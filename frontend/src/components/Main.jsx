import React, { useState } from 'react';
import useWebSocket from '../hooks/useWebSocket';
import AudioUpload from './AudioUpload';


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
            <h2>Sounds queue:</h2>
            {/* <form onSubmit={handleSubmit}>
                <label>Add a new sound: </label>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message"
                />
                <button type="submit">Send</button>
            </form> */}

            <AudioUpload />

            <div>
            <h3>Sounds:</h3>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
            </div>
        </div>
    );
};
