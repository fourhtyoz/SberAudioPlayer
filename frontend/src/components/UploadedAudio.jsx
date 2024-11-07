import React from "react";
import { api } from "../utils/api";
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';


export default function UploadedAudio({ index, filename, disabled, isPlaying }) {
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
        <div>
            #{index+1}: {filename}
            {isPlaying && 'is playing now'}
            <button onClick={handleDelete} disabled={disabled}>Delete</button>
        </div>
    )
}