import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';


function AudioDropzone({ handleUpload }) {
    const onDrop = useCallback((acceptedFiles) => {
        console.log(acceptedFiles)

        for (let file of acceptedFiles) {
            handleUpload(file);
        }
    }, [handleUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'audio/*',
        // maxFiles: 1,
    });

  return (
    <div
        {...getRootProps()}
        style={{
        border: '2px dashed #b0b0b0', // Light gray border
        padding: '30px',
        textAlign: 'center',
        borderRadius: '8px',
        backgroundColor: isDragActive ? '#e0e0e0' : '#f5f5f5', // Darker gray when active
        color: '#555',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        // width: '500px',
        margin: '30px',
        }}
    >
        <input {...getInputProps()} />
        <p>Перенесите сюда аудио для загрузки или нажмите на поле для выбора</p>
    </div>
  );
}

export default AudioDropzone;
