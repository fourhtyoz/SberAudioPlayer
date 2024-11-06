import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../utils/constants";


export default function UploadedAudio({ index, filename, disabled, isPlaying }) {
    const handleDelete = async () => {
        try {
            await axios.post(`${API_URL}/delete-audio/?index=${index}`);
        } catch (e) {
            console.error(e)
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