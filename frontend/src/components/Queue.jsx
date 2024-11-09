import React, { useState, useEffect } from "react";
import UploadedAudio from "./UploadedAudio";
import { api } from "../utils/api";
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import styled from "styled-components";


const SPlayButton = styled.button`
    margin-top: 10px;
    padding: 10px 20px;
    color: #fff;
    background-color: #000;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    border: 1px solid #000;
    display: block;
    width: 100%;

    &:hover {
        border: 1px solid #cecece;
        color: #000;
        background-color: #FFF;
    }

    &:active {
        transform: scale(0.98);
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`

const SError = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: red;
    margin-bottom: 20px;
    font-weight: bold;
`


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
                setError('')
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
            alertify.error(`Ошибка подключения к WebSocket`)
        }
        return () => {
            ws.close();
        }
    }, [queue]);

      const playAudioQueue = async () => {
        alertify.success(`Начало воспроизведения очереди`)
        setIsPlaying(true)
        for (let i = 0; i < queue.length; i++) {
            const currentItem = queue[i];
            
            setQueue(queue.map((item, index) => 
                index === i ? { ...item, is_playing: true } : { filename: item.filename, user: item.user }
            ));
        
            try {
                await api.get(`/play-audio/?filename=${currentItem.filename}`);
            } catch (error) {
                // console.error("Error playing audio:", error);
                alertify.error(`Ошибка воспроизведения ${currentItem.filename}: ${error?.response?.data?.detail}`)
                break;
            };
        }
        setQueue(queue.map(item => ({ filename: item.filename, user: item.user })));
        setIsPlaying(false);
      };

      return (
        <div>
            {error && <SError>{error}</SError>}
            {queue.length < 1 && 'Пока в очереди ничего нет' }
            {queue.map((item, index) => <UploadedAudio key={index} index={index} filename={item.filename} user={item.user} disabled={isPlaying} isPlaying={item.is_playing}/>)}
            {queue.length > 0 && <SPlayButton onClick={playAudioQueue} disabled={isPlaying}>Воспроизвести очередь</SPlayButton>}
        </div>
    );
}