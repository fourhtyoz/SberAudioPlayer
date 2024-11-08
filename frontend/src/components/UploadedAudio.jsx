import React from "react";
import { api } from "../utils/api";
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import styled from "styled-components";


const SAudioWrapper = styled.div`
    display: flex;
`

const SIndex = styled.h3`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-right: 10px;
`

const SAudioCard = styled.div`
    border: 1px solid #cccccc;
    padding: 25px;
    // width: 500px;
    background: #eaeaea;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
`

const SDeleteButton = styled.button`
    margin-bottom: 10px;
    padding: 25px;
    color: #fff;
    background-color: #000;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    border: 1px solid #000;
    display: block;

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

const SCardText = styled.span`
    margin-inline: 10px;
`



export default function UploadedAudio({ index, filename, author, disabled, isPlaying }) {
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
            alertify.error(`Ошибка при удалении файл ${filename} из очереди: ${error?.response?.data?.detail}`)
        }
    };

    return (
        <SAudioWrapper>
            <SIndex>#{index+1}:</SIndex>
            <SAudioCard>
                <SCardText>Название: {filename}</SCardText>
                <SCardText>Загрузил: {author}</SCardText>
                <SCardText>Статус: {isPlaying ? 'воспроизводится' : 'не играет'}</SCardText>
            </SAudioCard>
            <SDeleteButton onClick={handleDelete} disabled={disabled}>Удалить</SDeleteButton>
        </SAudioWrapper>
    )
}