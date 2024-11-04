import React, { useState, useEffect } from "react";


export default function Queue() {
    const [queue, setQueue] = useState([]);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8000/ws/queue/");
        ws.onmessage = (event) => setQueue(JSON.parse(event.data));
        return () => ws.close();
    }, []);

    return (
        <div>
            <h2>Queue:</h2>
            {queue.map((item, index) => <div key={index} >{item.filename}</div>)}
        </div>
    );
}