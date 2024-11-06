import React, { useState } from "react";
import { api } from "../utils/api";


export default function UploadedAudio({ index, filename, disabled, isPlaying }) {
    const handleDelete = async () => {
        try {
            await api.post(`/delete-audio/?index=${index}`);
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