import React from 'react';
import AudioUpload from './AudioUpload';
import Queue from './Queue';


export default function Main({ isAuthenticated }) {
    if (!isAuthenticated) return;
    return (
        <div>
            <AudioUpload />
            <Queue />
        </div>
    );
};
