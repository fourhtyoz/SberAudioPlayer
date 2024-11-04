import React, { useState, useEffect } from "react";
import UploadedAudio from "./UploadedAudio";
import axios from "axios";
import { API_URL } from "../utils/constants";

export default function Queue() {
    const [queue, setQueue] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState('');
    const [isPlaying, setIsPlaying] = useState(false)
    
    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8000/ws/queue/");
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            // console.log(data)
            if (data?.error) {
                setError(data.error)
                console.log(data.error)
            } else {
                setQueue(JSON.parse(event.data));
            }
        }
        ws.onerror = (event) => {
            console.log(event)
        }
        return () => ws.close();
    }, []);

    const handlePlay = async () => {
        setIsPlaying(true)
        try {
            const response = await axios.get(`${API_URL}/play-queue/`)
            console.log(response)
        } catch (e) {
            console.error(e)
        } finally {
            setIsPlaying(false)
        }
    }

    // console.log(queue)

    return (
        <div>
            <h2>Queue {isPlaying ? 'is playing' : 'is idle'}</h2>
            <div>{error}</div>
            {queue.map((item, index) => <UploadedAudio key={index} index={index} filename={item.filename} disabled={isPlaying} />)}
            {queue.length > 0 && <button onClick={handlePlay} disabled={isPlaying} >Play</button>}

        </div>
    );
}