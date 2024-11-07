import React from 'react';
import AudioUpload from './AudioUpload';
import Queue from './Queue';
import styled from 'styled-components';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';


const SMain = styled.main`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

export default function Main() {
    const { isAuthenticated } = useContext(AuthContext)

    if (!isAuthenticated) return;
    
    return (
        <SMain>
            <AudioUpload />
            <Queue />
        </SMain>
    );
};
