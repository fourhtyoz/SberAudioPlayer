import React, { useState, useEffect } from "react";
import UploadedAudio from "./UploadedAudio";
import { api } from "../utils/api";


export default function Queue() {
    const [queue, setQueue] = useState([]);
    const [error, setError] = useState('');
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8000/ws/queue/");
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            if (data?.error) {
                setError(data.error)
                console.error(data)
            } else {
                if (queue.length < data.length) {
                    const excessItems = data.slice(queue.length);
                    const newQueue = queue.concat(excessItems)
                    setQueue(newQueue);
                } else if (queue.length > data.length) {
                    setQueue(data)
                }
            }
        }
        ws.onerror = (event) => {
            console.error(event)
        }
        return () => ws.close();
    }, [queue]);

      const playAudioQueue = async () => {
        setIsPlaying(true)
        for (let i = 0; i < queue.length; i++) {
          const currentItem = queue[i];
            
          setQueue(queue.map((item, index) => 
            index === i ? { ...item, is_playing: true } : { filename: item.filename }
          ));
      
          try {
            await api.get(`/play-audio/?filename=${currentItem.filename}`);
          } catch (error) {
            console.error("Error playing audio:", error);
          }
        }
      
        setQueue(queue.map(item => ({ filename: item.filename })));
        setIsPlaying(false)
      };

      return (
        <div>
            <h2>Queue</h2>
            <div>{error}</div>
            {queue.map((item, index) => <UploadedAudio key={index} index={index} filename={item.filename} disabled={isPlaying} isPlaying={item.is_playing}/>)}
            {queue.length > 0 && <button onClick={playAudioQueue} disabled={isPlaying}>Play</button>}
        </div>
    );
}