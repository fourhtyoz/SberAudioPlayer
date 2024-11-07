import React, { useState, useEffect } from "react";
import UploadedAudio from "./UploadedAudio";
import { api } from "../utils/api";
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';


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
                alertify.error(`Ошибка получения данных через WebSocket: ${data.error}`)
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
            alertify.error(`Ошибка подключения в WebSocket: ${event}`)
        }
        return () => {
            ws.close();
        }
    }, [queue]);

      const playAudioQueue = async () => {
        alertify.success(`Начало проигрывания очереди`)
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
            alertify.error(`Ошибка воспроизведения ${currentItem.filename}: ${error?.response?.data?.detail}`)
          }
        }
        setQueue(queue.map(item => ({ filename: item.filename })));
        setIsPlaying(false)
        alertify.success(`Конец проигрывания очереди`)
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