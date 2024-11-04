import React, { useState, useEffect } from "react";
import axios from "axios";


export default function Queue() {
    const [queue, setQueue] = useState([]);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8000/ws/queue/");
        ws.onmessage = (event) => setQueue(JSON.parse(event.data));
        return () => ws.close();
    }, []);

    const handlePlay = async (filename) => {
        try {
            const response = await axios.get(`http://localhost:8000/play-audio/?filename=${filename}`)
            console.log('response', response)
        } catch (error) {
            console.error('error', error)
        }
    };


    return (
        <div>
            <h2>Queue:</h2>
            {queue.map((item, index) => <div key={index} >{item.filename} <button onClick={() => handlePlay(item.filename)} >play</button></div>)}
        </div>
    );
}