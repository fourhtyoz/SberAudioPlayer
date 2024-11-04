import React, { useState, useRef } from 'react';
import axios from 'axios';


export default function AudioUpload() {
    const [audioFile, setAudioFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        setAudioFile(event.target.files[0]);
    };


    const handleUpload = async (event) => {
        event.preventDefault();
        console.log(event.target.input)

        if (!audioFile) {
            alert("Please select an audio file first.");
            return;
        }

        const formData = new FormData();
        formData.append('file', audioFile);

        try {
            await axios.post('http://localhost:8000/upload-audio/', formData, 
                { headers: {'Content-Type': 'multipart/form-data'} }
            );
            
            setUploadStatus('File uploaded successfully!');
            setAudioFile(null);
            fileInputRef.current.value = '';
            // setUploadedAudioUrl(`http://localhost:8000/uploads/${response.data.filename}`);
        } catch (error) {
            console.error("Failed to upload file:", error);
            setUploadStatus("File upload failed.");
        }
    };

    return (
        <div>
            <h2>Upload a new sound:</h2>
            <form onSubmit={handleUpload}>
                <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
            {uploadStatus && <p>{uploadStatus}</p>}
        </div>
    );
};
