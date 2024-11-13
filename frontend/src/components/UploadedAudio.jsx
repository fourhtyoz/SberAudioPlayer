import React, { useState } from "react";
import { api } from "../utils/api";
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import styled from "styled-components";
import PlayingAnimation from "./PlayingAnimation";


const SAudioWrapper = styled.div`
    display: flex;
`;

const SIndex = styled.h3`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-right: 10px;
    width: 40px;
`;

const SAudioCard = styled.div`
    border: 1px solid #cccccc;
    padding: 25px;
    background: #eaeaea;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    border-right: none;
    width: 335px;
    overflow: hidden;
`;

const SButton = styled.button`
    margin-bottom: 10px;
    padding: 25px;
    color: #fff;
    background-color: #000;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    border: 1px solid #000;
    display: block;
    margin-right: 1px;

    &:hover {
        border: 1px solid #cecece;
        color: #000;
        background-color: #FFF;
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
        border: 1px solid #cecece;
        color: white;
    }
`;

const SCardText = styled.span`
    margin-inline: 10px;
`;


export default function UploadedAudio({ index, filename, user, disabled, isPlaying, setIsPlaying }) {
    const [isOn, setIsOn] = useState(isPlaying)
    const handleDelete = async () => {
        try {
            const res = await api.post(`/delete-audio/?index=${index}`);
            if (res.status === 200) {
                alertify.success(`Файл ${filename} был удален из очереди`)
            } else {
                console.error('Failed to delete file:', res)
                alertify.error(`Ошибка при удалении файла ${filename} из очереди. Код ошибки: ${res.status}`)
            }
        } catch (error) {
            console.error(error)
            if (error?.response?.data?.detail) {
                alertify.error(`Ошибка при удалении файл ${filename} из очереди: ${error.response.data.detail}`)
            } else {
                alertify.error(`Ошибка при удалении файл ${filename} из очереди. Повторите попытку позже`)
            }
        }
    };

    const handlePlay = async () => {
        setIsPlaying(true)
        setIsOn(true)
        try {
            await api.get(`/play-audio/?filename=${filename}`);
        } catch (error) {
            console.error(error)
            if (error?.response?.data?.detail) {
                alertify.error(`Ошибка воспроизведения ${filename}: ${error.response.data.detail}`)
            } else {
                alertify.error(`Ошибка воспроизведения ${filename}. Повторите попытку позже`)
            }
        } finally {
            setIsPlaying(false)
            setIsOn(false)
        }
    }

    return (
        <SAudioWrapper>
            {isOn || isPlaying
            ? <PlayingAnimation/>
            : <SIndex>#{index+1}:</SIndex>
            }
            
            <SAudioCard>
                <SCardText>Название: {filename}</SCardText>
                <SCardText>Загрузил: {user}</SCardText>
            </SAudioCard>
            <SButton onClick={handlePlay} disabled={disabled}>Воспроизвести</SButton>
            <SButton onClick={handleDelete} disabled={disabled}>Удалить</SButton>
        </SAudioWrapper>
    )
}