import React, { useState, useRef } from 'react';
import { api } from '../utils/api';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import styled from 'styled-components';
import AudioDropzone from './AudioDropzone';


const SWrapper = styled.div`
`;


export default function UploadAudio() {
    // const [audioFile, setAudioFile] = useState(null);
    // const fileInputRef = useRef(null);

    // const handleFileChange = (event) => {
    //     setAudioFile(event.target.files[0]);
    // };

    const handleUpload = async (file) => {
        // event.preventDefault();

        if (!file) {
            alertify.alert('Ошибка при загрузке файла', 'Сначала необходимо выбрать файл')
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('http://localhost:8000/upload-audio/', formData, 
                { headers: {'Content-Type': 'multipart/form-data'} }
            );
            if (res.status === 200) {
                alertify.success('Файл успешно загружен')
                // setAudioFile(null);
                // fileInputRef.current.value = '';
            } else {
                console.error("Failed to upload file:", res);
                alertify.error(`Ошибка при загрузке файла. Код ошибки: ${res.status}`)
            }
        } catch (error) {
            console.error("Failed to upload file:", error);
            alertify.error(`Ошибка при загрузке файла: ${error?.response?.data?.detail}`)
        }
    };

    return (
        <SWrapper>
            <AudioDropzone handleUpload={handleUpload} />
            {/* <STitle>Upload a new sound:</STitle> */}
            {/* <form onSubmit={handleUpload}>
                <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleFileChange} />
                <button type="submit" disabled={!audioFile} >Upload</button>
            </form> */}
        </SWrapper>
    );
};
