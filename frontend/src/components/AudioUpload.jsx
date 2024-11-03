import React, { useState } from 'react';
import axios from 'axios';


export default function AudioUpload() {
    const [audioFile, setAudioFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [uploadedAudioUrl, setUploadedAudioUrl] = useState('');

    const handleFileChange = (event) => {
        setAudioFile(event.target.files[0]);
    };

    const handleUpload = async (event) => {
    event.preventDefault();

    if (!audioFile) {
        alert("Please select an audio file first.");
        return;
    }

    const formData = new FormData();
    formData.append('file', audioFile);

    try {
        const response = await axios.post('http://localhost:8000/upload-audio', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
        });

        setUploadStatus("File uploaded successfully!");
        setUploadedAudioUrl(`http://localhost:8000/uploads/${response.data.filename}`);
        console.log(response.data);
    } catch (error) {
        console.error("Failed to upload file:", error);
        setUploadStatus("File upload failed.");
    }
    };

    return (
        <div>
            <h2>Upload a new sound</h2>
            <form onSubmit={handleUpload}>
                <input type="file" accept="audio/*" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
            {uploadStatus && <p>{uploadStatus}</p>}

            {uploadedAudioUrl && (
            <div>
                <h3>Audio Player</h3>
                <audio controls>
                    <source src={uploadedAudioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            </div>
            )}
        </div>
    );
};
