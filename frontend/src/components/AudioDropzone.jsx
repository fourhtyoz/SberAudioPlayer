import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import { api } from '../utils/api';


function AudioDropzone() {
    const onDrop = useCallback((acceptedFiles) => {
        const handleUpload = async (file) => {
            if (!file) {
                alertify.alert('Ошибка при загрузке файла', 'Сначала необходимо выбрать файл')
                return;
            }
    
            const formData = new FormData();
            formData.append('file', file);
    
            try {
                const res = await api.post('/upload-audio/', formData, 
                    { headers: {'Content-Type': 'multipart/form-data'} }
                );
                if (res.status === 200) {
                    alertify.success('Файл успешно загружен')
                } else {
                    console.error("Failed to upload file:", res);
                    alertify.error(`Ошибка при загрузке файла. Код ошибки: ${res.status}`)
                }
            } catch (error) {
                console.error("Failed to upload file:", error);
                alertify.error(`Ошибка при загрузке файла: ${error?.response?.data?.detail}`)
            }
        };

        for (let file of acceptedFiles) {
            handleUpload(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'audio/*',
    });

  return (
    <div
        {...getRootProps()}
        style={{
            border: '2px dashed #b0b0b0',
            padding: '30px',
            textAlign: 'center',
            borderRadius: '8px',
            backgroundColor: isDragActive ? '#e0e0e0' : '#f5f5f5',
            color: '#555',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            margin: '30px',
        }}
    >
        <input {...getInputProps()} />
        <p>Перенесите сюда аудио для загрузки или нажмите на поле для выбора</p>
    </div>
  );
}

export default AudioDropzone;
